import { describe, expect, test } from "@jest/globals";
import { Note, AbstractNoteFactory } from "../src/index";

const principal = 500000;
const discount = 0.2;
const SPFF = 2.5; // Share Price For Financing
const PMS = 10000000; // Pre-Money Shares

describe("a uncapped note without interest", () => {
  const note = AbstractNoteFactory.create({
    conversionDiscount: discount,
    principalInvested: principal,
  });

  test("conversionAmount() is just the principal", () => {
    expect(note.conversionAmount()).toBe(principal);
  });

  test("dates have defaults", () => {
    expect(note.conversionDate).toBeInstanceOf(Date);
    expect(note.interestStartDate).toBeInstanceOf(Date);
  });

  test("default interestRate of 0", () => {
    expect(note.interestRate).toBe(0);
  });

  test("value", () => {
    expect(note.value(SPFF, PMS)).toBeCloseTo(principal / (1 - discount));
  });

  test("shares", () => {
    const price = SPFF * (1 - discount);
    expect(note.shares(SPFF, PMS)).toBeCloseTo(principal / price);
  });

  test("price to be a discount SPFF", () => {
    expect(note.price(SPFF)).toBeCloseTo(SPFF * (1 - discount));
    expect(note.price(SPFF * 1000)).toBeCloseTo(1000 * SPFF * (1 - discount));
  });
});

describe("a uncapped note with interest", () => {
  const rate = 0.06;
  const fiveYearsAgo = new Date();
  fiveYearsAgo.setFullYear(fiveYearsAgo.getFullYear() - 5);

  const note = AbstractNoteFactory.create({
    conversionDiscount: discount,
    principalInvested: principal,
    interestRate: rate,
    interestStartDate: fiveYearsAgo,
  });

  test("conversionAmount() is the principal + simple interest", () => {
    const interest = principal * rate * 5;
    expect(note.conversionAmount()).toBe(principal + interest);
  });

  test("value based on conversionAmount", () => {
    const ca = note.conversionAmount();
    expect(note.value(SPFF, PMS)).toBeCloseTo(ca / (1 - discount));
  });

  test("shares based on conversionAmount", () => {
    const ca = note.conversionAmount();
    const price = SPFF * (1 - discount);
    expect(note.shares(SPFF, PMS)).toBeCloseTo(ca / price);
  });
});

describe("a note with favorable cap", () => {
  const cap = 5000000;
  const note = AbstractNoteFactory.create({
    conversionDiscount: discount,
    principalInvested: principal,
    conversionCap: cap,
  });

  test("price is based on cap", () => {
    expect(note.price(PMS)).toBeCloseTo(cap / PMS);
  });

  test("value is based on cap", () => {
    const price = cap / PMS;
    const value = principal * (SPFF / price);
    expect(note.value(SPFF, PMS)).toBeCloseTo(value);
  });

  test("shares is based on cap", () => {
    const price = cap / PMS;
    expect(note.shares(SPFF, PMS)).toBeCloseTo(principal / price);
  });
});

describe("a note with favorable discount", () => {
  const cap = 5000000 * 100;
  const note = AbstractNoteFactory.create({
    conversionDiscount: discount,
    principalInvested: principal,
    conversionCap: cap,
  });

  test("price is based on discount", () => {
    expect(note.price(SPFF)).toBeCloseTo(SPFF * (1 - discount));
  });

  test("value is based on discount", () => {
    expect(note.value(SPFF, PMS)).toBeCloseTo(principal / (1 - discount));
  });

  test("shares is based on discount", () => {
    const price = SPFF * (1 - discount);
    expect(note.shares(SPFF, PMS)).toBeCloseTo(principal / price);
  });
});
