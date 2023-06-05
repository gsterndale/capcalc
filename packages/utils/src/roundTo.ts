function roundTo(num: number, decimals: number): number {
  if (decimals === 0) return Math.round(num);
  const pow = Math.pow(10, decimals);
  return Math.round((num + Number.EPSILON) * pow) / pow;
}

export default roundTo;
