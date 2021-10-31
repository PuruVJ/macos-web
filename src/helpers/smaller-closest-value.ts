/**
 * Find the closest smaller number in an array
 * @param arr Ascendingly sorted array
 * @param value Value to check against
 */
export function smallerClosestValue(arr: number[], value: number) {
  let prevVal = arr[0];

  for (const val of arr) {
    if (val > value) return prevVal;
    if (val == value) return val;
    prevVal = val;
  }

  return arr[arr.length - 1];
}
