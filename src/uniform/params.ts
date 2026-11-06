/** Whether a select parameter's value is one of the keys of `options`. */
export function isOption<T extends object>(
  options: T,
  value: string | undefined,
): value is Extract<keyof T, string> {
  return value !== undefined && Object.hasOwn(options, value);
}

/**
 * Read a checkbox parameter. Values can arrive as the strings "true" / "false",
 * and `Boolean("false")` is `true`.
 */
export function toBoolean(value: unknown, fallback = false): boolean {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (normalized === "true") return true;
    if (normalized === "false" || normalized === "") return false;
  }
  return fallback;
}
