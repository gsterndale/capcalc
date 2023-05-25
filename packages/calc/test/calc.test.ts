import { describe, expect, test } from "@jest/globals";
import { CapTable, ShareClass } from "../src/index";

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
    },
  ],
  preMoneyShareClasses: [
    { name: "Founders' Shares", numberOfShares: 8000000 },
    { name: "Rest of Common", numberOfShares: 1000000 },
    { name: "Warrants", numberOfShares: 100000 },
    { name: "Granted Options", numberOfShares: 800000 },
    { name: "Options Available before", numberOfShares: 100000 },
  ],
};

describe("a capitalization table", () => {
  const table = new CapTable(org);

  test("has share classes", () => {
    expect(table.shareClasses.length).toBeTruthy;
  });

  test("has total pre-money shares", () => {
    expect(table.totalPreMoneyShares).toBe(10000000);
  });

  test("has total post-money shares", () => {
    expect(table.totalPostMoneyShares).toBe(13932778);
  });
});

describe("a captable's share classes", () => {
  const table = new CapTable(org);
  const founders = findByName(table.shareClasses, "Founders' Shares");
  const note = findByName(
    table.shareClasses,
    "Convertible Notes Into New Share Class"
  );
  const newMoney = findByName(table.shareClasses, "New Money Equity");
  const poolOptions = findByName(table.shareClasses, "New Options for Pool");

  test("a pre-money share class's number of shares", () => {
    expect(founders.preMoneyShares).toBe(8000000);
    expect(founders.postMoneyShares).toBe(8000000);
  });

  test("a pre-money share class's value", () => {
    expect(founders.preMoneyOwnershipValue).toBe(24000000);
    expect(founders.postMoneyOwnershipValue).toBe(17799753);
  });

  test("a convertable note share class's number of shares", () => {
    expect(note.preMoneyShares).toBe(0);
    expect(note.postMoneyShares).toBe(1000000);
  });

  test("a convertable note share class's value", () => {
    expect(note.preMoneyOwnershipValue).toBe(0);
    expect(note.postMoneyOwnershipValue).toBe(2224969);
  });

  test("a new money share class's number of shares", () => {
    expect(newMoney.preMoneyShares).toBe(0);
    expect(newMoney.postMoneyShares).toBe(449444);
  });

  test("a new money share class's value", () => {
    expect(newMoney.preMoneyOwnershipValue).toBe(0);
    expect(newMoney.postMoneyOwnershipValue).toBe(1000000);
  });

  test("a new options for pool share class's value", () => {
    expect(poolOptions.preMoneyShares).toBe(0);
    expect(poolOptions.postMoneyShares).toBe(2483333);
  });

  test("a new options for pool share class's value", () => {
    expect(poolOptions.preMoneyOwnershipValue).toBe(0);
    expect(poolOptions.postMoneyOwnershipValue).toBe(5525340);
  });

  function findByName(objs: ShareClass[], name: string): ShareClass {
    const found = objs.find((obj) => obj.name === name);
    if (found === undefined)
      throw new Error(`ShareClass named ${name} not found.`);
    return found;
  }
});
