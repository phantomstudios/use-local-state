import { renderHook, act } from "@testing-library/react-hooks";

import useLocalState from "../src";
import { SUPPORTED } from "../src/utils";

beforeEach(() => {
  if (SUPPORTED) localStorage.clear();
});

describe("useLocalState()", () => {
  it("stores initial value as string", async () => {
    const key = "key";
    const value = "something";
    const { result } = renderHook(() => useLocalState(key, value));

    const [values] = result.current;
    expect(values).toEqual(value);
  });

  it(`initial value isn't stored into localStorage`, async () => {
    if (!SUPPORTED) return;

    const key = "key";
    const value = "something";
    renderHook(() => useLocalState(key, value));

    expect(localStorage.getItem(key)).toEqual(null);
  });

  it("stores initial value as boolean", async () => {
    const key = "key";
    const value = false;
    const { result } = renderHook(() => useLocalState(key, value));

    const [values] = result.current;
    expect(values).toEqual(value);
  });

  it("stores initial value as object", async () => {
    const key = "key";
    const value = {
      something: "else",
    };
    const { result } = renderHook(() => useLocalState(key, value));

    const [values] = result.current;
    expect(values).toEqual(value);
  });

  it("stores initial value as array", async () => {
    const key = "todos";
    const values = ["first", "second"];
    const { result } = renderHook(() => useLocalState(key, values));

    const [todos] = result.current;
    expect(todos).toEqual(values);
  });

  it("accepts callback as a value", async () => {
    const key = "todos";
    const values = ["first", "second"];
    const callback = () => values;
    const { result } = renderHook(() => useLocalState(key, callback));

    const [todos] = result.current;
    expect(todos).toEqual(values);
  });

  it("can update value as string", async () => {
    const key = "key";
    const value = "something";

    const { result } = renderHook(() => useLocalState(key, value));
    expect(result.current[0]).toEqual(value);

    const newValue = "something else";
    act(() => {
      const setValue = result.current[1];

      setValue(newValue);
    });

    const [values] = result.current;
    expect(values).toEqual(newValue);
  });

  it("can update value as object", async () => {
    const key = "key";
    const value = { something: "something" };

    const { result } = renderHook(() => useLocalState(key, value));
    expect(result.current[0]).toEqual(value);

    const newValue = { something: "else" };
    act(() => {
      const setValue = result.current[1];

      setValue(newValue);
    });

    const [values] = result.current;
    expect(values).toEqual(newValue);
  });

  it("can update value as array", async () => {
    const key = "todos";
    const values = ["first", "second"];
    const { result } = renderHook(() => useLocalState(key, values));

    const newValues = ["third", "fourth"];
    act(() => {
      const setValues = result.current[1];

      setValues(newValues);
    });

    const [todos] = result.current;
    expect(todos).toEqual(newValues);
  });

  // todo(): this logic could be super handy...
  // it("updates state with callback function", () => {
  //   const key = "todos";
  //   const values = ["first", "second"];
  //   const { result } = renderHook(() => useLocalState(key, values));

  //   const newValues = ["first", "second"];
  //   act(() => {
  //     const setTodos = result.current[1];

  //     setTodos((current) => [...current, ...newValues]);
  //   });

  //   const [todos] = result.current;
  //   expect(todos).toEqual([...values, ...newValues]);
  // });

  it("does not fail even if invalid data is stored into localStorage", async () => {
    if (!SUPPORTED) return;

    const key = "todos";
    const value = "something";

    localStorage.setItem(key, value);

    const newValues = ["first", "second"];
    const { result } = renderHook(() => useLocalState(key, newValues));

    const [todos] = result.current;
    expect(todos).toEqual(newValues);
  });

  it("gets initial value from localStorage if there is a value", async () => {
    if (!SUPPORTED) return;

    const key = "todos";
    const values = ["first", "second"];

    localStorage.setItem(key, JSON.stringify(values));

    const newValues = ["third", "fourth"];
    const { result } = renderHook(() => useLocalState(key, newValues));

    const [todos] = result.current;
    expect(todos).toEqual(values);
  });

  it("throws an error on two states with the same key", async () => {
    const consoleError = console.error;
    console.error = () => null;

    const key = "todos";
    const valuesA = ["first", "second"];
    const valuesB = ["third", "fourth"];

    expect(() => {
      renderHook(() => {
        useLocalState(key, valuesA);
        useLocalState(key, valuesB);
      });
    }).toThrow();

    console.error = consoleError;
  });

  it("does not throw an error with two states with different keys", async () => {
    const keyA = "todos";
    const keyB = "todos";
    const valuesA = ["first", "second"];
    const valuesB = ["third", "fourth"];

    expect(() => {
      renderHook(() => {
        useLocalState(keyA, valuesA);
        useLocalState(keyB, valuesB);
      });
    }).not.toThrow();
  });

  it("can handle `undefined` values", async () => {
    const key = "todos";
    const values = ["first", "second"];

    const { result } = renderHook(() =>
      useLocalState<string[] | undefined>(key, values)
    );

    act(() => {
      const [, setValues] = result.current;
      setValues(undefined);
    });

    const [value] = result.current;
    expect(value).toBe(undefined);
  });

  it("can handle `null` values", async () => {
    const key = "todos";
    const values = ["first", "second"];

    const { result } = renderHook(() =>
      useLocalState<string[] | null>(key, values)
    );

    act(() => {
      const [, setValues] = result.current;
      setValues(null);
    });

    const [value] = result.current;
    expect(value).toBe(null);
  });
});
