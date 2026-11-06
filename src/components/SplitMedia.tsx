import {
  ComponentProps,
  linkParamValueToAnchorProps,
  UniformSlot,
  UniformText,
} from "@uniformdev/canvas-react";
import { UniformRichText } from "@uniformdev/canvas-next";
import { useIsCanvasEditor } from "../uniform/editorSelection";
import { isOption } from "../uniform/params";
import { imageFrom, type AssetParamValue } from "@uniformdev/assets";
import { flattenValues, type LinkParamValue, type RichTextParamValue } from "@uniformdev/canvas";
import VideoModal from "./ui/VideoModal";

type SplitMediaProps = ComponentProps<{
  eyebrow?: string;
  heading?: string;
  headingStyle?: string;
  body?: RichTextParamValue;
  media?: AssetParamValue;
  videoUrl?: LinkParamValue;
  mediaPosition?: string;
  background?: string;
}>;

// `white` is a plain section; `greyPanel` tints the text side.
const BACKGROUNDS = {
  white: "",
  greyPanel: "bg-surface-grey",
};

type MediaPosition = "left" | "right" | "above" | "below";

// Text leads in the DOM so mobile reads text-first for the column layouts;
// `order` only has to intervene for the banded ones and on desktop.
const ORDER: Record<MediaPosition, { text: string; media: string }> = {
  left: { text: "lg:order-2", media: "lg:order-1" },
  right: { text: "lg:order-1", media: "lg:order-2" },
  above: { text: "order-2", media: "order-1" },
  below: { text: "order-1", media: "order-2" },
};

// Crop anchor for an asset without a focal point: a side column keeps the edge
// it sits against (a left-hand image keeps its left edge), a full-width band
// centres. `focal` feeds the image transform, `className` the CSS crop.
const EDGE_ANCHOR: Record<MediaPosition, { focal?: { x: number; y: number }; className: string }> = {
  left: { focal: { x: 0, y: 0.5 }, className: "object-left" },
  right: { focal: { x: 1, y: 0.5 }, className: "object-right" },
  above: { className: "object-center" },
  below: { className: "object-center" },
};

/**
 * `splitMedia`: text beside, above or below an image, with an optional video
 * button. Buttons and checklists go in the `content` slot.
 *
 * `left` / `right` stack text-first on mobile; `above` / `below` keep their
 * order at every width. Without media the text runs full width.
 *
 * The image is cropped on the server (`fit=cover`) and again by `object-cover`
 * in the browser; both use the asset's focal point, or the edge anchor without
 * one.
 */
export default function SplitMedia({
  eyebrow,
  headingStyle,
  media,
  videoUrl,
  mediaPosition,
  background,
  component,
}: SplitMediaProps) {
  const editMode = useIsCanvasEditor();
  const position = isOption(ORDER, mediaPosition) ? mediaPosition : "left";
  const stacked = position === "above" || position === "below";

  const asset = media?.[0];
  const image = flattenValues(media, { toSingle: true });
  const focalPoint = image?.focalPoint;
  const anchor = EDGE_ANCHOR[position];

  // Banded media spans the page, so it is requested wider. imageFrom applies
  // the asset's focal point itself; without one, anchor to the edge.
  const size = { width: stacked ? 2000 : 1200, height: 900 };
  const src =
    asset && image?.url
      ? imageFrom(asset)
          .transform(
            !focalPoint && anchor.focal
              ? { ...size, fit: "cover", focal: anchor.focal }
              : { ...size, fit: "cover" },
          )
          .url()
      : undefined;
  const objectPositionClass = focalPoint ? "" : anchor.className;
  // A focal point can be anywhere, so it cannot be a static Tailwind class.
  const objectPositionStyle = focalPoint
    ? { objectPosition: `${focalPoint.x * 100}% ${focalPoint.y * 100}%` }
    : undefined;

  const videoHref = linkParamValueToAnchorProps(videoUrl).href;
  const textBackground = isOption(BACKGROUNDS, background) ? BACKGROUNDS[background] : BACKGROUNDS.white;
  const headingClass = headingStyle === "bold" ? "h-split font-bold" : "h-split";
  const textOrder = src ? ORDER[position].text : "";
  const mediaOrder = ORDER[position].media;

  // A full-bleed text band needs its own measure; a half-width column already
  // has one from the grid.
  const constrainText = !image || stacked;

  return (
    <section className="bg-white">
      <div className={`grid grid-cols-1 ${image && !stacked ? "lg:grid-cols-2" : ""}`}>
        <div
          className={`flex flex-col justify-center px-6 py-12 lg:px-16 lg:py-20 ${textBackground} ${textOrder}`}
        >
          <div className={constrainText ? "mx-auto w-full max-w-[70ch]" : ""}>
            {/* An empty eyebrow is hidden outside Canvas edit mode and kept in it,
                so authors can click it and type. */}
            {eyebrow?.trim() || editMode ? (
              <UniformText parameterId="eyebrow" as="p" className="eyebrow m-0 mb-4" placeholder="Eyebrow" />
            ) : null}

            <UniformText
              parameterId="heading"
              as="h2"
              className={`${headingClass} m-0`}
              placeholder="Heading"
            />

            <UniformRichText
              parameterId="body"
              className="body-lg rich-text check-list mt-5 [&_p]:m-0 [&_p+p]:mt-4"
            />

            {editMode || component?.slots?.content?.length ? (
              <div className="mt-8 flex flex-col items-start gap-6 empty:mt-0">
                <UniformSlot name="content" />
              </div>
            ) : null}
          </div>
        </div>

        {src ? (
          <div className={`relative ${mediaOrder}`}>
            <img
              src={src}
              loading="lazy"
              alt={image?.description ?? ""}
              style={objectPositionStyle}
              className={`${objectPositionClass} ${
                stacked
                  ? "h-[280px] w-full object-cover lg:h-[460px]"
                  : "size-full min-h-[280px] object-cover lg:min-h-[520px]"
              }`}
            />
            {videoHref ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <VideoModal url={videoHref} />
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </section>
  );
}
