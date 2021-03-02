import { useState } from "react";

import { SUPPORTED } from "./utils";

type Dispatch<A> = (value: A) => void;
type SetStateAction<S> = S | ((prevState: S) => S);

const useLocalState = <S>(
  key: string,
  defaultValue: S | (() => S)
): [S, Dispatch<SetStateAction<S>>, () => void] => {
  const [value, setValue] = useState<S>(() => {
    const isCallable = (value: unknown): value is () => S =>
      typeof value === "function";

    const toStore = isCallable(defaultValue) ? defaultValue() : defaultValue;

    if (!SUPPORTED) return toStore;
    const item = window.localStorage.getItem(key);
    try {
      return item ? JSON.parse(item) : toStore;
    } catch (error) {
      return toStore;
    }
  });

  const setLocalStateValue = (newValue: SetStateAction<S>) => {
    const isCallable = (value: unknown): value is (prevState: S) => S =>
      typeof value === "function";
    const toStore = isCallable(newValue) ? newValue(value) : newValue;
    if (SUPPORTED) window.localStorage.setItem(key, JSON.stringify(toStore));
    setValue(toStore);
  };

  const reset = () => {
    const isCallable = (value: unknown): value is (prevState: S) => S =>
      typeof value === "function";

    const toStore = isCallable(defaultValue) ? defaultValue() : defaultValue;
    setValue(toStore);
    if (SUPPORTED) window.localStorage.removeItem(key);
  };

  return [value, setLocalStateValue, reset];
};

export default useLocalState;
