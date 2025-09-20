
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface DescriptionWithReadMoreProps {
  text: string;
  maxLength?: number;
}

export function DescriptionWithReadMore({ text, maxLength = 250 }: DescriptionWithReadMoreProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (text.length <= maxLength) {
    return <p className="text-lg text-muted-foreground mt-4 pt-4 border-t whitespace-pre-wrap">{text}</p>;
  }

  const toggleReadMore = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="mt-4 pt-4 border-t">
      <p className="text-lg text-muted-foreground whitespace-pre-wrap">
        {isExpanded ? text : `${text.substring(0, maxLength)}...`}
      </p>
      <Button variant="link" onClick={toggleReadMore} className="p-0 h-auto mt-2 text-primary hover:text-accent">
        {isExpanded ? "Show Less" : "Show More"}
      </Button>
    </div>
  );
}
