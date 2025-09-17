"use client";

import { useState, useEffect } from "react";
import { intervalToDuration, isPast } from "date-fns";

interface CountdownTimerProps {
  endDate: string;
}

export default function CountdownTimer({ endDate }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState("");
  const [hasEnded, setHasEnded] = useState(false);

  useEffect(() => {
    const targetDate = new Date(endDate);

    if (isPast(targetDate)) {
      setHasEnded(true);
      setTimeLeft("Auction Ended");
      return;
    }

    const timer = setInterval(() => {
      const now = new Date();
      if (now > targetDate) {
        clearInterval(timer);
        setHasEnded(true);
        setTimeLeft("Auction Ended");
        return;
      }

      const duration = intervalToDuration({ start: now, end: targetDate });
      
      const parts = [
        duration.days ? `${duration.days}d` : '',
        duration.hours ? `${duration.hours}h` : '',
        duration.minutes ? `${duration.minutes}m` : '',
        duration.seconds ? `${duration.seconds}s` : ''
      ].filter(Boolean);

      setTimeLeft(parts.slice(0, 2).join(' ') || 'Ending soon');

    }, 1000);

    return () => clearInterval(timer);
  }, [endDate]);

  return (
    <span className={hasEnded ? "text-destructive font-medium" : "text-foreground/90 font-medium"}>
      {timeLeft}
    </span>
  );
}
