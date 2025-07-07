/**
 * Find the closest smaller number in an array
 * @param arr Ascendingly sorted array
 * @param value Value to check against
 */
export function smaller_closest_value(arr: number[], value: number) {
	let prev_val = arr[0];

	for (const val of arr) {
		if (val > value) return prev_val;
		if (val == value) return val;
		prev_val = val;
	}

	return arr[arr.length - 1];
}
