import { useEffect, useId } from "react";
import type { LinkParamValue } from "@uniformdev/canvas";
import {
  ComponentProps,
  linkParamValueToAnchorProps,
  UniformSlot,
  UniformText,
} from "@uniformdev/canvas-react";
import { useIsCanvasEditor, useSelectionWithin } from "../uniform/editorSelection";
import { ChevronDownIcon } from "./ui/icons";
import AppLink from "./ui/AppLink";
import { useMegaMenu } from "./ui/MegaMenuShell";

type MegaMenuItemProps = ComponentProps<{
  label: string;
  link?: LinkParamValue;
}>;

// Uppercase white on the navy bar, dark on the white mobile drawer. The `!`
// beats `.nav-label`'s own color, whose source order is not guaranteed.
const triggerClass =
  "nav-label flex w-full items-center justify-between gap-2 px-6 py-4 text-left text-ink-strong! lg:h-full lg:w-auto lg:justify-start lg:px-0 lg:py-0 lg:text-white!";

/**
 * `megaMenuItem`: a top-level entry in the Site Header's `navItems` slot, with a
 * `label`, a `link`, and `columns` (Menu Columns) and `featured` (Menu
 * Featured) slots.
 *
 * With a link it is a plain link and the slots are not rendered. Without one,
 * the label is a disclosure button (`aria-expanded` / `aria-controls`, not an
 * ARIA `menu`) for a panel holding both slots: full-width under the bar with a
 * caret on desktop, an accordion row in the mobile drawer. Open state lives in
 * MegaMenuShell; mouse hover opens and closes the panel with a delay, touch and
 * pen use the click.
 *
 * In Canvas edit mode the panel (and on mobile the drawer) is open while the
 * selection is on or inside the item, and the trigger is a
 * `span role="button"`: browsers do not place a text caret inside a native
 * `<button>`, so its text could not be edited inline.
 * https://docs.uniform.app/docs/guides/composition/visual-editing/activate-visual-editing/inline-editing
 */
export default function MegaMenuItem({ link, component }: MegaMenuItemProps) {
  const id = useId();
  const panelId = `${id}-panel`;
  const hasLink = Boolean(linkParamValueToAnchorProps(link).href);
  const { openId, toggle, hoverOpen, hoverClose, openDrawer } = useMegaMenu();
  const editMode = useIsCanvasEditor();
  // `undefined` outside Canvas edit mode, where the shell's open state applies.
  const selectionInside = useSelectionWithin(component);
  const isOpen = selectionInside ?? openId === id;
  const Trigger = editMode ? "span" : "button";

  useEffect(() => {
    if (selectionInside) openDrawer();
  }, [selectionInside, openDrawer]);

  const label = <UniformText parameterId="label" as="span" placeholder="Label" />;

  if (hasLink) {
    return (
      <li className="border-b border-line lg:h-full lg:border-0">
        <AppLink link={link} className={triggerClass}>
          {label}
        </AppLink>
      </li>
    );
  }

  return (
    <li
      className="border-b border-line lg:h-full lg:border-0"
      // Mouse only: on touch, pointerleave fires as soon as the finger lifts,
      // which would close the panel that the tap just opened.
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse") hoverOpen(id);
      }}
      onPointerLeave={(event) => {
        if (event.pointerType === "mouse") hoverClose();
      }}
    >
      <div className="relative lg:h-full">
        <Trigger
          type={editMode ? undefined : "button"}
          role={editMode ? "button" : undefined}
          aria-expanded={isOpen}
          aria-controls={panelId}
          onClick={() => toggle(id)}
          className={triggerClass}
        >
          {label}
          <ChevronDownIcon
            className={`size-5 transition-transform duration-200 lg:hidden ${isOpen ? "rotate-180" : ""}`}
          />
        </Trigger>

        {/* Caret centred under the trigger, desktop only. */}
        <span
          aria-hidden="true"
          className={`absolute left-1/2 top-full z-50 size-3 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-white ${
            isOpen ? "hidden lg:block" : "hidden"
          }`}
        />
      </div>

      <div
        id={panelId}
        // Mobile: a tinted, in-flow section under the trigger, so it reads as one
        // level down. Desktop: a white panel hanging under the bar.
        className={`bg-surface-warm lg:absolute lg:inset-x-0 lg:top-full lg:z-40 lg:bg-white lg:shadow-menu ${
          isOpen ? "block" : "hidden"
        }`}
      >
        <div className="flex flex-col gap-2 px-6 pb-6 lg:flex-row lg:flex-wrap lg:gap-16 lg:px-10 lg:py-12">
          {/* On mobile each column is a collapsible row (see MenuColumn). */}
          <div className="flex flex-1 flex-col lg:flex-row lg:gap-16">
            <UniformSlot name="columns" />
          </div>
          <UniformSlot name="featured" />
        </div>
      </div>
    </li>
  );
}
