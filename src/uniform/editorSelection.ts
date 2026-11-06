// Hooks that keep interactive components usable in Canvas edit mode: open
// whatever holds the selection (accordion item, carousel slide, mega menu) and
// pause autoplay and hover. Outside Canvas edit mode they are inert.

import { useEffect, useMemo, useRef } from "react";
import {
  createCanvasChannel,
  IS_RENDERED_BY_UNIFORM_ATTRIBUTE,
  walkNodeTree,
  type ComponentInstance,
} from "@uniformdev/canvas";
import { useUniformContextualEditingState } from "@uniformdev/canvas-react";

/**
 * Spread on the app's own controls (slide switcher, playground toolbar). In
 * Canvas edit mode a press selects a component, except on elements carrying
 * this attribute.
 */
export const uniformInteractive = { [IS_RENDERED_BY_UNIFORM_ATTRIBUTE]: true };

/** The `_id` of a component and of everything in its slots. */
function subtreeIds(node: ComponentInstance | undefined) {
  const ids = new Set<string>();
  if (node) {
    walkNodeTree(node, ({ node: current }) => {
      if ("_id" in current && current._id) ids.add(current._id);
    });
  }
  return ids;
}

// Ids of components inside a pattern may be `|`-joined paths on one side and
// the bare id on the other, so a match on the last segment counts too.
function idsMatch(a: string, b: string) {
  return a === b || a.endsWith(`|${b}`) || b.endsWith(`|${a}`);
}

/** True only in Canvas edit mode. Preview mode keeps live hover, click and autoplay. */
export function useIsCanvasEditor() {
  const { previewMode } = useUniformContextualEditingState({ global: true });
  return previewMode === "editor";
}

function useEditorSelection() {
  const { selectedComponentReference, previewMode } = useUniformContextualEditingState({
    global: true,
  });

  return {
    isEditing: previewMode === "editor",
    selectedId: selectedComponentReference?.id,
  };
}

/** Ask Canvas to select a component and move the preview highlighter onto it. */
export function useSelectInCanvas() {
  const isEditing = useIsCanvasEditor();
  const channel = useRef<ReturnType<typeof createCanvasChannel>>(undefined);

  useEffect(() => {
    if (!isEditing) return;
    const parent = window.opener ?? window.top;
    const broadcastTo = parent && parent !== window ? [parent, window] : [window];
    const current = createCanvasChannel({ broadcastTo, listenTo: [window] });
    channel.current = current;
    return () => {
      current.destroy();
      channel.current = undefined;
    };
  }, [isEditing]);

  return (id: string | undefined) => {
    if (id) channel.current?.selectComponent(id);
  };
}

/**
 * Whether the Canvas selection is this component or anything inside it.
 * `undefined` outside Canvas edit mode, so the component keeps its own interaction.
 */
export function useSelectionWithin(component?: ComponentInstance): boolean | undefined {
  const { isEditing, selectedId } = useEditorSelection();
  const ids = useMemo(() => subtreeIds(component), [component]);

  if (!isEditing) return undefined;

  return Boolean(selectedId && [...ids].some((id) => idsMatch(id, selectedId)));
}

/** The child that holds the Canvas selection, for a carousel or accordion. */
export function useSelectedBranch(children?: ComponentInstance[]): string | undefined {
  const { isEditing, selectedId } = useEditorSelection();

  return useMemo(() => {
    if (!isEditing || !selectedId) return undefined;

    return children?.find((child) => [...subtreeIds(child)].some((id) => idsMatch(id, selectedId)))?._id;
  }, [children, isEditing, selectedId]);
}
