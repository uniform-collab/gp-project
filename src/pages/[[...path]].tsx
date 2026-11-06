// Every page. Uniform's Route API resolves the URL against the project map and
// returns a composition, a redirect or not found.
// https://docs.uniform.app/docs/sdk/nextjs-page-router

import type { UniformCompositionNextPage } from "@uniformdev/canvas-next";
import { withUniformGetServerSideProps } from "@uniformdev/canvas-next/route";
import { Composition } from "../components/Composition";
import { PageHead } from "../components/PageHead";
import { contentState, DEFAULT_LOCALE } from "../uniform/content";

export const getServerSideProps = withUniformGetServerSideProps({
  requestOptions: (context) => ({
    state: contentState(context.preview),
    locale: DEFAULT_LOCALE,
    // Component `_id`s, which the FAQ accordion uses to open its first item.
    withComponentIDs: true,
  }),
});

const Page: UniformCompositionNextPage = ({ data, matchedRoute, dynamicInputs }) => (
  <>
    <PageHead composition={data} />
    <Composition data={data} matchedRoute={matchedRoute} dynamicInputs={dynamicInputs} />
  </>
);

export default Page;
