// Uniform Context: scores visitors and picks personalization and A/B test
// variations. Rules come from ./contextManifest.json, downloaded by
// `npm run uniform:manifest` (run by `dev` and `build`).
// https://docs.uniform.app/docs/guides/personalization

import {
  Context,
  enableContextDevTools,
  enableDebugConsoleLogDrain,
  type ContextPlugin,
  type ManifestV2,
} from "@uniformdev/context";
import { NextCookieTransitionDataStore } from "@uniformdev/context-next";
import type { NextPageContext } from "next";
import manifest from "./contextManifest.json";

/**
 * Create a Context. Pass `serverContext` to read the visitor's cookies on the
 * server (see _document.tsx).
 */
export function createUniformContext(serverContext?: NextPageContext): Context {
  const plugins: ContextPlugin[] = [
    // Shares visitor data with Uniform's Context developer tools.
    enableContextDevTools(),
  ];
  if (process.env.NODE_ENV !== "production") plugins.push(enableDebugConsoleLogDrain("debug"));

  return new Context({
    manifest: manifest as ManifestV2,
    // Tracks without a consent prompt; connect this to a consent banner if needed.
    defaultConsent: true,
    // Cookies, so the server can read visitor data (see _document.tsx).
    // `experimental_quirksEnabled` adds the quirk cookie (`ufvdqk`) that
    // server-side quirk personalization needs. Its pairs are split at the
    // first hyphen, so quirk ids must not contain one.
    transitionStore: new NextCookieTransitionDataStore({ serverContext, experimental_quirksEnabled: true }),
    plugins,
  });
}
