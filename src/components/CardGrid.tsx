import { ComponentProps, UniformSlot, UniformText } from "@uniformdev/canvas-react";
import { isOption } from "../uniform/params";

type CardGridProps = ComponentProps<{
  heading?: string;
  columns?: string;
}>;

// Keyed by the values of the `columns` select parameter.
const columnClass = {
  one: "",
  two: "sm:grid-cols-2",
  three: "sm:grid-cols-2 lg:grid-cols-3",
  four: "sm:grid-cols-2 lg:grid-cols-4",
};

/**
 * `cardGrid`: a heading over a `cards` slot. `columns` sets cards per row on
 * large screens (three when unset). Items stretch to the row height so card
 * buttons line up.
 */
export default function CardGrid({ columns }: CardGridProps) {
  const layout = isOption(columnClass, columns) ? columnClass[columns] : columnClass.three;

  return (
    <section className="bg-white py-12 md:py-20">
      <div className="site-container">
        <UniformText parameterId="heading" as="h2" className="h-section m-0 mb-10" placeholder="Heading" />

        <div className={`grid grid-cols-1 items-stretch gap-8 ${layout}`}>
          <UniformSlot name="cards" />
        </div>
      </div>
    </section>
  );
}
