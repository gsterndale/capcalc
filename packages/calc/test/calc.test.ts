import { describe, expect, test } from "@jest/globals";
import { Organization, CapTable, ShareClassInterface } from "../src/index";

const org: Organization = {
  newShareClass: "Series A",
  preMoneyValuation: 30000000,
  newMoneyRaised: 1000000,
  noteConversion: true,
  notesConvertToNewClass: true,
  expandOptionPool: true,
  postMoneyOptionPoolSize: 0.2,
  notes: [],
  foundersNumberOfShares: 8000000,
  commonNumberOfShares: 1000000,
  warrantsNumberOfShares: 100000,
  grantedOptionsNumberOfShares: 800000,
  oldOptionsNumberOfShares: 100000,
};

describe("a capitalization table with one override convertible note", () => {
  org.notes = [
    {
      conversionCap: 5000000,
      conversionDiscount: 0.2,
      conversionDate: new Date(),
      conversionAmount: 500000,
    },
  ];
  const table = new CapTable(org);

  test("has share classes", () => {
    expect(table.shareClasses.length).toBeTruthy;
  });

  test("has total pre-money shares", () => {
    expect(table.totalPreMoneyShares).toBe(10000000);
  });

  test("has total pre-money ownership value", () => {
    expect(table.totalPreMoneyOwnershipValue).toBeCloseTo(30000000);
  });

  test("share price for financing", () => {
    expect(table.sharePriceForFinancing).toBeCloseTo(2.16364, 5);
  });

  test("has total post-money shares", () => {
    expect(table.totalPostMoneyShares).toBe(14327725);
  });

  test("has total post-money ownership value", () => {
    const expected = org.preMoneyValuation + org.newMoneyRaised;
    const actual = table.totalPostMoneyOwnershipValue;
    const diff = Math.abs(expected - actual);
    expect(diff / expected).toBeCloseTo(0.0);
  });

  test("founder share class", () => {
    const shareClass = findByName(table.shareClasses, "Founders' Shares");
    expect(shareClass).toEqual(
      expect.objectContaining({
        preMoneyShares: 8000000,
        preMoneyPercentOwnership: expect.closeTo(0.8),
        preMoneyOwnershipValue: expect.closeTo(24000000),
        postMoneyShares: 8000000,
        postMoneyOwnershipValue: expect.closeTo(17309120.0, 0),
        postMoneyValueChange: expect.closeTo(-6690880.0, 0),
        postMoneyPercentChange: expect.closeTo(-0.2416),
        postMoneyPercentOwnership: expect.closeTo(0.5584),
        postMoneyDilution: expect.closeTo(-0.3021),
      })
    );
  });

  test("convertable note share class", () => {
    const shareClass = findByName(
      table.shareClasses,
      "Convertible Notes Into New Share Class"
    );
    expect(shareClass).toEqual(
      expect.objectContaining({
        preMoneyShares: 0,
        preMoneyPercentOwnership: expect.closeTo(0),
        preMoneyOwnershipValue: expect.closeTo(0),
        postMoneyShares: 1000000,
        postMoneyOwnershipValue: expect.closeTo(2163640.0, 0),
        postMoneyValueChange: expect.closeTo(2163640.0, 0),
        postMoneyPercentChange: expect.closeTo(0.0698),
        postMoneyPercentOwnership: expect.closeTo(0.0698),
        postMoneyDilution: Infinity,
      })
    );
  });

  test("new money share class", () => {
    const shareClass = findByName(table.shareClasses, "New Money Equity");
    expect(shareClass).toEqual(
      expect.objectContaining({
        preMoneyShares: 0,
        preMoneyPercentOwnership: expect.closeTo(0),
        preMoneyOwnershipValue: expect.closeTo(0),
        postMoneyShares: 462184,
        postMoneyOwnershipValue: expect.closeTo(999999.79, 0),
        postMoneyValueChange: expect.closeTo(999999.79, 0),
        postMoneyPercentChange: expect.closeTo(0.0323),
        postMoneyPercentOwnership: expect.closeTo(0.0323),
        postMoneyDilution: Infinity,
      })
    );
  });

  test("new options for pool share class", () => {
    const shareClass = findByName(table.shareClasses, "New Options for Pool");
    expect(shareClass).toEqual(
      expect.objectContaining({
        preMoneyShares: 0,
        preMoneyPercentOwnership: expect.closeTo(0),
        preMoneyOwnershipValue: expect.closeTo(0),
        postMoneyShares: 2865541,
        postMoneyOwnershipValue: expect.closeTo(6200000.0, -1),
        postMoneyValueChange: expect.closeTo(6200000.0, -1),
        postMoneyPercentChange: expect.closeTo(0.2),
        postMoneyPercentOwnership: expect.closeTo(0.2),
        postMoneyDilution: Infinity,
      })
    );
  });
});

