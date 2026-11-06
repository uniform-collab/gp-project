import { createContext, useContext, useState } from "react";
import { ComponentProps, UniformSlot, UniformText } from "@uniformdev/canvas-react";
import { useSelectedBranch } from "../uniform/editorSelection";

type FaqAccordionProps = ComponentProps<{
  heading?: string;
}>;

interface FaqContextValue {
  /** `_id` of the open FAQ Item, or null when every item is closed. */
  openId: string | null;
  toggle: (id: string) => void;
}

const FaqContext = createContext<FaqContextValue | null>(null);

/** The accordion's state, or null for an FAQ Item rendered on its own (a pattern preview). */
export function useFaq(): FaqContextValue | null {
  return useContext(FaqContext);
}

/**
 * `faqAccordion`: a `heading`, an `items` slot of FAQ Items and a `cta` slot.
 * One item is open at a time, and the first starts open. `items` may hold a
 * `$loop` over FAQ entries, which Uniform expands into one FAQ Item per entry.
 *
 * The open item is tracked here and shared through context, because each FAQ
 * Item is rendered by `UniformSlot` and cannot see its siblings. In Canvas edit
 * mode, selecting an item or anything inside it opens it, so closed answers
 * can be edited.
 */
export default function FaqAccordion({ component }: FaqAccordionProps) {
  const items = component?.slots?.items;
  const selectedId = useSelectedBranch(items);
  const [openId, setOpenId] = useState<string | null>(items?.[0]?._id ?? null);

  return (
    <FaqContext.Provider
      value={{
        // In Canvas edit mode the selected item is the open one.
        openId: selectedId ?? openId,
        toggle: (id) => setOpenId((current) => (current === id ? null : id)),
      }}
    >
      <section className="bg-white py-12 md:py-20">
        <div className="site-container">
          <UniformText
            parameterId="heading"
            as="h2"
            className="h-section m-0 mb-8 text-left!"
            placeholder="Heading"
          />

          <div className="border-t border-line">
            <UniformSlot name="items" />
          </div>

          <div className="mt-10 flex flex-wrap gap-4 empty:mt-0">
            <UniformSlot name="cta" />
          </div>
        </div>
      </section>
    </FaqContext.Provider>
  );
}
