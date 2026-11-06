// Builds a Uniform Context from the request's cookies and passes it to _app.tsx
// as `serverUniformContext`, so personalization and A/B test variations render
// on the server.
// https://docs.uniform.app/docs/sdk/nextjs-page-router

import Document, { Head, Html, Main, NextScript, type DocumentContext } from "next/document";
import { enableNextSsr } from "@uniformdev/context-next";
import { createUniformContext } from "../uniform/context";

export default class AppDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    enableNextSsr(ctx, createUniformContext(ctx));
    return Document.getInitialProps(ctx);
  }

  render() {
    return (
      <Html lang="en">
        <Head />
        <body className="antialiased">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
