import { describe, expect, test } from "@jest/globals";
import { Organization, CapTable, ShareClass } from "../src/index";

type StringNumberMap = {
  [key: string]: number | undefined;
};

function postMoneySharesByName(table: CapTable): StringNumberMap {
  return table
    .shareClasses()
    .reduce((memo: StringNumberMap, shareClass: ShareClass) => {
      memo[shareClass.name] = shareClass.postMoneyShares;
      return memo;
    }, {});
}

describe("Discount option increase", () => {
  test("has correct postMoneyShares", () => {
    let org = {
      name: "Pied Piper LLC",
      description: "",
      newShareClass: "Series Preferred 1",
      preMoneyValuation: 30000000,
      newMoneyRaised: 3000000,
      noteConversion: true,
      notesConvertToNewClass: true,
      expandOptionPool: true,
      postMoneyOptionPoolSize: 0.15,
      foundersNumberOfShares: 0,
      commonNumberOfShares: 8500000,
      warrantsNumberOfShares: 65000,
      grantedOptionsNumberOfShares: 3000000,
      oldOptionsNumberOfShares: 1000000,
      notesFields: [
        {
          principalInvested: 1000000,
          interestStartDate: new Date(2015, 1, 1),
          interestRate: 0,
          conversionCap: 100000000,
          conversionDiscount: 0.5,
          conversionDate: new Date(2021, 10, 1),
        },
      ],
    };

    const table = new CapTable(org);

    expect(table.sharePriceForFinancing()).toBeCloseTo(1.9931, 4); // Spreadsheet rounds to 4 decimal places

    const actual = postMoneySharesByName(table);
    expect(actual).toMatchObject({
      "Founders' Shares": 0,
      "Rest of Common": 8500000,
      Warrants: 65000,
      "Convertible Notes Into New Share Class": 1003462,
      "New Money Equity": 1505193,
      "Granted Options": 3000000,
      "Options Available Before": 1000000,
      "New Options for Pool": expect.closeTo(1483586, -2),
    });
  });
});

describe("Discount no option increase", () => {
  test("has correct postMoneyShares", () => {
    let org = {
      name: "Pied Piper LLC",
      description: "",
      newShareClass: "Series Preferred 1",
      preMoneyValuation: 30000000,
      newMoneyRaised: 3000000,
      noteConversion: true,
      notesConvertToNewClass: true,
      expandOptionPool: false,
      postMoneyOptionPoolSize: 0.15, // This is ignored because expandOptionPool is false
      foundersNumberOfShares: 0,
      commonNumberOfShares: 8500000,
      warrantsNumberOfShares: 65000,
      grantedOptionsNumberOfShares: 3000000,
      oldOptionsNumberOfShares: 1000000,
      notesFields: [
        {
          principalInvested: 1000000,
          interestStartDate: new Date(2015, 1, 1),
          interestRate: 0,
          conversionCap: 100000000,
          conversionDiscount: 0.5,
          conversionDate: new Date(2021, 10, 1),
        },
      ],
    };

    const table = new CapTable(org);
    const actual = postMoneySharesByName(table);
    expect(actual).toMatchObject({
      "Founders' Shares": 0,
      "Rest of Common": 8500000,
      Warrants: 65000,
      "Convertible Notes Into New Share Class": 897505,
      "New Money Equity": expect.closeTo(1346258, -2),
      "Granted Options": 3000000,
      "Options Available Before": 1000000,
      "New Options for Pool": 0,
    });
  });
});

describe("Conversion Cap Option Increase", () => {
  test("has correct postMoneyShares", () => {
    let org = {
      name: "Pied Piper LLC",
      description: "",
      newShareClass: "Series Preferred 1",
      preMoneyValuation: 30000000,
      newMoneyRaised: 3000000,
      noteConversion: true,
      notesConvertToNewClass: true,
      expandOptionPool: true,
      postMoneyOptionPoolSize: 0.15,
      foundersNumberOfShares: 0,
      commonNumberOfShares: 8500000,
      warrantsNumberOfShares: 65000,
      grantedOptionsNumberOfShares: 3000000,
      oldOptionsNumberOfShares: 1000000,
      notesFields: [
        {
          principalInvested: 1000000,
          interestStartDate: new Date(2015, 1, 1),
          interestRate: 0,
          conversionCap: 5000000,
          conversionDiscount: 0.2,
          conversionDate: new Date(2021, 10, 1),
        },
      ],
    };
    const table = new CapTable(org);
    const actual = postMoneySharesByName(table);
    expect(actual).toMatchObject({
      "Founders' Shares": 0,
      "Rest of Common": 8500000,
      Warrants: 65000,
      "Convertible Notes Into New Share Class": expect.closeTo(2884039, -2),
      "New Money Equity": expect.closeTo(1730404, -2),
      "Granted Options": 3000000,
      "Options Available Before": 1000000,
      "New Options for Pool": expect.closeTo(1855196, -2),
    });
  });
});

