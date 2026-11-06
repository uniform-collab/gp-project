import Head from "next/head";
import type { RootComponentInstance } from "@uniformdev/canvas";
import { convertComponentToProps } from "@uniformdev/canvas-react";

const DEFAULT_TITLE = "KOLO Smart Monitoring System | GP PRO";

/**
 * `<title>` and meta description from the Page's `metaTitle` and
 * `metaDescription`. In Canvas edit mode the server renders an empty
 * composition, so the default title shows there.
 */
export function PageHead({ composition }: { composition?: RootComponentInstance }) {
  const { metaTitle, metaDescription } = composition
    ? convertComponentToProps<{ metaTitle?: string; metaDescription?: string }>(composition)
    : {};

  return (
    <Head>
      <title>{metaTitle?.trim() || DEFAULT_TITLE}</title>
      {metaDescription?.trim() ? <meta name="description" content={metaDescription.trim()} /> : null}
    </Head>
  );
}
