import { useEffect, useState, type MouseEvent, type PointerEvent } from "react";

// Helpers for the playground decorators.

/**
 * A value remembered per key for the browser session. Canvas reloads the
 * playground often, so a chosen width should survive that. `isValid` filters
 * out stale or foreign values.
 */
export function useSessionChoice<T extends string>(
  key: string,
  isValid: (value: string) => value is T,
  fallback: T,
) {
  const [value, setValue] = useState<T>(fallback);

  // sessionStorage only exists in the browser, so it is read after mount.
  useEffect(() => {
    let stored: string | null = null;
    try {
      stored = window.sessionStorage.getItem(key);
    } catch {
      // Storage can be blocked; the fallback stays.
    }
    setValue(stored !== null && isValid(stored) ? stored : fallback);
  }, [key, isValid, fallback]);

  function choose(next: T) {
    setValue(next);
    try {
      window.sessionStorage.setItem(key, next);
    } catch {
      // Not persisted, still applied.
    }
  }

  return [value, choose] as const;
}

/**
 * Acts on pointerdown and stops it there, so the press does not also select
 * the previewed component in Canvas edit mode. `onClick` covers the keyboard
 * (a click with `detail` 0); pointer clicks were already handled.
 */
export function pressHandlers(onPress: () => void) {
  return {
    onPointerDown: (event: PointerEvent) => {
      if (event.button !== 0) return;
      event.preventDefault();
      event.stopPropagation();
      onPress();
    },
    onClick: (event: MouseEvent) => {
      if (event.detail === 0) onPress();
    },
  };
}
