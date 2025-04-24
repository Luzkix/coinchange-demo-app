/**
 * Converts number in string format into number format rounded to specified precision
 * @param stringNumber - string number, e.g. "1.97654041425943"
 * @param roundLevel - target level of rounding precision, e.g. 2 matches 1,02, 3 matches 1,023...
 * @returns number rounded to required precision
 */
export const convertStringNumberToRoundedNumber = (
  stringNumber: string,
  roundLevel: number,
): number => {
  const num = parseFloat(stringNumber);
  return parseFloat(num.toFixed(roundLevel));
};
