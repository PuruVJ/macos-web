import { addMonths, format } from 'date-fns';
import { useMemo, useState } from 'react';
import type { AppId } from '@/lib/apps';
import { DAYS_OF_THE_WEEK, getDisplayDays } from '@/lib/calendar';

export default function CalendarApp(_props: { appId: AppId }) {
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const today = new Date();
  const displayDays = useMemo(() => getDisplayDays(selectedDate), [selectedDate]);

  return (
    <div className="calendar-app">
      <div className="calendar-header">
        <div>
          <div className="calendar-month">{format(selectedDate, 'MMMM')}</div>
          <div className="calendar-year">{format(selectedDate, 'yyyy')}</div>
        </div>

        <div className="calendar-controls">
          <button onClick={() => setSelectedDate((value) => addMonths(value, -1))} type="button">
            Prev
          </button>
          <button onClick={() => setSelectedDate(new Date())} type="button">
            Today
          </button>
          <button onClick={() => setSelectedDate((value) => addMonths(value, 1))} type="button">
            Next
          </button>
        </div>
      </div>

      <div className="calendar-grid">
        {DAYS_OF_THE_WEEK.map((day) => (
          <div className="calendar-weekday" key={day}>
            {day}
          </div>
        ))}

        {displayDays.daysInPreviousMonth.map((day) => (
          <div className="calendar-day muted" key={`previous-${day}`}>
            <span>{day}</span>
          </div>
        ))}

        {displayDays.daysInThisMonth.map((day) => {
          const isToday =
            selectedDate.getMonth() === today.getMonth() &&
            selectedDate.getFullYear() === today.getFullYear() &&
            day === today.getDate();

          return (
            <div className={`calendar-day ${isToday ? 'today' : ''}`} key={`current-${day}`}>
              <span>{day}</span>
            </div>
          );
        })}

        {displayDays.daysInNextMonth.map((day) => (
          <div className="calendar-day muted" key={`next-${day}`}>
            <span>{day}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
