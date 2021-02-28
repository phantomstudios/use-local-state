import { useState } from "react";

import { SUPPORTED } from "./utils";

const useLocalState = <T>(
  key: string,
  defaultValue: T
): [T, (newValue: T) => void] => {
  const [value, setValue] = useState<T>(() => {
    if (!SUPPORTED) return defaultValue;
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  });

  const setLocalStateValue = (newValue: T) => {
    if (SUPPORTED) window.localStorage.setItem(key, JSON.stringify(newValue));
    setValue(newValue);
  };

  return [value, setLocalStateValue];
};

export default useLocalState;