describe("Conversion Cap No Option Increase", () => {
  test("has correct postMoneyShares", () => {
    let org = {
      name: "Pied Piper LLC",
      description: "",
      newShareClass: "Series Preferred 1",
      preMoneyValuation: 30000000,
      newMoneyRaised: 3000000,
      noteConversion: true,
      notesConvertToNewClass: true,
      expandOptionPool: false,
      postMoneyOptionPoolSize: 0.15,
      foundersNumberOfShares: 0,
      commonNumberOfShares: 8500000,
      warrantsNumberOfShares: 65000,
      grantedOptionsNumberOfShares: 3000000,
      oldOptionsNumberOfShares: 1000000,
      notesFields: [
        {
          principalInvested: 1000000,
          interestStartDate: new Date(2015, 1, 1),
          interestRate: 0,
          conversionCap: 5000000,
          conversionDiscount: 0.2,
          conversionDate: new Date(2021, 10, 1),
        },
      ],
    };
    const table = new CapTable(org);
    const actual = postMoneySharesByName(table);
    expect(actual).toMatchObject({
      "Founders' Shares": 0,
      "Rest of Common": 8500000,
      Warrants: 65000,
      "Convertible Notes Into New Share Class": 2513000,
      "New Money Equity": 1507765,
      "Granted Options": 3000000,
      "Options Available Before": 1000000,
      "New Options for Pool": 0,
    });
  });
});

describe("Conversion Cap Discount Option Increase", () => {
  test("has correct postMoneyShares", () => {
    let org = {
      name: "Pied Piper LLC",
      description: "",
      newShareClass: "Series Preferred 1",
      preMoneyValuation: 30000000,
      newMoneyRaised: 3000000,
      noteConversion: true,
      notesConvertToNewClass: true,
      expandOptionPool: true,
      postMoneyOptionPoolSize: 0.15,
      foundersNumberOfShares: 0,
      commonNumberOfShares: 8500000,
      warrantsNumberOfShares: 65000,
      grantedOptionsNumberOfShares: 3000000,
      oldOptionsNumberOfShares: 1000000,
      notesFields: [
        {
          principalInvested: 1000000,
          interestStartDate: new Date(2015, 1, 1),
          interestRate: 0,
          conversionCap: 100000000,
          conversionDiscount: 0.5,
          conversionDate: new Date(2021, 10, 1),
        },
      ],
    };
    const table = new CapTable(org);
    const actual = postMoneySharesByName(table);
    expect(actual).toMatchObject({
      "Founders' Shares": 0,
      "Rest of Common": 8500000,
      Warrants: 65000,
      "Convertible Notes Into New Share Class": 1003462,
      "New Money Equity": 1505193,
      "Granted Options": 3000000,
      "Options Available Before": 1000000,
      "New Options for Pool": expect.closeTo(1483586, -2),
    });
  });
});

describe("Conversion Cap Discount No Option Increase", () => {
  test("has correct postMoneyShares", () => {
    let org = {
      name: "Pied Piper LLC",
      description: "",
      newShareClass: "Series Preferred 1",
      preMoneyValuation: 30000000,
      newMoneyRaised: 3000000,
      noteConversion: true,
      notesConvertToNewClass: true,
      expandOptionPool: true,
      postMoneyOptionPoolSize: 0.15,
      foundersNumberOfShares: 0,
      commonNumberOfShares: 8500000,
      warrantsNumberOfShares: 65000,
      grantedOptionsNumberOfShares: 3000000,
      oldOptionsNumberOfShares: 1000000,
      notesFields: [
        {
          principalInvested: 1000000,
          interestStartDate: new Date(2015, 1, 1),
          interestRate: 0,
          conversionCap: 100000000,
          conversionDiscount: 0.5,
          conversionDate: new Date(2021, 10, 1),
        },
      ],
    };
    const table = new CapTable(org);
    const actual = postMoneySharesByName(table);
    expect(actual).toMatchObject({
      "Founders' Shares": 0,
      "Rest of Common": 8500000,
      Warrants: 65000,
      "Convertible Notes Into New Share Class": 1003462,
      "New Money Equity": 1505193,
      "Granted Options": 3000000,
      "Options Available Before": 1000000,
      "New Options for Pool": expect.closeTo(1483586, -2),
    });
  });
});
