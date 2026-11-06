// Wraps every page: global CSS, the brand font and the Uniform Context.

import "../globals.css";
import Head from "next/head";
import { Montserrat } from "next/font/google";
import type { UniformAppProps } from "@uniformdev/context-next";
import { UniformContext } from "@uniformdev/context-react";
import { createUniformContext } from "../uniform/context";

// Montserrat substitutes for the licensed brand face (Gotham). Bound to
// --font-brand, which globals.css maps to Tailwind's --font-sans.
const brandFont = Montserrat({ subsets: ["latin"], weight: ["300", "400", "600", "700"], display: "swap" });

// The browser's Context, created once and kept across client-side navigations.
// It reads the visitor's cookies, so it agrees with what the server rendered.
const clientContext = createUniformContext();

export default function App({ Component, pageProps, serverUniformContext }: UniformAppProps) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <style jsx global>{`
        :root {
          --font-brand: ${brandFont.style.fontFamily};
        }
      `}</style>

      {/* Server: the per-request Context from _document.tsx. Browser: the
          client Context. "standard": variations are chosen in React. */}
      <UniformContext context={serverUniformContext ?? clientContext} outputType="standard">
        <Component {...pageProps} />
      </UniformContext>
    </>
  );
}
