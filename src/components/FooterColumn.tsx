import { ComponentProps, UniformSlot, UniformText } from "@uniformdev/canvas-react";

type FooterColumnProps = ComponentProps<{
  heading?: string;
}>;

/**
 * `footerColumn`: a `heading` over a `links` slot of Menu Links.
 *
 * Menu Links are styled for the white menu panel; the `[&_a]:` classes here
 * recolor them for the navy footer.
 */
export default function FooterColumn(_props: FooterColumnProps) {
  return (
    <div>
      <UniformText
        parameterId="heading"
        as="h3"
        className="m-0 text-[13px] font-bold uppercase tracking-[0.06em] text-white"
        placeholder="Heading"
      />

      <ul className="m-0 mt-4 flex list-none flex-col gap-1 p-0 [&_a]:text-[14px] [&_a]:font-light [&_a]:leading-[1.5] [&_a]:text-white/75 [&_a:hover]:text-white [&_a:hover]:underline">
        <UniformSlot name="links" />
      </ul>
    </div>
  );
}
