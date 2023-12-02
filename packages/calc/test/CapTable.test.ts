import { describe, expect, test } from "@jest/globals";
import { Organization, CapTable, ShareClass } from "../src/index";
import { AbstractNoteFactory } from "../src/Note";

let org: Organization;
beforeAll(() => {
  org = {
    name: "Pied Piper LLC",
    description: "",
    newShareClass: "Series A",
    preMoneyValuation: 30000000,
    newMoneyRaised: 1000000,
    noteConversion: true,
    expandOptionPool: true,
    postMoneyOptionPoolSize: 0.2,
    notesFields: [],
    foundersNumberOfShares: 8000000,
    commonNumberOfShares: 1000000,
    warrantsNumberOfShares: 100000,
    grantedOptionsNumberOfShares: 800000,
    oldOptionsNumberOfShares: 100000,
  };
});

describe("share price for financing given one override convertible note", () => {
  test("is calculted iteratively", () => {
    const spff = CapTable.calcSharePriceForFinancing(
      10000000,
      30000000 + 1000000,
      30000000,
      100000,
      0.2,
      [
        AbstractNoteFactory.create({
          conversionCap: 5000000,
          conversionDiscount: 0.2,
          conversionDate: new Date(),
          principalInvested: 500000,
        }),
      ]
    );
    expect(spff).toBeCloseTo(2.1286, 5);
  });

  test("is calculted iteratively with no defined post money option pool size", () => {
    const spff = CapTable.calcSharePriceForFinancing(
      12565000,
      33000000,
      30000000,
      1000000,
      undefined,
      [
        AbstractNoteFactory.create({
          conversionCap: 100000000,
          conversionDiscount: 0.5,
          conversionDate: new Date(),
          principalInvested: 1000000,
        }),
      ]
    );
    expect(spff).toBeCloseTo(2.2284, 5);
  });
});

describe("a capitalization table with one override convertible note", () => {
  let table: CapTable;
  beforeEach(() => {
    org.notesFields = [
      {
        conversionCap: 5000000,
        conversionDiscount: 0.2,
        conversionDate: new Date(),
        principalInvested: 500000,
      },
    ];
    table = new CapTable(org);
  });

  test("has share classes", () => {
    expect(table.shareClasses().length).toBeTruthy;
  });

  test("has total pre-money shares", () => {
    expect(table.totalPreMoneyShares()).toBe(10000000);
  });

  test("has pre-money share price", () => {
    expect(table.preMoneySharePrice()).toBe(30000000 / 10000000);
  });

  test("has total pre-money ownership value", () => {
    expect(table.totalPreMoneyOwnershipValue()).toBeCloseTo(30000000);
  });

  test("share price for financing", () => {
    expect(table.sharePriceForFinancing()).toBeCloseTo(2.1286, 5);
  });

  test("has total post-money shares", () => {
    const expected = 14563837;
    expect(table.totalPostMoneyShares() / expected).toBeCloseTo(1.0, 5);
  });

  test("has total post-money ownership value", () => {
    const expected = org.preMoneyValuation + org.newMoneyRaised;
    const actual = table.totalPostMoneyOwnershipValue();
    const diff = Math.abs(expected - actual);
    expect(diff / expected).toBeCloseTo(0.0);
  });

  test("founder share class", () => {
    const shareClass = findByName(table.shareClasses(), "Founders' Shares");
    expect(shareClass).toEqual(
      expect.objectContaining({
        preMoneyShares: 8000000,
        postMoneyShares: 8000000,
      })
    );
  });

  test("convertable note share class", () => {
    const shareClass = findByName(table.shareClasses(), "Convertible Notes");
    expect(shareClass).toEqual(
      expect.objectContaining({
        preMoneyShares: 0,
        postMoneyShares: expect.closeTo(1281277, -3),
      })
    );
  });

  test("new money share class", () => {
    const shareClass = findByName(table.shareClasses(), "Preferred Investors");
    expect(shareClass).toEqual(
      expect.objectContaining({
        preMoneyShares: 0,
        postMoneyShares: expect.closeTo(469793, -3),
      })
    );
  });

  test("new options for pool share class", () => {
    const shareClass = findByName(table.shareClasses(), "Options Increase");
    expect(shareClass).toEqual(
      expect.objectContaining({
        preMoneyShares: 0,
        postMoneyShares: expect.closeTo(2812767, -3),
      })
    );
  });
});

