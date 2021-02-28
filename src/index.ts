import { useState } from "react";

import { SUPPORTED } from "./utils";

const useLocalState = <T>(
  key: string,
  defaultValue: T
): [T, (v: T | ((v: T) => T)) => void] => {
  const [value, setValue] = useState<T>(() => {
    const toStore =
      typeof defaultValue === "function" ? defaultValue() : defaultValue;
    if (!SUPPORTED) return toStore;
    const item = window.localStorage.getItem(key);
    try {
      return item ? JSON.parse(item) : toStore;
    } catch (error) {
      return toStore;
    }
  });

  const setLocalStateValue = (newValue: T | ((v: T) => T)) => {
    const isCallable = (value: unknown): value is (v: T) => T =>
      typeof value === "function";
    const toStore = isCallable(newValue) ? newValue(value) : newValue;
    if (SUPPORTED) window.localStorage.setItem(key, JSON.stringify(toStore));
    setValue(toStore);
  };

  return [value, setLocalStateValue];
};

export default useLocalState;
