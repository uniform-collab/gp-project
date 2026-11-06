import { useId, useState } from "react";
import type { LinkParamValue } from "@uniformdev/canvas";
import {
  ComponentProps,
  linkParamValueToAnchorProps,
  UniformSlot,
  UniformText,
} from "@uniformdev/canvas-react";
import { useIsCanvasEditor, useSelectionWithin } from "../uniform/editorSelection";
import AppLink from "./ui/AppLink";
import { ChevronDownIcon } from "./ui/icons";
import { DESKTOP_QUERY, useMediaQuery } from "./ui/useMediaQuery";

type MenuColumnProps = ComponentProps<{
  heading: string;
  footerLinkLabel?: string;
  footerLink?: LinkParamValue;
}>;

/**
 * `menuColumn`: a `heading` over a `links` slot of Menu Links in a Mega Menu
 * Item panel, with an optional "view all" row (`footerLinkLabel`,
 * `footerLink`) under the list.
 *
 * Desktop: always open. Mobile drawer: the heading is a disclosure button that
 * shows and hides the links, so a panel with several long columns stays short.
 * In Canvas edit mode the column is open while the selection is on or inside
 * it, and the trigger is a `span role="button"`: browsers do not place a text
 * caret inside a native `<button>`, so its text could not be edited inline.
 *
 * The view-all row renders when either of its fields is set. With a label but
 * no link it is plain text, so the label can be authored before the link.
 */
export default function MenuColumn({ footerLinkLabel, footerLink, component }: MenuColumnProps) {
  const isDesktop = useMediaQuery(DESKTOP_QUERY);
  const editMode = useIsCanvasEditor();
  const selectionInside = useSelectionWithin(component);
  const [open, setOpen] = useState(false);
  const listId = useId();

  const footerHref = linkParamValueToAnchorProps(footerLink).href;
  const hasFooterLink = Boolean(footerLinkLabel?.trim() || footerHref);

  const links = (
    <>
      <ul className={`m-0 flex list-none flex-col p-0 ${isDesktop ? "mt-5 gap-5" : "gap-4"}`}>
        <UniformSlot name="links" />
      </ul>

      {hasFooterLink ? (
        <div className={isDesktop ? "mt-5" : "mt-4"}>
          {footerHref ? (
            <AppLink link={footerLink} className="text-[15px] font-semibold text-link hover:underline">
              <UniformText parameterId="footerLinkLabel" as="span" placeholder="Label" />
            </AppLink>
          ) : (
            <UniformText
              parameterId="footerLinkLabel"
              as="span"
              className="text-[15px] font-semibold text-link"
              placeholder="Label"
            />
          )}
        </div>
      ) : null}
    </>
  );

  if (isDesktop) {
    return (
      <div className="min-w-0 flex-1">
        <UniformText parameterId="heading" as="h3" className="h-menu m-0" placeholder="Heading" />
        {links}
      </div>
    );
  }

  const expanded = Boolean(selectionInside) || open;
  const Trigger = editMode ? "span" : "button";

  return (
    <div className="border-b border-line">
      <h3 className="m-0">
        <Trigger
          type={editMode ? undefined : "button"}
          role={editMode ? "button" : undefined}
          aria-expanded={expanded}
          aria-controls={listId}
          onClick={() => setOpen((current) => !current)}
          className="flex w-full items-center justify-between gap-4 py-4 text-left"
        >
          <UniformText
            parameterId="heading"
            as="span"
            className="text-[16px] font-semibold leading-snug text-ink-strong"
            placeholder="Heading"
          />
          <ChevronDownIcon
            className={`size-5 shrink-0 text-ink-muted transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
          />
        </Trigger>
      </h3>
      <div id={listId} className={expanded ? "block pb-5" : "hidden"}>
        {links}
      </div>
    </div>
  );
}
