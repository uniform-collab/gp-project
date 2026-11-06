import { useRef, useState, type KeyboardEvent, type PointerEvent, type ReactNode } from "react";
import type { UniformPlaygroundDecorator } from "@uniformdev/canvas-react";
import { uniformInteractive } from "../../uniform/editorSelection";
import { pressHandlers, useSessionChoice } from "./controls";

// Default width per resizable component type, in pixels.
const RESIZABLE: Record<string, number> = {
  articleCard: 1024,
  eventCard: 390,
  faqItem: 1024,
  checklist: 640,
  checklistItem: 640,
  button: 390,
  logo: 390,
  menuLink: 320,
  footerColumn: 320,
  socialLink: 320,
};

const PRESETS = [
  { width: 320, label: "Narrow" },
  { width: 390, label: "Card" },
  { width: 640, label: "Wide" },
  { width: 1024, label: "Row" },
];

const MIN = 280;
const MAX = 1440;
const clamp = (width: number) => Math.round(Math.min(MAX, Math.max(MIN, width)));
const isWidth = (value: string): value is `${number}` =>
  /^\d+$/.test(value) && Number(value) >= MIN && Number(value) <= MAX;

/**
 * Lets a component that lives in a column (a card, an FAQ item, a button) be
 * previewed at the widths it meets on a page: drag either edge of the frame,
 * use the arrow keys on an edge, or pick a preset.
 *
 * Other types (sections, the header and footer, mega menu items, menu columns,
 * utility links) render untouched. Their layout follows the browser window,
 * which a narrower frame cannot change; Canvas's viewport buttons do that.
 */
export const ResizablePlaygroundDecorator: UniformPlaygroundDecorator = ({ children, data }) => {
  const type = data?.type ?? "";
  const fallback = RESIZABLE[type];
  if (fallback === undefined) return <>{children}</>;
  return (
    <Stage type={type} fallback={fallback}>
      {children}
    </Stage>
  );
};

function Stage({ type, fallback, children }: { type: string; fallback: number; children: ReactNode }) {
  const [stored, setStored] = useSessionChoice<`${number}`>(
    `gp-playground-width:${type}`,
    isWidth,
    String(fallback) as `${number}`,
  );
  // While an edge is dragged the width lives here, and is saved on release.
  const [live, setLive] = useState<number | null>(null);
  const drag = useRef<{ startX: number; startWidth: number; side: 1 | -1 } | null>(null);

  const width = live ?? Number(stored);
  const commit = (next: number) => setStored(String(clamp(next)) as `${number}`);

  function onPointerDown(event: PointerEvent<HTMLDivElement>, side: 1 | -1) {
    if (event.button !== 0) return;
    event.preventDefault();
    event.stopPropagation();
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = { startX: event.clientX, startWidth: width, side };
    setLive(width);
  }

  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    if (!drag.current) return;
    // The frame stays centred, so each edge moves half of the width change.
    const delta = (event.clientX - drag.current.startX) * 2 * drag.current.side;
    setLive(clamp(drag.current.startWidth + delta));
  }

  function onPointerUp() {
    if (!drag.current) return;
    drag.current = null;
    if (live !== null) commit(live);
    setLive(null);
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>, side: 1 | -1) {
    const step = event.shiftKey ? 50 : 10;
    const grow = { ArrowRight: step * side, ArrowLeft: -step * side }[event.key];
    if (grow === undefined) return;
    event.preventDefault();
    commit(width + grow * 2);
  }

  const handle = (side: 1 | -1) => (
    <div
      role="slider"
      tabIndex={0}
      aria-label={side === 1 ? "Resize from the right edge" : "Resize from the left edge"}
      aria-orientation="horizontal"
      aria-valuemin={MIN}
      aria-valuemax={MAX}
      aria-valuenow={width}
      aria-valuetext={`${width} pixels`}
      onPointerDown={(event) => onPointerDown(event, side)}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onKeyDown={(event) => onKeyDown(event, side)}
      className={`group absolute inset-y-0 flex w-6 cursor-ew-resize touch-none items-center justify-center outline-none ${
        side === 1 ? "-right-6" : "-left-6"
      }`}
      {...uniformInteractive}
    >
      <span className="h-10 w-1 rounded-pill bg-ink-muted/40 transition-colors group-hover:bg-navy group-focus-visible:bg-navy" />
    </div>
  );

  return (
    <div
      className="min-h-screen bg-surface-grey/60 px-10 pb-16 pt-20 font-[system-ui]"
      style={{
        backgroundImage: "radial-gradient(rgb(0 0 0 / 0.07) 1px, transparent 1px)",
        backgroundSize: "16px 16px",
      }}
    >
      <div className="fixed inset-x-0 top-4 z-50 flex justify-center" {...uniformInteractive}>
        <div className="flex h-9 items-center gap-1 rounded-pill bg-white/85 p-1 shadow-menu ring-1 ring-line backdrop-blur-md">
          <output className="w-16 pl-3 text-[12px] font-semibold tabular-nums text-ink-strong">
            {width} px
          </output>
          {PRESETS.map((preset) => {
            const active = preset.width === width;
            return (
              <button
                key={preset.width}
                type="button"
                aria-pressed={active}
                title={`${preset.width} px`}
                {...pressHandlers(() => commit(preset.width))}
                className={`h-7 rounded-pill px-3 text-[12px] font-medium transition-colors ${
                  active ? "bg-surface-grey text-ink-strong" : "text-ink-muted hover:text-ink-strong"
                }`}
                {...uniformInteractive}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
      </div>

      <div
        className={`relative mx-auto max-w-full ${live === null ? "motion-safe:transition-[width] motion-safe:duration-200" : ""}`}
        style={{ width }}
      >
        {handle(-1)}
        <div className="font-sans">{children}</div>
        {handle(1)}
      </div>
    </div>
  );
}
