import { describe, expect, test } from "@jest/globals";
import { CapTable, ShareClassInterface } from "../src/index";

const org = {
  newShareClass: "Series A",
  preMoneyValuation: 30000000,
  newMoneyRaised: 1000000,
  noteConversion: true,
  notesConvertToNewClass: true,
  expandOptionPool: true,
  postMoneyOptionPoolSize: 0.2,
  notes: [
    {
      conversionCap: 5000000,
      conversionDiscount: 0.2,
      conversionDate: new Date(),
      conversionAmount: 500000,
    },
  ],
  foundersNumberOfShares: 8000000,
  commonNumberOfShares: 1000000,
  warrantsNumberOfShares: 100000,
  grantedOptionsNumberOfShares: 800000,
  oldOptionsNumberOfShares: 100000,
};

describe("a capitalization table", () => {
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
        postMoneyDilution: expect.closeTo(-0.282),
        postMoneyPercentChange: expect.closeTo(-0.226),
        postMoneyPercentOwnership: expect.closeTo(0.574),
        postMoneyValueChange: expect.closeTo(-6200247, 0), // Spreadsheet -6200246
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
        postMoneyDilution: Infinity,
        postMoneyPercentChange: expect.closeTo(0.072),
        postMoneyPercentOwnership: expect.closeTo(0.072),
        postMoneyValueChange: expect.closeTo(2224969, 0),
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
        postMoneyDilution: Infinity,
        postMoneyPercentChange: expect.closeTo(0.032),
        postMoneyPercentOwnership: expect.closeTo(0.032),
        postMoneyValueChange: expect.closeTo(999999, 0),
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
        postMoneyDilution: Infinity,
        postMoneyPercentChange: expect.closeTo(0.178),
        postMoneyPercentOwnership: expect.closeTo(0.178),
        postMoneyValueChange: expect.closeTo(5525339, 0),
      })
    );
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
});
