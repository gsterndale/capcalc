import roundTo from "./roundTo";

function simpleInterest(
  principal: number,
  rate: number,
  period: number
): number {
  return roundTo(rate * principal * period, 2);
}

export { simpleInterest };
