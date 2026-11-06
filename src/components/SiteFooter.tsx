import type { RichTextParamValue } from "@uniformdev/canvas";
import { ComponentProps, UniformSlot } from "@uniformdev/canvas-react";
import { UniformRichText } from "@uniformdev/canvas-next";

type SiteFooterProps = ComponentProps<{
  legalText?: RichTextParamValue;
}>;

/**
 * `siteFooter`: a `columns` slot of Footer Columns, then a band with the
 * `socialLinks` slot and the rich-text `legalText`.
 */
export default function SiteFooter(_props: SiteFooterProps) {
  return (
    <footer className="bg-navy-deep">
      <div className="px-6 py-12 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-6">
          <UniformSlot name="columns" />
        </div>

        <div className="mt-12 flex flex-col gap-5 border-t border-white/15 pt-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <UniformSlot name="socialLinks" />
          </div>
          <UniformRichText
            parameterId="legalText"
            className="max-w-[52ch] text-[12px] leading-[1.5] text-white/60 sm:text-right [&_a]:underline [&_a:hover]:text-white"
          />
        </div>
      </div>
    </footer>
  );
}