describe("a capitalization table with a bunch of convertible notes", () => {
  let table: CapTable;
  beforeEach(() => {
    org.notesFields = [
      // Principal Invested	Interest start date	Interest rate	Interest Converts	Conversion Cap	Conversion Discount	Conversion Date
      // $200,000	1/2/15	6%	No	$3,500,000	20%	5/15/23
      // $200,000	1/3/15	6%	No	$5,500,000	10%	5/15/23
      // $200,000	11/10/20	6%	Yes	$8,000,000	10%	5/15/23
      // $200,000	1/3/15	6%	Yes	$10,000,000	20%	5/15/23
      {
        principalInvested: 200000,
        interestRate: 0.0,
        interestStartDate: new Date(2015, 1, 15),
        conversionCap: 3500000,
        conversionDiscount: 0.2,
        conversionDate: new Date(2023, 4, 15),
      },
      {
        principalInvested: 200000,
        interestRate: 0.0,
        interestStartDate: new Date(2015, 0, 3),
        conversionCap: 5500000,
        conversionDiscount: 0.1,
        conversionDate: new Date(2023, 4, 15),
      },
      {
        principalInvested: 200000,
        interestRate: 0.06,
        interestStartDate: new Date(2020, 10, 10),
        conversionCap: 8000000,
        conversionDiscount: 0.1,
        conversionDate: new Date(2023, 4, 15),
      },
      {
        principalInvested: 200000,
        interestRate: 0.06,
        interestStartDate: new Date(2015, 0, 3),
        conversionCap: 10000000,
        conversionDiscount: 0.2,
        conversionDate: new Date(2023, 4, 15),
      },
    ];
    table = new CapTable(org);
  });

  test("share price for financing", () => {
    expect(table.sharePriceForFinancing()).toBeCloseTo(2.0035, 5);
  });

  test("total post-money ownership value", () => {
    const expected = org.preMoneyValuation + org.newMoneyRaised;
    const actual = table.totalPostMoneyOwnershipValue();
    const diff = Math.abs(expected - actual);
    expect(diff / expected).toBeCloseTo(0.0);
  });

  test("New money share class post-money ownership value", () => {
    const shareClass = findByName(table.shareClasses(), "Preferred Investors");
    const expected = org.newMoneyRaised;
    const actual = shareClass.postMoneyOwnershipValue(
      table.sharePriceForFinancing()
    );
    const diff = Math.abs(expected - actual);
    expect(diff).toBeLessThan(table.sharePriceForFinancing());
  });

  test("New options share class post-money ownership %", () => {
    const newOptionsShareClass = findByName(
      table.shareClasses(),
      "Options Increase"
    );
    const oldOptionsShareClass = findByName(
      table.shareClasses(),
      "Options Available"
    );
    const totalPostMoneyShares = table.totalPostMoneyShares();
    expect(
      newOptionsShareClass.postMoneyPercentOwnership(totalPostMoneyShares) +
        oldOptionsShareClass.postMoneyPercentOwnership(totalPostMoneyShares)
    ).toBeCloseTo(org.postMoneyOptionPoolSize, 2);
  });

  test("convertable note share class", () => {
    const shareClass = findByName(table.shareClasses(), "Convertible Notes");
    expect(shareClass).toEqual(
      expect.objectContaining({
        preMoneyShares: 0,
        postMoneyShares: expect.closeTo(1979276, -3),
      })
    );
  });

  test("new money equity share class", () => {
    const shareClass = findByName(table.shareClasses(), "Preferred Investors");
    expect(shareClass).toEqual(
      expect.objectContaining({
        preMoneyShares: 0,
        postMoneyShares: expect.closeTo(499127, -3),
      })
    );
  });

  test("new options for pool share class", () => {
    const shareClass = findByName(table.shareClasses(), "Options Increase");
    expect(shareClass).toEqual(
      expect.objectContaining({
        preMoneyShares: 0,
        postMoneyShares: expect.closeTo(2994584, -3),
      })
    );
  });
});

function findByName(objs: ShareClass[], name: string): ShareClass {
  const found = objs.find((obj) => obj.name === name);
  if (found === undefined)
    throw new Error(`ShareClass named ${name} not found.`);
  return found;
}
