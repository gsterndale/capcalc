export default (numberInLocale: string, locale?: string): number => {
  // Get the thousands and decimal separator characters used in the locale.
  let [, thousandsSeparator, , , , decimalSeparator] = (1111.1).toLocaleString(
    locale
  );
  // Remove thousand separators, and put a point where the decimal separator occurs
  numberInLocale = Array.from(numberInLocale, (c) =>
    c === thousandsSeparator ? "" : c === decimalSeparator ? "." : c
  ).join("");
  // Now it can be parsed
  return parseFloat(numberInLocale);
};
