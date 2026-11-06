// Draft or published content, and the site locale.

import { CANVAS_DRAFT_STATE, CANVAS_PUBLISHED_STATE } from "@uniformdev/canvas";

export const DEFAULT_LOCALE = "en-US";

/**
 * Draft content during `npm run dev` and in Next.js preview mode (entered from
 * Canvas through /api/preview). Published content for everyone else.
 */
export function contentState(preview?: boolean) {
  return preview || process.env.NODE_ENV !== "production" ? CANVAS_DRAFT_STATE : CANVAS_PUBLISHED_STATE;
}
