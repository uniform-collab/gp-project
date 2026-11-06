import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/router";
import { useIsCanvasEditor } from "../../uniform/editorSelection";
import { DESKTOP_QUERY, useMediaQuery } from "./useMediaQuery";
import { CloseIcon, MenuIcon } from "./icons";

/**
 * What MegaMenuShell shares with the Mega Menu Items in the `navItems` slot. Slot
 * children are rendered by Uniform, not by the shell, so context is how they
 * reach the shared state.
 */
interface MegaMenuContextValue {
  /** The `useId()` of the item whose panel is open, or null. */
  openId: string | null;
  /** Click on a trigger: open that panel, or close it if it is already open. */
  toggle: (id: string) => void;
  /** Mouse entered or left an item. Delayed, and ignored in Canvas edit mode. */
  hoverOpen: (id: string) => void;
  hoverClose: () => void;
  /** Open the mobile drawer, used when the Canvas selection moves into an item. */
  openDrawer: () => void;
}

const noop = () => {};

// A nav item rendered outside a header (for example a pattern preview on the
// playground page) gets these inert defaults.
const MegaMenuContext = createContext<MegaMenuContextValue>({
  openId: null,
  toggle: noop,
  hoverOpen: noop,
  hoverClose: noop,
  openDrawer: noop,
});

export function useMegaMenu(): MegaMenuContextValue {
  return useContext(MegaMenuContext);
}

// Asymmetric hover intent: slow to open so a pointer crossing the bar does not
// flash panels, slower to close so a diagonal move to the panel survives.
const OPEN_DELAY = 150;
const CLOSE_DELAY = 250;

interface MegaMenuShellProps {
  /** The `navItems` slot output. */
  children: ReactNode;
  /** Shown under the nav items in the mobile drawer only (utility links, search). */
  drawerFooter?: ReactNode;
}

/**
 * Menu state for the header: which mega menu panel is open, the hover-intent
 * timers and the mobile drawer. SiteHeader renders it around the `navItems`
 * slot.
 *
 * Below `lg` the nav list sits in a drawer toggled by the hamburger button.
 * From `lg` the same list is the inline nav and the hamburger is hidden. Either
 * way, Escape, a click or focus outside the menu, and a completed route change
 * close what is open.
 *
 * In Canvas edit mode hover is ignored: a panel that opens and closes as the
 * author moves the pointer would make its contents impossible to select. The
 * open panel follows the Canvas selection instead (see MegaMenuItem). Preview
 * mode keeps normal hover. Edit vs preview mode:
 * https://docs.uniform.app/docs/guides/composition/visual-editing
 */
