import type { RichTextParamValue } from "@uniformdev/canvas";
import { ComponentProps, UniformText } from "@uniformdev/canvas-react";
import { UniformRichText } from "@uniformdev/canvas-next";
import { isOption } from "../uniform/params";

type HeroProps = ComponentProps<{
  title?: string;
  description?: RichTextParamValue;
  alignment?: string;
}>;

// Keyed by the values of the `alignment` select parameter.
const alignmentClass = {
  left: { section: "", description: "" },
  center: { section: "text-center", description: "mx-auto" },
  right: { section: "text-right", description: "ml-auto" },
};

/** `hero`: a static banner with a `title` (the page's `h1`) and a rich-text `description`. */
export default function Hero({ alignment }: HeroProps) {
  const align = isOption(alignmentClass, alignment) ? alignmentClass[alignment] : alignmentClass.left;

  return (
    <section className={`site-container py-12 md:py-20 ${align.section}`}>
      <UniformText className="h-split" parameterId="title" as="h1" placeholder="Title" />
      <UniformRichText
        parameterId="description"
        className={`body-lg rich-text mt-6 max-w-[70ch] ${align.description}`}
      />
    </section>
  );
}
