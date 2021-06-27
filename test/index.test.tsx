/**
 * @jest-environment jsdom
 */

import { renderHook, act } from "@testing-library/react-hooks";

import useLocalState from "../src";

beforeEach(() => {
  localStorage.clear();
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

  it("accepts callback as an initial value", async () => {
    const key = "todos";
    const values = ["first", "second"];
    const callback = () => values;
    const { result } = renderHook(() => useLocalState(key, callback));

    const [todos] = result.current;
    expect(todos).toEqual(values);
  });

  it("accepts callback as a initial value and can be updated", async () => {
    const key = "todos";
    const values = ["first", "second"];
    const callback = () => values;
    const { result } = renderHook(() => useLocalState(key, callback));

    const [initialValues] = result.current;
    expect(initialValues).toEqual(values);

    const newValue = ["third", "fourth"];
    act(() => {
      const setValue = result.current[1];
      setValue(newValue);
    });

    const [changedValues] = result.current;
    expect(changedValues).toEqual(newValue);
  });

  it("can update value as string", async () => {
    const key = "key";
    const value = "something";
    const { result } = renderHook(() => useLocalState(key, value));

    const [initialValue] = result.current;
    expect(initialValue).toEqual(value);

    const newValue = "something else";
    act(() => {
      const setValue = result.current[1];

      setValue(newValue);
    });

    const [values] = result.current;
    expect(values).toEqual(newValue);
  });

  it("can update value as function", async () => {
    const key = "key";
    const value = "something";
    const { result } = renderHook(() => useLocalState(key, value));

    const [initialValue] = result.current;
    expect(initialValue).toEqual(value);

    const newValue = " else";
    act(() => {
      const setValue = result.current[1];
      setValue((v) => v + newValue);
    });

    const [values] = result.current;
    expect(values).toEqual("something else");
  });

  it("can update value as function multiple times", async () => {
    const key = "key";
    const value = "something";
    const { result } = renderHook(() => useLocalState(key, value));

    const [initialValue] = result.current;
    expect(initialValue).toEqual(value);

    const newValue = " else";
    act(() => {
      const setValue = result.current[1];
      setValue((v) => v + newValue);
    });

    const newValue2 = " again";
    act(() => {
      const setValue = result.current[1];
      setValue((v) => v + newValue2);
    });

    const [values] = result.current;
    expect(values).toEqual("something else again");
  });

  it("can update value as object", async () => {
    const key = "key";
    const value = { something: "something" };
    const { result } = renderHook(() => useLocalState(key, value));

    const [initialValue] = result.current;
    expect(initialValue).toEqual(value);

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

  it("updates state with callback function", async () => {
    const key = "todos";
    const values = ["first", "second"];
    const { result } = renderHook(() => useLocalState(key, values));

    const newValues = ["first", "second"];
    act(() => {
      const setTodos = result.current[1];

      setTodos((current) => [...current, ...newValues]);
    });

    const [todos] = result.current;
    expect(todos).toEqual([...values, ...newValues]);
  });

  it("does not fail even if invalid data is stored into localStorage", async () => {
    const key = "todos";
    const value = "something";

    localStorage.setItem(key, value);

    const newValues = ["first", "second"];
    const { result } = renderHook(() => useLocalState(key, newValues));

    const [todos] = result.current;
    expect(todos).toEqual(newValues);
  });

  it("gets initial value from localStorage if there is a value", async () => {
    const key = "todos";
    const values = ["first", "second"];

    localStorage.setItem(key, JSON.stringify(values));

    const newValues = ["third", "fourth"];
    const { result } = renderHook(() => useLocalState(key, newValues));

    const [todos] = result.current;
    expect(todos).toEqual(values);
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

  it("can reset to default value", async () => {
    const key = "key";
    const value = "something";
    const { result } = renderHook(() => useLocalState(key, value));

    const [initialValue] = result.current;
    expect(initialValue).toEqual(value);

    const newValue = "something else";
    act(() => {
      const setValue = result.current[1];
      setValue(newValue);
    });

    const [changedValue] = result.current;
    expect(changedValue).toEqual(newValue);

    act(() => {
      const resetValue = result.current[2];
      resetValue();
    });

    const [resetValue] = result.current;
    expect(resetValue).toEqual(value);
    expect(localStorage.getItem(key)).toEqual(null);
  });

  it("can reset to default value as callback", async () => {
    const key = "todos";
    const values = ["first", "second"];
    const callback = () => values;
    const { result } = renderHook(() => useLocalState(key, callback));

    const [initialValues] = result.current;
    expect(initialValues).toEqual(values);

    const newValues = ["third", "fourth"];
    act(() => {
      const setValues = result.current[1];
      setValues(newValues);
    });

    const [changedValues] = result.current;
    expect(changedValues).toEqual(newValues);

    act(() => {
      const resetValues = result.current[2];
      resetValues();
    });

    const [resetValues] = result.current;
    expect(resetValues).toEqual(values);
    expect(localStorage.getItem(key)).toEqual(null);
  });

  it("does not change the setter when value is updated", async () => {
    const key = "key";
    const value = "something";
    const { result } = renderHook(() => useLocalState(key, value));

    const setterOne = result.current[1];

    const newValue = "something else";
    act(() => {
      const setValue = result.current[1];
      setValue(newValue);
    });

    const setterTwo = result.current[1];

    expect(setterOne).toEqual(setterTwo);
  });

  it("does not change the setter when value is updated via function", async () => {
    const key = "key";
    const value = "something";
    const { result } = renderHook(() => useLocalState(key, value));

    const setterOne = result.current[1];

    const newValue = " else";
    act(() => {
      const setValue = result.current[1];
      setValue((v) => v + newValue);
    });

    const setterTwo = result.current[1];

    expect(setterOne).toEqual(setterTwo);
  });
});
