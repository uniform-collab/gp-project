import type { RichTextParamValue } from "@uniformdev/canvas";
import { ComponentProps, UniformText } from "@uniformdev/canvas-react";
import { UniformRichText } from "@uniformdev/canvas-next";
import { useIsCanvasEditor } from "../uniform/editorSelection";

type RichTextBlockProps = ComponentProps<{
  lead?: string;
  body?: RichTextParamValue;
}>;

/**
 * `richTextBlock`: long-form prose. An optional `lead` line in the link color,
 * then a rich-text `body`.
 *
 * A blank `lead` is not rendered outside Canvas edit mode, because `UniformText`
 * would still output an empty `<p>` and its margin.
 */
export default function RichTextBlock({ lead }: RichTextBlockProps) {
  const editMode = useIsCanvasEditor();

  return (
    <section className="bg-white py-12 md:py-20">
      <div className="site-container">
        {lead?.trim() || editMode ? (
          <UniformText
            parameterId="lead"
            as="p"
            className="m-0 mb-6 text-[20px] leading-snug text-link md:text-[22px]"
            placeholder="Lead"
          />
        ) : null}

        <UniformRichText
          parameterId="body"
          className={[
            "body-lg rich-text",
            "[&_p]:m-0 [&_p+p]:mt-4",
            "[&_h3]:mt-8 [&_h3]:mb-3 [&_h3]:text-[20px] [&_h3]:font-semibold [&_h3]:text-ink",
            "[&_h2]:mt-10 [&_h2]:mb-3 [&_h2]:text-[22px] [&_h2]:font-semibold [&_h2]:text-ink",
            "[&_a]:text-link [&_a]:underline [&_a]:underline-offset-2",
          ].join(" ")}
        />
      </div>
    </section>
  );
}
