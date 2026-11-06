// Canvas preview: checks the secret, turns on Next.js preview mode and
// redirects to the page, or to /playground for a component or pattern.
// https://docs.uniform.app/docs/guides/composition/visual-editing/activate-visual-editing

import { randomUUID } from "node:crypto";
import type { NextApiRequest, NextApiResponse } from "next";
import { createPreviewHandler, createPreviewHandlerGet, type ResolveFullPath } from "@uniformdev/canvas-next";

// An empty secret turns off the SDK's secret check. With a random fallback, a
// missing UNIFORM_PREVIEW_SECRET rejects every preview request instead.
const fallbackSecret = randomUUID();

const options = {
  secret: () => process.env.UNIFORM_PREVIEW_SECRET || fallbackSecret,
  playgroundPath: "/playground",
  // Prefer the project map path. A composition with no project map node falls
  // back to its id, which is unique, and only then to its slug, which is not
  // guaranteed to be and could collide with a real page path.
  resolveFullPath: (({ path, id, slug }) => {
    const target = path || id || slug;
    return target ? toLocalPath(target) : "/";
  }) satisfies ResolveFullPath,
};

const handlePreview = createPreviewHandler(options);
const handlePreviewGet = createPreviewHandlerGet(options);

export default async function preview(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === "GET") {
      // GET is handled here, with the CORS headers createPreviewHandler sets, so
      // its errors reach the catch below.
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Allow-Headers", "*");
      res.setHeader("Access-Control-Allow-Methods", "GET, HEAD");
      await handlePreviewGet(req, res);
    } else {
      await handlePreview(req, res);
    }
  } catch (error) {
    console.error("[api/preview]", error);
    if (!res.headersSent) res.status(500).json({ message: "Preview failed" });
  }
}

/**
 * Normalizes the requested page to a clean path on this site, for example
 * `about`, `/about` and `//about` all become `/about`.
 */
function toLocalPath(target: string) {
  const { pathname } = new URL(`/${target.replace(/^[/\\]+/, "")}`, "http://localhost");
  return pathname.replace(/^\/+/, "/");
}
