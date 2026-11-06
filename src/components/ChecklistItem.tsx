import { ComponentProps, UniformText } from "@uniformdev/canvas-react";
import { CheckIcon } from "./ui/icons";

type ChecklistItemProps = ComponentProps<{
  text?: string;
}>;

/**
 * `checklistItem`: one checklist line (`text`) with a checkmark. Renders an
 * `<li>`, so it belongs in a Checklist.
 */
export default function ChecklistItem(_props: ChecklistItemProps) {
  return (
    <li className="flex items-start gap-3">
      <CheckIcon className="mt-0.5 size-5 shrink-0" />
      <UniformText
        parameterId="text"
        as="span"
        className="text-[20px] leading-[1.4] text-ink-muted"
        placeholder="Text"
      />
    </li>
  );
}
