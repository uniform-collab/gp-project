import type { RichTextParamValue } from "@uniformdev/canvas";
import { ComponentProps, UniformSlot } from "@uniformdev/canvas-react";
import { UniformRichText } from "@uniformdev/canvas-next";
import { imageFrom, type AssetParamValue } from "@uniformdev/assets";
import { flattenValues } from "@uniformdev/canvas";

type EventCardProps = ComponentProps<{
  image?: AssetParamValue;
  body?: RichTextParamValue;
}>;

/**
 * `eventCard`: an `image`, a rich-text `body` and a `cta` slot. The image is
 * scaled to fit (`contain`), never cropped.
 */
export default function EventCard({ image }: EventCardProps) {
  const asset = image?.[0];
  const picture = flattenValues(image, { toSingle: true });

  return (
    <article className="flex h-full flex-col border border-line bg-white p-6 shadow-card">
      {asset && picture?.url ? (
        <img
          src={imageFrom(asset).transform({ width: 600, height: 420, fit: "contain" }).url()}
          loading="lazy"
          alt={picture.description ?? ""}
          className="mb-6 h-[190px] w-full object-contain object-left"
        />
      ) : null}

      <UniformRichText
        parameterId="body"
        className="body-sm rich-text [&_h2]:h-card [&_h2]:m-0 [&_h3]:h-card [&_h3]:m-0 [&_p]:m-0 [&_p+p]:mt-3 [&_h2+p]:mt-3 [&_h3+p]:mt-3"
      />

      <div className="mt-auto pt-6 empty:pt-0">
        <UniformSlot name="cta" />
      </div>
    </article>
  );
}
