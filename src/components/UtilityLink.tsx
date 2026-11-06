import type { LinkParamValue } from "@uniformdev/canvas";
import { ComponentProps, UniformText } from "@uniformdev/canvas-react";
import { isOption } from "../uniform/params";
import AppLink from "./ui/AppLink";
import { CartIcon, ListIcon, UserIcon } from "./ui/icons";

type UtilityLinkProps = ComponentProps<{
  label: string;
  link?: LinkParamValue;
  icon?: string;
}>;

/** Icon per `icon` param value. SiteHeader reuses it for the mobile drawer. */
export const UTILITY_ICONS = { user: UserIcon, list: ListIcon, cart: CartIcon } as const;

/**
 * `utilityLink`: a link in the Site Header's `utilityLinks` slot, with a
 * `label`, a `link` and an `icon` (none, user, list or cart).
 *
 * The icon also decides where the link sits. SiteHeader renders the slot as
 * one unit and cannot sort its children, so each link places itself with
 * CSS `order`. From `lg` the cluster is a two-row grid flowing in columns:
 * - user links (order 1) stack in the first column, with a rule between them;
 * - SiteHeader's search (order 2) comes next;
 * - other links (order 3), then the cart (order 4), span both rows.
 */
export default function UtilityLink({ link, icon }: UtilityLinkProps) {
  const kind = isOption(UTILITY_ICONS, icon) ? icon : "none";
  const Icon = kind === "none" ? null : UTILITY_ICONS[kind];
  const isUser = kind === "user";
  const isCart = kind === "cart";

  // `:has(~ …)` targets only a user link that is followed by another one, so
  // the rule lands between the two rather than under both.
  const placement = isUser
    ? "order-1 self-start [&:has(~[data-utility-icon=user])]:border-b [&:has(~[data-utility-icon=user])]:border-white/50 [&:has(~[data-utility-icon=user])]:pb-1.5"
    : `lg:row-span-2 ${isCart ? "order-4" : "order-3"}`;

  // Below `lg` only the cart shows on the bar, as a 44px tap target, with its
  // label visually hidden. The other links are hidden here and listed in the
  // mobile drawer instead (see SiteHeader).
  const visibility = isCart
    ? "inline-flex size-11 justify-center lg:size-auto lg:justify-start"
    : "hidden lg:inline-flex";

  const className = `items-center gap-2 text-[15px] leading-tight text-white hover:underline ${visibility} ${placement}`;

  const content = (
    <>
      {Icon ? <Icon className="size-[18px] shrink-0" /> : null}
      <UniformText
        parameterId="label"
        as="span"
        className={isCart ? "sr-only" : undefined}
        placeholder="Label"
      />
    </>
  );

  return (
    <AppLink link={link} data-utility-icon={kind} className={className}>
      {content}
    </AppLink>
  );
}
