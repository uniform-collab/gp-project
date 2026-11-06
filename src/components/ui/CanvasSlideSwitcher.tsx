import type { ComponentInstance } from "@uniformdev/canvas";
import { convertComponentToProps } from "@uniformdev/canvas-react";
import { flushSync } from "react-dom";
import { uniformInteractive, useIsCanvasEditor, useSelectInCanvas } from "../../uniform/editorSelection";

/**
 * Slide picker for HeroCarousel in Canvas edit mode. Renders nothing outside
 * Canvas edit mode or with fewer than two slides.
 *
 * Only the active slide is visible in Canvas edit mode, so authors need a way
 * to reach the others from the preview. `uniformInteractive` keeps the buttons
 * clickable; they act on pointerdown and stop it there, so the press does not
 * also select the carousel behind them.
 * `flushSync` shows the new slide before `selectInCanvas` asks Canvas to select
 * it, so the highlighter lands on a visible element.
 */
export function CanvasSlideSwitcher({
  slides,
  active,
  onSelect,
}: {
  slides: ComponentInstance[] | undefined;
  active: number;
  onSelect: (index: number) => void;
}) {
  const isEditing = useIsCanvasEditor();
  const selectInCanvas = useSelectInCanvas();
  const items = slides ?? [];

  if (!isEditing || items.length < 2) return null;

  return (
    <div
      role="toolbar"
      aria-label="Slides"
      className="pointer-events-auto absolute bottom-10 left-1/2 z-30 flex -translate-x-1/2 items-center gap-0.5 rounded-sm bg-navy-deep px-2 py-1 text-white shadow-menu"
      {...uniformInteractive}
      // A press on the toolbar's padding should not select the carousel behind it.
      onPointerDown={(event) => event.stopPropagation()}
    >
      <span className="px-1.5 text-[10px] font-medium tracking-[0.16em] text-white/55">SLIDES</span>
      {items.map((slide, index) => {
        const title = slideTitle(slide, index);
        const current = index === active;

        return (
          <button
            key={slide._id ?? index}
            type="button"
            title={title}
            aria-label={title}
            aria-current={current ? "true" : undefined}
            {...uniformInteractive}
            onPointerDownCapture={(event) => {
              if (event.button !== 0) return;
              event.preventDefault();
              event.stopPropagation();
              flushSync(() => {
                onSelect(index);
              });
              selectInCanvas(slide._id);
            }}
            className={`min-w-7 px-1.5 py-1 text-[11px] tabular-nums ${
              current ? "bg-white text-navy-deep" : "text-white/80 hover:bg-white/10"
            }`}
          >
            {index + 1}
          </button>
        );
      })}
    </div>
  );
}

/** The slide's `title` param, for the button tooltip. */
function slideTitle(slide: ComponentInstance, index: number) {
  const { title } = convertComponentToProps<{ title?: string }>(slide);
  return title?.trim() || `Slide ${index + 1}`;
}
