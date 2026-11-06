import type { UniformPlaygroundDecorator } from "@uniformdev/canvas-react";

const ON_NAVY = new Set(["footerColumn", "socialLink"]);

/**
 * Previews footer components on the navy they are styled for; on the
 * playground's light background they would be invisible. Everything else
 * renders as is.
 */
export const BackgroundPlaygroundDecorator: UniformPlaygroundDecorator = ({ children, data }) => {
  if (!ON_NAVY.has(data?.type ?? "")) return <>{children}</>;
  return <div className="rounded-lg bg-navy-deep p-6">{children}</div>;
};
