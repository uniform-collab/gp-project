import type { LinkParamValue } from "@uniformdev/canvas";
import { ComponentProps, UniformText } from "@uniformdev/canvas-react";
import AppLink from "./ui/AppLink";

type MenuLinkProps = ComponentProps<{
  label: string;
  link?: LinkParamValue;
}>;

const linkClass = "text-[15px] leading-snug text-link hover:underline";

/**
 * `menuLink`: one link (`label`, `link`) in a Menu Column, Menu Featured or
 * Footer Column. Without a link the label renders as link-styled text, so it
 * stays visible and editable in Canvas.
 */
export default function MenuLink({ link }: MenuLinkProps) {
  return (
    <li>
      <AppLink link={link} className={linkClass}>
        <UniformText parameterId="label" as="span" placeholder="Label" />
      </AppLink>
    </li>
  );
}
