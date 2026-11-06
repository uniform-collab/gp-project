import { createContext, useCallback, useContext, useEffect, useRef, useState, type RefObject } from "react";
import { ComponentProps, UniformSlot, type UniformSlotWrapperComponentProps } from "@uniformdev/canvas-react";
import type { NumberParamValue } from "@uniformdev/canvas";
import { SlideIndexContext } from "./HeroSlide";
import { CanvasSlideSwitcher } from "./ui/CanvasSlideSwitcher";
import { useIsCanvasEditor, useSelectedBranch } from "../uniform/editorSelection";
import { toBoolean } from "../uniform/params";

type HeroCarouselProps = ComponentProps<{
  autoplay?: boolean | string;
  intervalSeconds?: NumberParamValue;
  /** `full` (default) bleeds edge to edge, `half` sits in `.site-container`. */
  width?: string;
}>;

/** One entry in the thumbnail rail, read from a rendered HeroSlide. */
interface Thumb {
  index: number;
  src?: string;
  label: string;
}

/** Passes carousel state down to the slot wrapper, which UniformSlot renders. */
const HeroTrackContext = createContext<{
  active: number;
  editMode: boolean;
  trackRef: RefObject<HTMLDivElement | null>;
}>({
  active: 0,
  editMode: false,
  trackRef: { current: null },
});

/**
 * Wrapper for the `slides` slot (UniformSlot's `wrapperComponent`).
 *
 * Outside Canvas edit mode the slides sit in a horizontal scroll-snap track. In
 * Canvas edit mode only the active slide is shown: Canvas draws its selection
 * outline and toolbox over the rendered element, and a scrolled slide would
 * leave that chrome behind.
 */
function HeroSlides({ items }: UniformSlotWrapperComponentProps) {
  const { active, editMode, trackRef } = useContext(HeroTrackContext);

  if (editMode) {
    return (
      <>
        {items.map((item, index) => (
          <div
            key={index}
            className={index === active ? "block" : "hidden"}
            aria-hidden={index !== active}
            inert={index !== active ? true : undefined}
          >
            {item}
          </div>
        ))}
      </>
    );
  }

  return (
    <div
      ref={trackRef}
      className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain scroll-smooth"
    >
      {items.map((item, index) => (
        <SlideIndexContext.Provider key={index} value={index}>
          {item}
        </SlideIndexContext.Provider>
      ))}
    </div>
  );
}

/**
 * `heroCarousel`: a `slides` slot of Hero Slides, with `width`, `autoplay` and
 * `intervalSeconds`.
 *
 * A CSS scroll-snap track rather than a transform slider, so the first slide
 * shows and swipe works before any JavaScript runs; JavaScript adds autoplay
 * and the thumbnail rail. Slot children are opaque React elements, so the rail
 * reads the `data-thumb` / `data-title` attributes each HeroSlide renders.
 *
 * Autoplay pauses in Canvas edit mode, under `prefers-reduced-motion`, and
 * while the pointer or focus is inside the carousel. In Canvas edit mode,
 * selecting a slide shows it, and CanvasSlideSwitcher adds a slide picker.
 */
export default function HeroCarousel({ autoplay, intervalSeconds, width, component }: HeroCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [thumbs, setThumbs] = useState<Thumb[]>([]);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  const slides = component?.slots?.slides;
  const editMode = useIsCanvasEditor();
  const selectedId = useSelectedBranch(slides);
  const contained = width === "half";

  // Runs after every render so slides inserted, removed or reordered in Canvas
  // stay reflected; the equality guard stops the state loop.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const next = Array.from(track.querySelectorAll<HTMLElement>("[data-hero-slide]")).map((node, index) => ({
      index,
      src: node.dataset.thumb || undefined,
      label: node.dataset.title || `Slide ${index + 1}`,
    }));

    setThumbs((prev) =>
      prev.length === next.length && prev.every((t, i) => t.src === next[i].src && t.label === next[i].label)
        ? prev
        : next,
    );
  });

  const goTo = useCallback((index: number) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollTo({ left: index * track.clientWidth, behavior: "smooth" });
  }, []);

  // Canvas selection → visible slide. `selectedId` is only set in Canvas edit
  // mode, where slides are shown and hidden rather than scrolled.
  useEffect(() => {
    if (!selectedId || !slides) return;
    const index = slides.findIndex((slide) => slide._id === selectedId);
    if (index >= 0) setActive(index);
  }, [selectedId, slides]);

  // Scroll position → active thumbnail. Depends on `editMode` because the
  // track only exists outside Canvas edit mode and is a new element when it
  // returns.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() =>
        setActive(Math.round(track.scrollLeft / Math.max(track.clientWidth, 1))),
      );
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      track.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [editMode]);

  const count = thumbs.length;
  // Off unless switched on, matching what Canvas shows for an unset checkbox.
  const running = toBoolean(autoplay, false) && !editMode && !paused && count > 1;
  const interval = Math.max(2, Number(intervalSeconds) || 7) * 1000;

  useEffect(() => {
    if (!running) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const id = setInterval(() => {
      const track = trackRef.current;
      if (!track) return;
      const current = Math.round(track.scrollLeft / Math.max(track.clientWidth, 1));
      goTo((current + 1) % count);
    }, interval);

    return () => clearInterval(id);
  }, [running, interval, count, goTo]);

  return (
    <section
      className={`relative ${contained ? "site-container" : ""}`}
      aria-roledescription="carousel"
      aria-label="Featured"
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <HeroTrackContext.Provider value={{ active, editMode, trackRef }}>
        <UniformSlot name="slides" wrapperComponent={HeroSlides} />
      </HeroTrackContext.Provider>

      <CanvasSlideSwitcher slides={slides} active={active} onSelect={setActive} />

      {count > 1 && !editMode ? (
        <div className="absolute inset-x-0 bottom-6 flex flex-wrap justify-center gap-3 px-6">
          {thumbs.map((thumb) => (
            <button
              key={thumb.index}
              type="button"
              onClick={() => goTo(thumb.index)}
              aria-label={`Show slide ${thumb.index + 1}: ${thumb.label}`}
              aria-current={thumb.index === active}
              className={`h-12 w-20 overflow-hidden border-2 transition-colors duration-200 md:h-16 md:w-28 ${
                thumb.index === active ? "border-sky" : "border-white/50 hover:border-white"
              }`}
            >
              {thumb.src ? (
                <img src={thumb.src} alt="" loading="lazy" className="size-full object-cover" />
              ) : (
                <span className="flex size-full items-center justify-center bg-navy-deep text-[13px] font-semibold text-white">
                  {thumb.index + 1}
                </span>
              )}
            </button>
          ))}
        </div>
      ) : null}
    </section>
  );
}
