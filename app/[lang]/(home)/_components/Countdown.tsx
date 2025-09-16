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
  const [display, setDisplay] = React.useState<string>("");

  React.useEffect(() => {
    if (!targetDateString) {
      setDisplay("");
      return;
    }

    const target = new Date(targetDateString);
    if (!isValid(target)) {
      setDisplay("");
      return;
    }

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

    // Initial paint
    updateDisplay();
    // Update roughly every 50ms to keep centiseconds responsive without being too heavy
    const intervalId = window.setInterval(updateDisplay, 50);

    return () => window.clearInterval(intervalId);
  }, [targetDateString]);

  if (!display) return null;
  return <p className={className}>{display}</p>;
};

export default Countdown;