export default function MegaMenuShell({ children, drawerFooter }: MegaMenuShellProps) {
  const [openId, setOpenId] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const openTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const drawerId = useId();
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const editMode = useIsCanvasEditor();
  const isDesktop = useMediaQuery(DESKTOP_QUERY);

  const clearTimers = useCallback(() => {
    clearTimeout(openTimer.current);
    clearTimeout(closeTimer.current);
  }, []);

  const close = useCallback(() => {
    clearTimers();
    setOpenId(null);
  }, [clearTimers]);

  const toggle = useCallback(
    (id: string) => {
      clearTimers();
      setOpenId((current) => (current === id ? null : id));
    },
    [clearTimers],
  );

  const hoverOpen = useCallback(
    (id: string) => {
      if (editMode) return;
      clearTimers();
      openTimer.current = setTimeout(() => setOpenId(id), OPEN_DELAY);
    },
    [clearTimers, editMode],
  );

  const openDrawer = useCallback(() => setDrawerOpen(true), []);

  const hoverClose = useCallback(() => {
    if (editMode) return;
    clearTimers();
    closeTimer.current = setTimeout(() => setOpenId(null), CLOSE_DELAY);
  }, [clearTimers, editMode]);

  // Cancel a pending hover timer on unmount.
  useEffect(() => clearTimers, [clearTimers]);

  // Links navigate on the client (next/link), which does not necessarily
  // remount the header and reset its state. Close the open panel and the
  // drawer once a navigation completes.
  const router = useRouter();
  useEffect(() => {
    function onNavigate() {
      close();
      setDrawerOpen(false);
    }
    router.events.on("routeChangeComplete", onNavigate);
    return () => router.events.off("routeChangeComplete", onNavigate);
  }, [close, router.events]);

  // Growing the window past the breakpoint turns the drawer into the bar, so
  // drop the drawer state rather than leave it open behind the scenes.
  useEffect(() => {
    if (isDesktop) setDrawerOpen(false);
  }, [isDesktop]);

  // While the mobile drawer is open it covers the page, so the page behind it
  // must not scroll. Not in Canvas edit mode, where authors scroll the page.
  useEffect(() => {
    if (!drawerOpen || isDesktop || editMode) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [drawerOpen, isDesktop, editMode]);

  // Escape closes the open panel first, then the drawer, and moves focus to the
  // control that opened it so keyboard users are not left on a hidden element.
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      if (openId) {
        document.querySelector<HTMLElement>(`[aria-controls="${CSS.escape(`${openId}-panel`)}"]`)?.focus();
        close();
      } else if (drawerOpen) {
        setDrawerOpen(false);
        menuButtonRef.current?.focus();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [close, drawerOpen, openId]);

  // A pointer or keyboard focus landing outside the menu closes everything.
  useEffect(() => {
    if (!openId && !drawerOpen) return;
    function onOutside(event: Event) {
      const target = event.target as Node | null;
      if (target && rootRef.current && !rootRef.current.contains(target)) {
        close();
        setDrawerOpen(false);
      }
    }
    document.addEventListener("pointerdown", onOutside);
    document.addEventListener("focusin", onOutside);
    return () => {
      document.removeEventListener("pointerdown", onOutside);
      document.removeEventListener("focusin", onOutside);
    };
  }, [close, drawerOpen, openId]);

  const value = useMemo<MegaMenuContextValue>(
    () => ({ openId, toggle, hoverOpen, hoverClose, openDrawer }),
    [hoverClose, hoverOpen, openDrawer, openId, toggle],
  );

  return (
    <MegaMenuContext.Provider value={value}>
      {/* `contents` keeps these elements as direct flex children of the header
          row while still giving the outside-click handler a single root to
          test against. */}
      <div ref={rootRef} className="contents">
        <button
          ref={menuButtonRef}
          type="button"
          aria-expanded={drawerOpen}
          aria-controls={drawerId}
          aria-label={drawerOpen ? "Close menu" : "Open menu"}
          onClick={() => setDrawerOpen((open) => !open)}
          // `order-last` keeps the hamburger at the far right of the mobile bar
          // even though the utility cluster follows it in the DOM.
          className="order-last inline-flex size-11 items-center justify-center rounded-sm text-white lg:hidden"
        >
          {drawerOpen ? <CloseIcon className="size-6" /> : <MenuIcon className="size-6" />}
        </button>

        <div
          id={drawerId}
          className={`${
            drawerOpen ? "block" : "hidden"
          } absolute inset-x-0 top-full z-50 h-[calc(100dvh-4rem)] overflow-y-auto overscroll-contain bg-white shadow-menu lg:static lg:z-auto lg:block lg:h-full lg:min-w-0 lg:flex-1 lg:overflow-visible lg:bg-transparent lg:shadow-none`}
        >
          <nav aria-label="Main" className="lg:h-full">
            <ul className="m-0 flex list-none flex-col p-0 lg:h-full lg:flex-row lg:items-stretch lg:gap-6 xl:gap-10">
              {children}
            </ul>
          </nav>
          {drawerFooter ? <div className="border-t border-line p-6 lg:hidden">{drawerFooter}</div> : null}
        </div>
      </div>
    </MegaMenuContext.Provider>
  );
}
