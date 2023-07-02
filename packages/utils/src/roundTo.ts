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

function prettyUSD(num: number, decimals: number = 0) {
  const USDollar = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: decimals,
  });
  return USDollar.format(roundTo(num, decimals));
}

function prettyPercent(num: number, decimals: number = 1) {
  return `${roundTo(num * 100, decimals).toLocaleString("en-US")}%`;
}

function prettyShares(num: number) {
  return asShares(num).toLocaleString("en-US");
}

export {
  roundTo,
  asShares,
  asUSD,
  asPercent,
  prettyUSD,
  prettyPercent,
  prettyShares,
};
