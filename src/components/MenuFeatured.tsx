import { ComponentProps, UniformSlot, UniformText } from "@uniformdev/canvas-react";
import { imageFrom, type AssetParamValue } from "@uniformdev/assets";
import { flattenValues } from "@uniformdev/canvas";

type MenuFeaturedProps = ComponentProps<{
  image?: AssetParamValue;
  heading: string;
}>;

/**
 * `menuFeatured`: the promo column at the end of a Mega Menu Item panel, with
 * an optional `image`, a `heading` and a `links` slot of Menu Links. Without an
 * image the column starts at the heading.
 */
export default function MenuFeatured({ image }: MenuFeaturedProps) {
  const asset = image?.[0];
  const featuredImage = flattenValues(image, { toSingle: true });

  return (
    <div className="w-full pt-3 lg:w-[290px] lg:shrink-0 lg:pt-0">
      {asset && featuredImage?.url ? (
        <img
          src={imageFrom(asset).transform({ width: 580, height: 440, fit: "cover" }).url()}
          loading="lazy"
          alt={featuredImage.description ?? ""}
          width={580}
          height={440}
          className="h-[220px] w-full object-cover"
        />
      ) : null}

      <UniformText
        parameterId="heading"
        as="h3"
        className="h-menu m-0 mt-5 uppercase"
        placeholder="Heading"
      />

      <ul className="m-0 mt-4 flex list-none flex-col gap-4 p-0 lg:gap-5">
        <UniformSlot name="links" />
      </ul>
    </div>
  );
}
