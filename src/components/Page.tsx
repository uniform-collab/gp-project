import { UniformSlot } from "@uniformdev/canvas-react";

/**
 * `page`: the composition root with `header`, `content` and `footer` slots.
 * Its `metaTitle` and `metaDescription` are rendered by PageHead.
 */
export default function Page() {
  return (
    <>
      <UniformSlot name="header" />
      <main>
        <UniformSlot name="content" />
      </main>
      <UniformSlot name="footer" />
    </>
  );
}
