import { getDay, getMonth, getYear, startOfMonth } from 'date-fns';

export const DAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31] as const;
export const DAYS_LEAP = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31] as const;
export const DAYS_OF_THE_WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;
export const NUMBER_OF_CELLS_IN_CALENDAR = 42;

export function isLeapYear(year: number) {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

export function getRangeArray(lowerExclusive: number, upperInclusive: number) {
  const values: number[] = [];

  for (let index = lowerExclusive + 1; index <= upperInclusive; index += 1) {
    values.push(index);
  }

  return values;
}

export function getDisplayDays(selectedDate: Date) {
  const month = getMonth(selectedDate);
  const previousMonth = month - 1 < 0 ? 11 : month - 1;
  const days = isLeapYear(getYear(selectedDate)) ? DAYS_LEAP : DAYS;
  const weekday = getDay(startOfMonth(selectedDate));
  const daysToShowInPreviousMonth = weekday === 0 ? 6 : weekday - 1;
  const daysToShowInNextMonth =
    NUMBER_OF_CELLS_IN_CALENDAR - days[month] - daysToShowInPreviousMonth;

  return {
    daysInPreviousMonth: getRangeArray(
      days[previousMonth] - daysToShowInPreviousMonth,
      days[previousMonth],
    ),
    daysInThisMonth: getRangeArray(0, days[month]),
    daysInNextMonth: getRangeArray(0, daysToShowInNextMonth),
  };
}
