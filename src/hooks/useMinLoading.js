import { useState, useEffect, useRef } from "react";

export function useMinLoading(isLoading, minDuration = 1400) {
  const [showLoader, setShowLoader] = useState(true);
  const startTime = useRef(Date.now());

  useEffect(() => {
    if (!isLoading) {
      const elapsed = Date.now() - startTime.current;
      const remaining = minDuration - elapsed;

      if (remaining > 0) {
        const timer = setTimeout(() => setShowLoader(false), remaining);
        return () => clearTimeout(timer);
      } else {
        setShowLoader(false);
      }
    }
  }, [isLoading, minDuration]);

  return showLoader;
}