import { ComponentProps, UniformSlot, UniformText } from "@uniformdev/canvas-react";
import { imageFrom, type AssetParamValue } from "@uniformdev/assets";
import { flattenValues } from "@uniformdev/canvas";

type ArticleCardProps = ComponentProps<{
  title?: string;
  excerpt?: string;
  image?: AssetParamValue;
}>;

/**
 * `articleCard`: `image`, `title`, `excerpt` and a `cta` slot. Lays out by its
 * own width (container query): image beside the text when there is room,
 * on top otherwise.
 */
export default function ArticleCard({ image }: ArticleCardProps) {
  const asset = image?.[0];
  const picture = flattenValues(image, { toSingle: true });

  return (
    <article className="@container h-full border border-line bg-white shadow-card">
      <div className="flex h-full flex-col @xl:flex-row">
        {asset && picture?.url ? (
          <img
            src={imageFrom(asset).transform({ width: 900, height: 700, fit: "cover" }).url()}
            loading="lazy"
            alt={picture.description ?? ""}
            className="h-[220px] w-full shrink-0 object-cover @xl:h-auto @xl:w-2/5 @xl:self-stretch"
          />
        ) : null}

        <div className="flex flex-1 flex-col p-6 @xl:p-8">
          <UniformText parameterId="title" as="h3" className="h-card m-0 text-link!" placeholder="Title" />
          <UniformText parameterId="excerpt" as="p" className="body-lg m-0 mt-3" placeholder="Excerpt" />

          {/* `mt-auto` keeps CTA buttons level across a row of cards. */}
          <div className="mt-auto pt-5 empty:pt-0">
            <UniformSlot name="cta" />
          </div>
        </div>
      </div>
    </article>
  );
}
