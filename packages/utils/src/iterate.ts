import roundTo from "./roundTo";

function iterate(
  cb: Function,
  lastGuess = 0.0,
  max = 1000,
  decimals = 3
): number {
  let newGuess;
  for (let i = 0; i < max; i++) {
    newGuess = roundTo(cb(lastGuess), decimals);
    if (newGuess === lastGuess) return newGuess;
    lastGuess = newGuess;
  }
  throw new Error(`Unable to find solution in ${max} iterations.`);
}
export default iterate;
