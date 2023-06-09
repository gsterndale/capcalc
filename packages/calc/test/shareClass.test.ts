import { describe, expect, test } from "@jest/globals";
import { ShareClass } from "../src/index";

describe("ShareClass", () => {
  const shareClassFields = {
    name: "Class A",
    preMoneyShares: 100,
    postMoneyShares: 200,
  };

  const shareClass = new ShareClass(shareClassFields);

  describe("preMoneyPercentOwnership", () => {
    it("should calculate the correct percentage of pre-money ownership", () => {
      const totalPreMoneyShares = 500;
      const expectedResult = 0.2;
      const result = shareClass.preMoneyPercentOwnership(totalPreMoneyShares);
      expect(result).toBe(expectedResult);
    });
  });

  describe("preMoneyOwnershipValue", () => {
    it("should calculate the correct value of pre-money ownership", () => {
      const preMoneySharePrice = 10;
      const expectedResult = 1000;
      const result = shareClass.preMoneyOwnershipValue(preMoneySharePrice);
      expect(result).toBe(expectedResult);
    });
  });

  describe("postMoneyPercentOwnership", () => {
    it("should calculate the correct percentage of post-money ownership", () => {
      const totalPostMoneyShares = 1000;
      const expectedResult = 0.2;
      const result = shareClass.postMoneyPercentOwnership(totalPostMoneyShares);
      expect(result).toBe(expectedResult);
    });
  });

  describe("postMoneyOwnershipValue", () => {
    it("should calculate the correct value of post-money ownership", () => {
      const sharePriceForFinancing = 15;
      const expectedResult = 3000;
      const result = shareClass.postMoneyOwnershipValue(sharePriceForFinancing);
      expect(result).toBe(expectedResult);
    });
  });

  describe("postMoneyPercentChange", () => {
    it("should calculate the correct percentage change in ownership", () => {
      const totalPostMoneyShares = 700;
      const totalPreMoneyShares = 500;
      const expectedResult = 2 / 7 - 1 / 5;
      const result = shareClass.postMoneyPercentChange(
        totalPostMoneyShares,
        totalPreMoneyShares
      );
      expect(result).toBe(expectedResult);
    });
  });

  describe("postMoneyValueChange", () => {
    it("should calculate the correct value change in ownership", () => {
      const sharePriceForFinancing = 15;
      const preMoneySharePrice = 10;
      const expectedResult = 2000;
      const result = shareClass.postMoneyValueChange(
        sharePriceForFinancing,
        preMoneySharePrice
      );
      expect(result).toBe(expectedResult);
    });
  });

  describe("postMoneyDilution", () => {
    it("should calculate the correct dilution percentage", () => {
      const totalPostMoneyShares = 1000;
      const totalPreMoneyShares = 500;
      const expectedResult = 0;
      const result = shareClass.postMoneyDilution(
        totalPostMoneyShares,
        totalPreMoneyShares
      );
      expect(result).toBe(expectedResult);
    });
  });
});
