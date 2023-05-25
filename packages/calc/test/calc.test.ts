import { describe, expect, test } from "@jest/globals";
import { CapTable } from "../src/index";

describe("building a capitalization table", () => {
  const org = {
    newShareClass: "Series A",
    preMoneyValuation: 30000000,
    newMoneyRaised: 1000000,
    noteConversion: true,
    notesConverttoNewClass: true,
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
  const table = new CapTable(org);

  test("has share classes", () => {
    expect(table.shareClasses.length).toBeTruthy;
  });

  test("has total pre-money shares", () => {
    expect(table.totalPreMoneyShares).toBe(10000000);
  });
});
