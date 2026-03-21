import { useEffect, useState } from 'react';

const formatter = new Intl.DateTimeFormat(undefined, {
  hour: 'numeric',
  minute: '2-digit',
  weekday: 'short',
});

export function Clock() {
  const [value, setValue] = useState(() => formatter.format(new Date()));

  useEffect(() => {
    const timer = window.setInterval(() => {
      setValue(formatter.format(new Date()));
    }, 30_000);

    return () => {
      window.clearInterval(timer);
    };
  }, []);

  return <span>{value}</span>;
}