describe("a capitalization table with a bunch of convertible notes", () => {
  org.notes = [
    // Principal Invested	Interest start date	Interest rate	Interest Converts	Conversion Cap	Conversion Discount	Conversion Date
    // $200,000	1/2/15	6%	No	$3,500,000	20%	5/15/23
    // $200,000	1/3/15	6%	No	$5,500,000	10%	5/15/23
    // $200,000	11/10/20	6%	Yes	$8,000,000	10%	5/15/23
    // $200,000	1/3/15	6%	Yes	$10,000,000	20%	5/15/23
    {
      principalInvested: 200000,
      interestRate: 0.06,
      interestStartDate: new Date(2015, 1, 15),
      interestConverts: false,
      conversionCap: 3500000,
      conversionDiscount: 0.2,
      conversionDate: new Date(2023, 4, 15),
    },
    {
      principalInvested: 200000,
      interestRate: 0.06,
      interestStartDate: new Date(2015, 0, 3),
      interestConverts: false,
      conversionCap: 5500000,
      conversionDiscount: 0.1,
      conversionDate: new Date(2023, 4, 15),
    },
    {
      principalInvested: 200000,
      interestRate: 0.06,
      interestStartDate: new Date(2020, 10, 10),
      interestConverts: true,
      conversionCap: 8000000,
      conversionDiscount: 0.1,
      conversionDate: new Date(2023, 4, 15),
    },
    {
      principalInvested: 200000,
      interestRate: 0.06,
      interestStartDate: new Date(2015, 0, 3),
      interestConverts: true,
      conversionCap: 10000000,
      conversionDiscount: 0.2,
      conversionDate: new Date(2023, 4, 15),
    },
  ];
  const table = new CapTable(org);

  test("share price for financing", () => {
    expect(table.sharePriceForFinancing).toBeCloseTo(2.06541, 5);
  });

  test("total post-money ownership value", () => {
    const expected = org.preMoneyValuation + org.newMoneyRaised;
    const actual = table.totalPostMoneyOwnershipValue;
    const diff = Math.abs(expected - actual);
    expect(diff / expected).toBeCloseTo(0.0);
  });

  test("New money share class post-money ownership value", () => {
    const shareClass = findByName(table.shareClasses, "New Money Equity");
    const expected = org.newMoneyRaised;
    const actual = shareClass.postMoneyOwnershipValue;
    const diff = Math.abs(expected - actual);
    expect(diff).toBeLessThan(table.sharePriceForFinancing);
  });

  test("New options share class post-money ownership %", () => {
    const shareClass = findByName(table.shareClasses, "New Options for Pool");
    expect(shareClass.postMoneyPercentOwnership).toBeCloseTo(
      org.postMoneyOptionPoolSize,
      2
    );
  });

  test("convertable note share class", () => {
    const shareClass = findByName(
      table.shareClasses,
      "Convertible Notes Into New Share Class"
    );
    expect(shareClass).toEqual(
      expect.objectContaining({
        preMoneyShares: 0,
        preMoneyPercentOwnership: 0,
        preMoneyOwnershipValue: 0,
        postMoneyShares: 1523155,
        postMoneyOwnershipValue: expect.closeTo(3145939.57, 0),
        postMoneyValueChange: expect.closeTo(3145939.57, 0),
        postMoneyPercentOwnership: expect.closeTo(0.1015),
        postMoneyPercentChange: expect.closeTo(0.1015),
        postMoneyDilution: Infinity,
      })
    );
  });

  test("new money equity share class", () => {
    const shareClass = findByName(table.shareClasses, "New Money Equity");
    expect(shareClass).toEqual(
      expect.objectContaining({
        preMoneyShares: 0,
        preMoneyPercentOwnership: 0,
        preMoneyOwnershipValue: 0,
        postMoneyShares: 484165,
        postMoneyOwnershipValue: expect.closeTo(999999.23, 0),
        postMoneyValueChange: expect.closeTo(999999.23, 0),
        postMoneyPercentOwnership: expect.closeTo(0.0323),
        postMoneyPercentChange: expect.closeTo(0.0323),
        postMoneyDilution: Infinity,
      })
    );
  });

  test("new options for pool share class", () => {
    const shareClass = findByName(table.shareClasses, "New Options for Pool");
    expect(shareClass).toEqual(
      expect.objectContaining({
        preMoneyShares: 0,
        preMoneyPercentOwnership: 0,
        preMoneyOwnershipValue: 0,
        postMoneyShares: 3001825,
        postMoneyOwnershipValue: expect.closeTo(6200000, -1),
        postMoneyValueChange: expect.closeTo(6200000, -1),
        postMoneyPercentOwnership: expect.closeTo(0.2),
        postMoneyPercentChange: expect.closeTo(0.2),
        postMoneyDilution: Infinity,
      })
    );
  });
});

function findByName(
  objs: ShareClassInterface[],
  name: string
): ShareClassInterface {
  const found = objs.find((obj) => obj.name === name);
  if (found === undefined)
    throw new Error(`ShareClass named ${name} not found.`);
  return found;
}
