export const IS_BROWSER = typeof window !== "undefined";

export const SUPPORTED = IS_BROWSER && window.localStorage;
