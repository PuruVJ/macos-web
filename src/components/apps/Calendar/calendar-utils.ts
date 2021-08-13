import { getDay, getMonth, getYear, startOfMonth } from 'date-fns';
import { DAYS, DAYS_LEAP, NUMBER_OF_CELLS_IN_CALENDAR } from './calendar-constants';

/**
 * Check if the year is a leap year
 * @param year
 */
export function isLeapYear(year: number) {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

/**
 * Get an array of whole number integers in the range (lower, upper]
 * @param lower lower bound, exclusive
 * @param upper upper bound, inclusive
 */
export function getRangeArray(lower: number, upper: number) {
  const arr: number[] = [];
  for (let i = lower + 1; i <= upper; i++) {
    arr.push(i);
  }
  return arr;
}

/**
 * Get the display days in 3 parts:
 * Ones belong to previous month,
 * Ones belong to this month, and
 * Ones belong to next month.
 * @param selectedDate the selected date which indicates the current month
 */
export function getDisplayDays(selectedDate: Date) {
  const thisMonth = getMonth(selectedDate);
  const prevMonth = thisMonth - 1 < 0 ? 11 : thisMonth - 1;

  const days = isLeapYear(getYear(selectedDate)) ? DAYS_LEAP : DAYS;
  const weekday = getDay(startOfMonth(selectedDate));

  // If it's Sunday, weekday is 0
  const daysToShowInPrevMonth = weekday === 0 ? 6 : weekday - 1;
  const daysToShowInNextMonth =
    NUMBER_OF_CELLS_IN_CALENDAR - days[thisMonth] - daysToShowInPrevMonth;

  const daysInPrevMonth = getRangeArray(days[prevMonth] - daysToShowInPrevMonth, days[prevMonth]);
  const daysInThisMonth = getRangeArray(0, days[thisMonth]);
  const daysInNextMonth = getRangeArray(0, daysToShowInNextMonth);

  return {
    daysInPrevMonth,
    daysInThisMonth,
    daysInNextMonth,
  };
}
