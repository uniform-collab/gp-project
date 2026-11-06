import { UniformComposition, type UniformCompositionProps } from "@uniformdev/canvas-react";
import { resolveRenderer } from ".";

/**
 * Renders a composition. `behaviorTracking="onLoad"` scores enrichment tags on
 * mount, so tagged components get no wrapper `<div>`.
 */
export function Composition(props: Pick<UniformCompositionProps, "data" | "matchedRoute" | "dynamicInputs">) {
  return <UniformComposition {...props} behaviorTracking="onLoad" resolveRenderer={resolveRenderer} />;
}
