import { ComponentProps, UniformSlot, UniformText } from "@uniformdev/canvas-react";

type CtaBannerProps = ComponentProps<{
  heading?: string;
  body?: string;
  background?: "darkBlue" | "transparent";
}>;

/**
 * `ctaBanner`: a full-bleed band with a `heading`, a short `body` and a `cta`
 * slot of Buttons. `background` is navy (`darkBlue`, the default) or
 * `transparent`, which switches the text to navy.
 */
export default function CtaBanner({ background }: CtaBannerProps) {
  const transparent = background === "transparent";
  const tone = transparent ? "text-navy" : "text-white";

  return (
    <section className={`${transparent ? "bg-transparent" : "bg-navy-header"} py-12 md:py-16`}>
      <div className="site-container flex flex-col items-center text-center">
        <UniformText
          parameterId="heading"
          as="h2"
          className={`m-0 max-w-[24ch] text-[26px] leading-tight font-semibold md:text-[32px] ${tone}`}
          placeholder="Heading"
        />
        <UniformText
          parameterId="body"
          as="p"
          className={`m-0 mt-4 max-w-[70ch] text-[16px] leading-relaxed ${tone}`}
          placeholder="Body"
        />
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4 empty:mt-0">
          <UniformSlot name="cta" />
        </div>
      </div>
    </section>
  );
}
