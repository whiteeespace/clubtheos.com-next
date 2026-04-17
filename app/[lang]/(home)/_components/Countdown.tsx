"use client";

import { differenceInMilliseconds, format, intervalToDuration, isValid } from "date-fns";
import React from "react";

interface CountdownProps {
  targetDateString: string | undefined | null;
  className?: string;
}

function padTwoDigits(value: number): string {
  return String(Math.max(0, value)).padStart(2, "0");
}

const Countdown: React.FC<CountdownProps> = ({ targetDateString, className }) => {
  const targetDate = React.useMemo(() => {
    if (!targetDateString) return undefined;
    const d = new Date(targetDateString);
    return isValid(d) ? d : undefined;
  }, [targetDateString]);

  const [display, setDisplay] = React.useState<string>("");

  React.useEffect(() => {
    if (!targetDate) return;
    const target = targetDate;

    function updateDisplay() {
      const totalMs = Math.max(0, differenceInMilliseconds(target, new Date()));

      const {
        days = 0,
        hours = 0,
        minutes = 0,
        seconds = 0,
      } = intervalToDuration({ start: 0, end: totalMs });
      const centiseconds = Math.floor((totalMs % 1000) / 10);

      const weekdayMonthDay = format(target, "eeee, MMMM d").toLowerCase();

      const countdown = `${padTwoDigits(days)} : ${padTwoDigits(hours)} : ${padTwoDigits(minutes)} : ${padTwoDigits(seconds)} : ${padTwoDigits(centiseconds)}`;

      setDisplay(`${weekdayMonthDay} — ${countdown}`);
    }

    // Defer first update out of the effect body (react-hooks/set-state-in-effect)
    queueMicrotask(updateDisplay);
    const intervalId = window.setInterval(updateDisplay, 50);

    return () => window.clearInterval(intervalId);
  }, [targetDate]);

  if (!targetDate) return null;
  if (!display) return null;
  return <p className={className}>{display}</p>;
};

export default Countdown;
