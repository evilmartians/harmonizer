// This function is approximation, since the APCA and WCAG algorithms are not directly comparable.
export function wcagToApca(wcagRatio: number) {
  if (wcagRatio <= 1) {
    return 0;
  }

  const apcaLc = 110 * (wcagRatio / 21) ** (1 / 2.4);
  return Number.parseFloat(apcaLc.toFixed(0));
}
