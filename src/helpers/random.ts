export function rand_int(lower: number, upper: number) {
  if (lower > upper) [lower, upper] = [upper, lower];

  return lower + Math.floor((upper - lower) * Math.random());
}
