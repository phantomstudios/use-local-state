import { renderHook, act } from "@testing-library/react-hooks";

import useLocalState from "../src";

describe("performs requests", () => {
  it("uses initial value as string", async () => {
    const key = "key 0";
    const value = "something 0";
    const { result } = renderHook(() => useLocalState(key, value));
    expect(result.current[0]).toEqual(value);
  });

  it("uses initial value as boolean", async () => {
    const key = "key1";
    const value = false;
    const { result } = renderHook(() => useLocalState(key, value));
    expect(result.current[0]).toEqual(value);
  });

  it("uses initial value as object", async () => {
    const key = "key2";
    const value = {
      something: "else",
    };
    const { result } = renderHook(() => useLocalState(key, value));
    expect(result.current[0]).toEqual(value);
  });

  it("can update value as string", async () => {
    const key = "key3";
    const value = "something 3";
    const value2 = "something else 3";

    const { result } = renderHook(() => useLocalState(key, value));
    expect(result.current[0]).toEqual(value);

    act(() => {
      result.current[1](value2);
    });

    expect(result.current[0]).toEqual(value2);
  });

  it("can update value as object", async () => {
    const key = "key4";
    const value = { something: "something 4" };
    const value2 = { something: "else 4" };

    const { result } = renderHook(() => useLocalState(key, value));
    expect(result.current[0]).toEqual(value);

    act(() => {
      result.current[1](value2);
    });

    expect(result.current[0]).toEqual(value2);
  });
});
