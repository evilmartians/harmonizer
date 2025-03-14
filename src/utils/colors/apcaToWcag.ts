// This function is approximation, since the APCA and WCAG algorithms are not directly comparable.
export function apcaToWcag(apcaLc: number) {
  if (apcaLc === 0) {
    return 1;
  }

  const wcagRatio = (Math.abs(apcaLc) / 110) ** 2.4 * 21;
  return Number.parseFloat(wcagRatio.toFixed(1));
}
