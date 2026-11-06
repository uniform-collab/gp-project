import { ComponentProps, UniformSlot } from "@uniformdev/canvas-react";

type ChecklistProps = ComponentProps;

/**
 * `checklist`: an `items` slot of Checklist Items. Each line is its own
 * component rather than one list parameter, so authors can add, remove and
 * reorder lines.
 */
export default function Checklist(_props: ChecklistProps) {
  return (
    <ul className="m-0 flex list-none flex-col gap-6 p-0">
      <UniformSlot name="items" />
    </ul>
  );
}
