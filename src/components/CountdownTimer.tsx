
"use client";

import { useState, useEffect } from "react";
import { intervalToDuration, isPast } from "date-fns";

interface CountdownTimerProps {
  date: string;
  prefix?: string;
  endedText?: string;
  onEnded?: () => void;
}

export default function CountdownTimer({ date, prefix = "Ends In:", endedText = "Auction Ended", onEnded }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState("");
  const [hasEnded, setHasEnded] = useState(false);

  useEffect(() => {
    const targetDate = new Date(date);

    const handleAuctionEnd = () => {
      setHasEnded(true);
      setTimeLeft(endedText);
      if (onEnded) {
        onEnded();
      }
    };

    if (isPast(targetDate)) {
      handleAuctionEnd();
      return;
    }

    const timer = setInterval(() => {
      const now = new Date();
      if (now > targetDate) {
        clearInterval(timer);
        handleAuctionEnd();
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
  }, [date, endedText, onEnded]);
  
  if (hasEnded) {
      return (
        <span className="text-destructive font-medium">
          {timeLeft}
        </span>
      );
  }

  return (
    <>
      {prefix && <span className="font-medium">{prefix}</span>}
      <span className="text-foreground/90 font-medium ml-1">
        {timeLeft}
      </span>
    </>
  );
}
