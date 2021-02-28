import { useState } from "react";

const isBrowser = typeof window !== "undefined";
const supported = isBrowser && window.localStorage;

const useLocalState = <T>(
  key: string,
  defaultValue: T
): [T, (newValue: T) => void] => {
  const [value, setValue] = useState<T>(() => {
    if (!supported) return defaultValue;
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  });

  const setValueMain = (newValue: T) => {
    if (supported) window.localStorage.setItem(key, JSON.stringify(newValue));
    setValue(newValue);
  };

  return [value, setValueMain];
};

export default useLocalState;
