import { describe, expect, test } from "@jest/globals";
import { Organization, CapTable, ShareClass } from "../src/index";
import { AbstractNoteFactory } from "../src/Note";

let org: Organization;
beforeAll(() => {
  org = {
    newShareClass: "Series A",
    preMoneyValuation: 30000000,
    newMoneyRaised: 1000000,
    noteConversion: true,
    notesConvertToNewClass: true,
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
      30000000 / 10000000,
      1000000,
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
    expect(spff).toBeCloseTo(2.16364, 5);
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
    expect(table.sharePriceForFinancing()).toBeCloseTo(2.16364, 5);
  });

  test("has total post-money shares", () => {
    expect(table.totalPostMoneyShares()).toBe(14327725);
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
    const shareClass = findByName(
      table.shareClasses(),
      "Convertible Notes Into New Share Class"
    );
    expect(shareClass).toEqual(
      expect.objectContaining({
        preMoneyShares: 0,
        postMoneyShares: 1000000,
      })
    );
  });

  test("new money share class", () => {
    const shareClass = findByName(table.shareClasses(), "New Money Equity");
    expect(shareClass).toEqual(
      expect.objectContaining({
        preMoneyShares: 0,
        postMoneyShares: 462184,
      })
    );
  });

  test("new options for pool share class", () => {
    const shareClass = findByName(table.shareClasses(), "New Options for Pool");
    expect(shareClass).toEqual(
      expect.objectContaining({
        preMoneyShares: 0,
        postMoneyShares: 2865541,
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
    expect(table.sharePriceForFinancing()).toBeCloseTo(2.06541, 5);
  });

  test("total post-money ownership value", () => {
    const expected = org.preMoneyValuation + org.newMoneyRaised;
    const actual = table.totalPostMoneyOwnershipValue();
    const diff = Math.abs(expected - actual);
    expect(diff / expected).toBeCloseTo(0.0);
  });

  test("New money share class post-money ownership value", () => {
    const shareClass = findByName(table.shareClasses(), "New Money Equity");
    const expected = org.newMoneyRaised;
    const actual = shareClass.postMoneyOwnershipValue(
      table.sharePriceForFinancing()
    );
    const diff = Math.abs(expected - actual);
    expect(diff).toBeLessThan(table.sharePriceForFinancing());
  });

  test("New options share class post-money ownership %", () => {
    const shareClass = findByName(table.shareClasses(), "New Options for Pool");
    const totalPostMoneyShares = table.totalPostMoneyShares();
    expect(
      shareClass.postMoneyPercentOwnership(totalPostMoneyShares)
    ).toBeCloseTo(org.postMoneyOptionPoolSize, 2);
  });

  test("convertable note share class", () => {
    const shareClass = findByName(
      table.shareClasses(),
      "Convertible Notes Into New Share Class"
    );
    expect(shareClass).toEqual(
      expect.objectContaining({
        preMoneyShares: 0,
        postMoneyShares: 1523155,
      })
    );
  });

  test("new money equity share class", () => {
    const shareClass = findByName(table.shareClasses(), "New Money Equity");
    expect(shareClass).toEqual(
      expect.objectContaining({
        preMoneyShares: 0,
        postMoneyShares: 484165,
      })
    );
  });

  test("new options for pool share class", () => {
    const shareClass = findByName(table.shareClasses(), "New Options for Pool");
    expect(shareClass).toEqual(
      expect.objectContaining({
        preMoneyShares: 0,
        postMoneyShares: 3001825,
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
