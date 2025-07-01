export function symmFillArr(length: number, value: number, index: number) {
  let start = index;
  let end = index;

  const arr = Array(length).fill(0);

  while (value >= 0) {
    if (start >= 0) arr[start] = value;
    if (end < length) arr[end] = value;

    value--;
    start--, end++;
  }

  return arr;
}
