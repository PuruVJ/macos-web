import clsx from 'clsx';
import { useAtom } from 'jotai';
import { calendarAppStore } from '__/stores/calendar.app.store';
import { getDisplayDays } from '../calendar-utils';
import { DAYS_OF_THE_WEEK } from '../constants';
import css from './MonthView.module.scss';

export const MonthView = () => {
  const [selectedDate] = useAtom(calendarAppStore);
  const today = new Date();

  const { daysInPrevMonth, daysInThisMonth, daysInNextMonth } = getDisplayDays(selectedDate);

  /**
   * Render each day block
   * @param daysInMonth the number array of days in the month to be displayed
   * @param isThisMonth flag to check if this day block belongs to current month
   */
  const renderDay = (daysInMonth: number[], isThisMonth: boolean) => {
    return daysInMonth.map((d, i) => {
      const isToday =
        selectedDate.getFullYear() === today.getFullYear() &&
        isThisMonth &&
        selectedDate.getMonth() === today.getMonth() &&
        d === today.getDate();

      return (
        <div
          className={clsx({
            [css.day]: true,
            [css.today]: isToday,
            // [css.selected]: isSelected,
          })}
          key={`day-${i}-${d}-${selectedDate.getMonth()}`}
        >
          <div className={clsx({ [css.dateNumber]: true, [css.thisMonth]: isThisMonth })}>{d}</div>
        </div>
      );
    });
  };

  return (
    <div className={css.monthView}>
      {DAYS_OF_THE_WEEK.map((day, i) => (
        <div className={[5, 6].includes(i) ? css.weekend : css.weekday}>{day}</div>
      ))}
      {renderDay(daysInPrevMonth, false)}
      {renderDay(daysInThisMonth, true)}
      {renderDay(daysInNextMonth, false)}
    </div>
  );
};

export default MonthView;
