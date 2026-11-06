import { createContext, useContext } from "react";
import { imageFrom, type AssetParamValue } from "@uniformdev/assets";
import { flattenValues, type NumberParamValue } from "@uniformdev/canvas";
import { ComponentProps, UniformSlot, UniformText } from "@uniformdev/canvas-react";

type HeroSlideProps = ComponentProps<{
  title?: string;
  subtitle?: string;
  backgroundImage?: AssetParamValue;
  backgroundVideo?: AssetParamValue;
  thumbnail?: AssetParamValue;
  overlayOpacity?: NumberParamValue;
}>;

/** The slide's position in its carousel. The first slide's image loads first; the rest load lazily. */
export const SlideIndexContext = createContext(0);

/** `srcset` for the given widths. */
function srcSet(widths: number[], urlFor: (width: number) => string | undefined) {
  return widths.map((width) => `${urlFor(width)} ${width}w`).join(", ");
}

/** Overlay opacity as a fraction: the authored 0–80, clamped, 50 when unset. */
function overlayOpacityOf(value: NumberParamValue | undefined): number {
  const parsed = Number(value);
  return (
    Math.min(80, Math.max(0, value === undefined || value === "" || Number.isNaN(parsed) ? 50 : parsed)) / 100
  );
}

/**
 * `heroSlide`: one slide in a Hero Carousel, with a `title`, `subtitle`,
 * `backgroundImage`, an optional `backgroundVideo` (muted loop, with the image
 * as its poster), a `thumbnail` (falls back to the background image),
 * `overlayOpacity` and a `ctas` slot. `imageFrom` applies the asset's focal
 * point. The `data-*` attributes feed the carousel's thumbnail rail.
 */
export default function HeroSlide({
  title,
  backgroundImage,
  backgroundVideo,
  thumbnail,
  overlayOpacity,
}: HeroSlideProps) {
  const first = useContext(SlideIndexContext) === 0;
  const backgroundAsset = backgroundImage?.[0];
  const background = flattenValues(backgroundImage, { toSingle: true });
  // Cover crops at each size. imageFrom applies the asset's focal point to every one.
  const crop = (width: number, height: number) =>
    backgroundAsset && background?.url
      ? imageFrom(backgroundAsset).transform({ width, height, fit: "cover" }).url()
      : undefined;
  const backgroundSrc = crop(2400, 1400);
  const landscapeSet = srcSet([1200, 1800, 2400], (width) => crop(width, Math.round((width * 7) / 12)));
  // Phones show a tall slide, so they get a portrait crop instead.
  const portraitSet = srcSet([600, 900, 1200], (width) => crop(width, width * 1.5));
  const focalPoint = background?.focalPoint;
  const thumbAsset = thumbnail?.[0] ?? backgroundImage?.[0];
  const thumbSrc = thumbAsset
    ? imageFrom(thumbAsset).transform({ width: 240, height: 160, fit: "cover" }).url()
    : undefined;
  const videoUrl = flattenValues(backgroundVideo, { toSingle: true })?.url;

  return (
    <article
      data-hero-slide=""
      data-thumb={thumbSrc || undefined}
      data-title={title}
      aria-roledescription="slide"
      aria-label={title}
      className="relative h-[70vh] w-full shrink-0 snap-start overflow-hidden lg:h-[90vh]"
    >
      {videoUrl ? (
        <video
          className="absolute inset-0 size-full object-cover"
          src={videoUrl}
          poster={backgroundSrc}
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
        />
      ) : backgroundSrc ? (
        <picture>
          <source media="(max-width: 767px)" srcSet={portraitSet} sizes="100vw" />
          <img
            src={backgroundSrc}
            srcSet={landscapeSet}
            sizes="100vw"
            alt={background?.description ?? ""}
            loading={first ? "eager" : "lazy"}
            fetchPriority={first ? "high" : "auto"}
            style={
              focalPoint ? { objectPosition: `${focalPoint.x * 100}% ${focalPoint.y * 100}%` } : undefined
            }
            className="absolute inset-0 size-full object-cover"
          />
        </picture>
      ) : null}

      <div className="absolute inset-0 bg-navy-deep" style={{ opacity: overlayOpacityOf(overlayOpacity) }} />

      <div className="relative flex h-full flex-col justify-end px-6 pb-28 lg:px-8 lg:pb-36">
        <div className="max-w-[46rem]">
          <UniformText parameterId="title" as="h2" className="h-hero m-0" placeholder="Title" />
          <UniformText parameterId="subtitle" as="p" className="h-hero-sub m-0 mt-4" placeholder="Subtitle" />
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <UniformSlot name="ctas" />
          </div>
        </div>
      </div>
    </article>
  );
}
