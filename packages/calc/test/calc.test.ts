import { describe, expect, test } from "@jest/globals";
import { sum } from "../src/index";

describe("sum of two numbers", () => {
  let a = 123;
  let b = 456;

  test("adds them together", () => {
    expect(sum(a, b)).toBe(579);
  });
});
