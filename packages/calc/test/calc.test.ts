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

/*
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

  test("has total post-money shares", () => {
    expect(table.totalPostMoneyShares).toBe(13932777); // Spreadsheet value 13932778
  });

  test("has total post-money ownership value", () => {
    expect(table.totalPostMoneyOwnershipValue).toBeCloseTo(30999999, 0); // Spreadsheet 31000000
  });

  test("founder share class", () => {
    const shareClass = findByName(table.shareClasses, "Founders' Shares");
    expect(shareClass).toEqual(
      expect.objectContaining({
        preMoneyShares: 8000000,
        preMoneyPercentOwnership: expect.closeTo(0.8),
        preMoneyOwnershipValue: expect.closeTo(24000000),
        postMoneyShares: 8000000,
        postMoneyOwnershipValue: expect.closeTo(17799753, 0),
        postMoneyValueChange: expect.closeTo(-6200247, 0), // Spreadsheet -6200246
        postMoneyPercentChange: expect.closeTo(-0.226),
        postMoneyPercentOwnership: expect.closeTo(0.574),
        postMoneyDilution: expect.closeTo(-0.282),
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
        postMoneyShares: 1000000, // 1,000,000 from Cap, 265,603 from discount
        postMoneyOwnershipValue: expect.closeTo(2224969, 0), // $2,224,969 from Cap, $625,000 from discount
        postMoneyValueChange: expect.closeTo(2224969, 0),
        postMoneyPercentChange: expect.closeTo(0.072),
        postMoneyPercentOwnership: expect.closeTo(0.072),
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
        postMoneyShares: 449444,
        postMoneyOwnershipValue: expect.closeTo(999999, 0), // Spreadsheet 1000000
        postMoneyValueChange: expect.closeTo(999999, 0),
        postMoneyPercentChange: expect.closeTo(0.032),
        postMoneyPercentOwnership: expect.closeTo(0.032),
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
        postMoneyShares: 2483333,
        postMoneyOwnershipValue: expect.closeTo(5525339, 0), // Spreadsheet 5525340
        postMoneyValueChange: expect.closeTo(5525339, 0),
        postMoneyPercentChange: expect.closeTo(0.178),
        postMoneyPercentOwnership: expect.closeTo(0.178),
        postMoneyDilution: Infinity,
      })
    );
  });
});
*/

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

  test.only("convertable note share class", () => {
    const shareClass = findByName(
      table.shareClasses,
      "Convertible Notes Into New Share Class"
    );
    expect(shareClass).toEqual(
      expect.objectContaining({
        preMoneyShares: 0,
        preMoneyPercentOwnership: expect.closeTo(0),
        preMoneyOwnershipValue: expect.closeTo(0),
        postMoneyShares: 1523114,
        postMoneyOwnershipValue: expect.closeTo(3262314, 0),
        postMoneyValueChange: expect.closeTo(3262314, 0),
        postMoneyPercentChange: expect.closeTo(0.105),
        postMoneyPercentOwnership: expect.closeTo(0.105),
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
