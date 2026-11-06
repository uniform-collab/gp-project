import { useId, useState } from "react";
import type { RichTextParamValue } from "@uniformdev/canvas";
import { ComponentProps, UniformText } from "@uniformdev/canvas-react";
import { UniformRichText } from "@uniformdev/canvas-next";
import { useIsCanvasEditor, useSelectionWithin } from "../uniform/editorSelection";
import { MinusIcon, PlusIcon } from "./ui/icons";
import { useFaq } from "./FaqAccordion";

type FaqItemProps = ComponentProps<{
  question?: string;
  answer?: RichTextParamValue;
}>;

/**
 * `faqItem`: a `question` and a rich-text `answer`. The trigger is a `<button>`
 * with `aria-expanded` / `aria-controls` pointing at the answer panel.
 *
 * In an FAQ Accordion the open state comes from the accordion. On its own, for
 * example in a component pattern preview, the item keeps its own state and
 * starts open.
 * https://docs.uniform.app/docs/guides/patterns/component-patterns
 *
 * In Canvas edit mode the item is open while the selection is on or inside it,
 * and the trigger is a `span role="button"`: browsers do not place a text caret
 * inside a native `<button>`, so its text could not be edited inline.
 */
export default function FaqItem({ component }: FaqItemProps) {
  const fallbackId = useId();
  const id = component?._id ?? fallbackId;
  const panelId = `${id}-answer`;
  const accordion = useFaq();
  const [openAlone, setOpenAlone] = useState(true);
  const selectionInside = useSelectionWithin(component);
  const open = selectionInside || (accordion ? accordion.openId === id : openAlone);
  const toggle = () => (accordion ? accordion.toggle(id) : setOpenAlone((current) => !current));
  const editMode = useIsCanvasEditor();
  const Trigger = editMode ? "span" : "button";

  return (
    <div className="border-b border-line">
      <h3 className="m-0">
        <Trigger
          type={editMode ? undefined : "button"}
          role={editMode ? "button" : undefined}
          aria-expanded={open}
          aria-controls={panelId}
          onClick={toggle}
          className="flex w-full items-start justify-between gap-6 py-5 text-left"
        >
          <UniformText
            parameterId="question"
            as="span"
            className="text-[18px] leading-snug text-ink md:text-[20px]"
            placeholder="Question"
          />
          <span aria-hidden="true" className="mt-1 shrink-0 text-ink-muted">
            {open ? <MinusIcon className="size-5" /> : <PlusIcon className="size-5" />}
          </span>
        </Trigger>
      </h3>

      <div id={panelId} className={open ? "block" : "hidden"}>
        <UniformRichText
          parameterId="answer"
          className="body-lg rich-text pb-6 md:pr-12 [&_p]:m-0 [&_p+p]:mt-4 [&_a]:text-link [&_a]:underline [&_a]:underline-offset-2"
        />
      </div>
    </div>
  );
}
