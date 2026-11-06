import type { LinkParamValue } from "@uniformdev/canvas";
import { ComponentProps, linkParamValueToAnchorProps, UniformText } from "@uniformdev/canvas-react";
import { useIsCanvasEditor } from "../uniform/editorSelection";
import { isOption } from "../uniform/params";
import AppLink from "./ui/AppLink";

type ButtonProps = ComponentProps<{
  label?: string;
  link?: LinkParamValue;
  variant?: string;
}>;

const base =
  "btn-label inline-flex items-center justify-center text-center transition-[filter,text-decoration-color] duration-200";
const pill = "h-12 rounded-pill px-10";

// Keyed by the values of the `variant` select parameter.
const variantClass = {
  primary: `${base} ${pill} bg-navy text-white hover:brightness-90`,
  secondary: `${base} ${pill} bg-sky text-white hover:brightness-90`,
  outlineWhite: `${base} ${pill} border-2 border-white bg-white text-navy hover:brightness-90 focus-visible:outline-white`,
  textLink: `${base} text-navy underline decoration-sky decoration-2 underline-offset-[6px] hover:decoration-navy`,
};

/**
 * `button`: a call-to-action link. Renders only with a label and a link, except
 * in Canvas edit mode, where it always renders so the label can be typed and a
 * link picked. Without a link it is then a `span role="button"`: browsers do
 * not place a text caret inside a native `<button>`, so its text could not be
 * edited inline.
 */
export default function Button({ label, link, variant }: ButtonProps) {
  const className = isOption(variantClass, variant) ? variantClass[variant] : variantClass.primary;
  const hasLink = Boolean(linkParamValueToAnchorProps(link).href);
  const editMode = useIsCanvasEditor();

  if (!editMode && (!label?.trim() || !hasLink)) return null;

  const text = <UniformText parameterId="label" as="span" placeholder="Label" />;

  if (hasLink) {
    return (
      <AppLink link={link} className={className}>
        {text}
      </AppLink>
    );
  }

  return (
    <span role="button" className={className}>
      {text}
    </span>
  );
}
