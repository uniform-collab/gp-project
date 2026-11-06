// The 404 page: the composition at /404 in the project map, so it is edited in
// Canvas like any page. Next.js renders it statically and refreshes it every
// five minutes; without that composition a plain message shows.

import type { GetStaticProps } from "next";
import type { ParsedUrlQuery } from "node:querystring";
import type { UniformCompositionProps } from "@uniformdev/canvas-react";
import type { UniformPreviewData } from "@uniformdev/canvas-next";
import { withUniformGetStaticProps } from "@uniformdev/canvas-next/route";
import { Composition } from "../components/Composition";
import { PageHead } from "../components/PageHead";
import StatusPage from "../components/ui/StatusPage";
import { contentState, DEFAULT_LOCALE } from "../uniform/content";

type NotFoundProps = Partial<Pick<UniformCompositionProps, "data" | "matchedRoute" | "dynamicInputs">>;

const getComposition = withUniformGetStaticProps({
  modifyPath: () => "/404",
  requestOptions: (context) => ({
    state: contentState(context.preview),
    locale: DEFAULT_LOCALE,
    withComponentIDs: true,
  }),
});

export const getStaticProps: GetStaticProps<NotFoundProps, ParsedUrlQuery, UniformPreviewData> = async (
  context,
) => {
  const result = await getComposition(context);
  // pages/404 cannot return `notFound` or a redirect.
  return { props: "props" in result ? result.props : {}, revalidate: 300 };
};

export default function NotFoundPage({ data, matchedRoute, dynamicInputs }: NotFoundProps) {
  if (!data) {
    return <StatusPage status={404} />;
  }

  return (
    <>
      <PageHead composition={data} />
      <Composition data={data} matchedRoute={matchedRoute} dynamicInputs={dynamicInputs} />
    </>
  );
}
