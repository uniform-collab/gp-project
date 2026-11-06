import { useSyncExternalStore } from "react";

/** Tailwind's `lg` breakpoint, where the header switches from the mobile drawer to the desktop bar. */
export const DESKTOP_QUERY = "(min-width: 64rem)";

/**
 * Whether a CSS media query matches, kept up to date as the window resizes.
 *
 * The server cannot know the screen size, so it renders as if the query does
 * not match (mobile first). In the browser React then re-renders with the real
 * value right after hydration, without a hydration mismatch.
 */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const list = window.matchMedia(query);
      list.addEventListener("change", onChange);
      return () => list.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}
