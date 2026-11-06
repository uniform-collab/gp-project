import { ComponentProps, UniformSlot, UniformText } from "@uniformdev/canvas-react";

type LogoGridProps = ComponentProps<{
  heading?: string;
}>;

/**
 * `logoGrid`: an optional `heading` over a `logos` slot of Logos. Three across
 * from `md`; below that a scroll-snap swipe strip that needs no JavaScript. The
 * `[&>*]` classes size the slot's children, which the slot renders unwrapped.
 */
export default function LogoGrid(_props: LogoGridProps) {
  return (
    <section className="bg-white py-12 md:py-20">
      <div className="site-container">
        <UniformText parameterId="heading" as="h2" className="h-section m-0 mb-10" placeholder="Heading" />

        <div className="no-scrollbar -mx-6 flex snap-x snap-mandatory gap-6 overflow-x-auto px-6 md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0 [&>*]:w-[78%] [&>*]:shrink-0 [&>*]:snap-center md:[&>*]:w-auto">
          <UniformSlot name="logos" />
        </div>
      </div>
    </section>
  );
}
