import { imageFrom, type AssetParamValue } from "@uniformdev/assets";
import { flattenValues, type LinkParamValue } from "@uniformdev/canvas";
import { ComponentProps, linkParamValueToAnchorProps } from "@uniformdev/canvas-react";
import { useIsCanvasEditor } from "../uniform/editorSelection";
import AppLink from "./ui/AppLink";

type LogoProps = ComponentProps<{
  image?: AssetParamValue;
  link?: LinkParamValue;
}>;

/**
 * `logo`: one mark in a Logo Grid, with an `image` and an optional `link` that
 * makes the whole box clickable. The image is scaled to fit (`contain`), never
 * cropped. Without an image it renders nothing, or an empty box in Canvas edit
 * mode.
 */
export default function Logo({ image, link }: LogoProps) {
  const editMode = useIsCanvasEditor();
  const asset = image?.[0];
  const mark = flattenValues(image, { toSingle: true });
  const box =
    "flex h-[200px] w-full items-center justify-center border border-line bg-white p-8 shadow-card md:h-[240px]";

  if (!asset || !mark?.url) return editMode ? <div className={box} /> : null;

  const hasLink = Boolean(linkParamValueToAnchorProps(link).href);

  const img = (
    <img
      src={imageFrom(asset).transform({ width: 600, height: 460, fit: "contain" }).url()}
      loading="lazy"
      alt={mark.description ?? ""}
      className="max-h-full max-w-full object-contain"
    />
  );

  return hasLink ? (
    <AppLink link={link} className={`${box} transition-shadow duration-200 hover:shadow-menu`}>
      {img}
    </AppLink>
  ) : (
    <div className={box}>{img}</div>
  );
}
