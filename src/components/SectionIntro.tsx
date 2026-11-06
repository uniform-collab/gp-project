import type { RichTextParamValue } from "@uniformdev/canvas";
import { ComponentProps, UniformText } from "@uniformdev/canvas-react";
import { UniformRichText } from "@uniformdev/canvas-next";

type SectionIntroProps = ComponentProps<{
  heading?: string;
  body?: RichTextParamValue;
}>;

/**
 * `sectionIntro`: a centered `heading` over a rich-text `body`.
 * https://docs.uniform.app/docs/sdk/react#uniform-text
 */
export default function SectionIntro(_props: SectionIntroProps) {
  return (
    <section className="bg-white py-12 md:py-20">
      <div className="mx-auto w-full max-w-[1000px] px-6">
        <UniformText parameterId="heading" as="h2" className="h-section m-0" placeholder="Heading" />
        <UniformRichText
          parameterId="body"
          className="body-lg rich-text mt-6 text-center [&_p]:m-0 [&_p+p]:mt-4"
        />
      </div>
    </section>
  );
}
