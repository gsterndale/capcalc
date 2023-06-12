function roundTo(num: number, decimals: number): number {
  if (decimals === 0) return Math.round(num);
  const pow = Math.pow(10, decimals);
  return Math.round((num + Number.EPSILON) * pow) / pow;
}

function asUSD(num: number): number {
  return roundTo(num, 2);
}

function asShares(num: number) {
  // TODO determine if we should floor here
  return roundTo(num, 0);
}

function asPercent(num: number) {
  return roundTo(num * 100, 1);
}

export { roundTo, asShares, asUSD, asPercent };
