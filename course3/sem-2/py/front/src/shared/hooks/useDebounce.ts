import { useState, useEffect } from "react";

// @ts-expect-error allowed
export const useDebounce = (value, delay) => {
  // value and delay in ms (1000ms = 1s)
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(t);
    };
  }, [value, delay]);

  return debouncedValue;
}
