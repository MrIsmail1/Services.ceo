import { useState, useEffect } from "react";

export function TypewriterMessage({ content, speed = 18 }: { content: string, speed?: number }) {
  const [displayed, setDisplayed] = useState("");
  useEffect(() => {
    setDisplayed("");
    if (!content) return;
    let i = 0;
    const interval = setInterval(() => {
      setDisplayed((prev) => prev + content[i]);
      i++;
      if (i >= content.length) clearInterval(interval);
    }, speed);
    return () => clearInterval(interval);
  }, [content, speed]);
  return <span>{displayed}</span>;
} 