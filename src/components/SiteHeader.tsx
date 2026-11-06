import { useEffect, useRef, useState, type Ref } from "react";
import { imageFrom, type AssetParamValue } from "@uniformdev/assets";
import { flattenValues, type ComponentInstance, type LinkParamValue } from "@uniformdev/canvas";
import {
  ComponentProps,
  convertComponentToProps,
  linkParamValueToAnchorProps,
  UniformSlot,
} from "@uniformdev/canvas-react";
import { isOption } from "../uniform/params";
import { SearchIcon } from "./ui/icons";
import AppLink from "./ui/AppLink";
import MegaMenuShell from "./ui/MegaMenuShell";
import { UTILITY_ICONS } from "./UtilityLink";

type SiteHeaderProps = ComponentProps<{
  logo?: AssetParamValue;
  logoLink?: LinkParamValue;
  searchPlaceholder?: string;
  searchResultsPage?: LinkParamValue;
}>;

/**
 * `siteHeader`: the navy bar at the top of every page, with a `logo`, a
 * `logoLink`, a `searchPlaceholder`, a `searchResultsPage` (the page the search
 * form submits `?q=` to), and `navItems` (Mega Menu Items) and `utilityLinks`
 * (Utility Links) slots.
 *
 * SiteHeader holds no menu state. The `navItems` slot is rendered inside
 * MegaMenuShell, which owns which panel is open and the mobile drawer, and
 * shares that with each MegaMenuItem through React context.
 *
 * Panels hang below the bar and span its width, so the header is positioned
 * (their positioning context) and must not clip its overflow. On mobile it is
 * sticky, which also makes it that positioning context.
 *
 * Below `lg` the bar only has room for the cart, so the mobile drawer lists
 * the other utility links above its search form.
 */
export default function SiteHeader({
  logo,
  logoLink,
  searchPlaceholder,
  searchResultsPage,
  component,
}: SiteHeaderProps) {
  const logoAsset = logo?.[0];
  const logoImage = flattenValues(logo, { toSingle: true });
  const searchAction = linkParamValueToAnchorProps(searchResultsPage).href;
  const placeholder = searchPlaceholder?.trim() || "Search";

  const logoMark =
    logoAsset && logoImage?.url ? (
      <img
        src={imageFrom(logoAsset).transform({ height: 128, fit: "contain" }).url()}
        alt={logoImage.description ?? ""}
        className="h-10 w-auto lg:h-16"
      />
    ) : null;

  return (
    // Sticky on mobile so the menu button stays in reach.
    <header className="sticky top-0 z-40 bg-navy-header lg:relative lg:z-auto">
      <div className="flex h-16 items-center gap-4 px-6 lg:h-[88px] lg:gap-10 lg:px-8">
        {logoMark ? (
          <AppLink link={logoLink} className="shrink-0">
            {logoMark}
            {/* A logo without alt text would leave the link with no name. */}
            {logoImage?.description ? null : <span className="sr-only">Home</span>}
          </AppLink>
        ) : null}

        <MegaMenuShell
          drawerFooter={
            <>
              <DrawerUtilityLinks links={component?.slots?.utilityLinks} />
              <SearchForm
                id="site-search-drawer"
                action={searchAction}
                placeholder={placeholder}
                // The drawer is white, so this pill needs a border to be seen.
                className="flex h-10 items-center gap-2 rounded-pill border border-line bg-white px-4"
                inputClassName="w-full min-w-0 bg-transparent text-[15px] text-ink-strong outline-none placeholder:text-ink-muted xl:w-48"
              />
            </>
          }
        >
          <UniformSlot name="navItems" />
        </MegaMenuShell>

        {/* From `lg`: a two-row grid flowing in columns; children set their own
            `order` (see UtilityLink). */}
        <div className="ml-auto flex items-center gap-1 lg:grid lg:grid-flow-col lg:grid-rows-2 lg:gap-x-3 xl:gap-x-5">
          <UniformSlot name="utilityLinks" />
          <HeaderSearch action={searchAction} placeholder={placeholder} />
        </div>
      </div>
    </header>
  );
}

/**
 * The utility links (except the cart, which stays on the bar) as a plain list
 * for the mobile drawer.
 *
 * They are read from the slot's data rather than rendered with a second
 * <UniformSlot>: two copies of the same components would confuse Canvas
 * selection. Authors edit them in the bar at desktop width; the list here
 * follows those edits. Only Utility Link children are read.
 */
function DrawerUtilityLinks({ links }: { links?: ComponentInstance[] }) {
  const items = (links ?? []).flatMap((link) => {
    if (link.type !== "utilityLink") return [];
    const props = convertComponentToProps<{ icon?: string; label?: string; link?: LinkParamValue }>(link);
    const label = props.label?.trim();
    if (props.icon === "cart" || !label) return [];
    const Icon = isOption(UTILITY_ICONS, props.icon) ? UTILITY_ICONS[props.icon] : null;
    return [{ key: link._id ?? label, label, link: props.link, Icon }];
  });
  if (!items.length) return null;

  const className =
    "inline-flex items-center gap-2 text-[15px] leading-tight text-ink-strong hover:underline";
  return (
    <ul className="m-0 mb-6 flex list-none flex-col gap-4 p-0">
      {items.map(({ key, label, link, Icon }) => {
        const content = (
          <>
            {Icon ? <Icon className="size-[18px] shrink-0 text-navy" /> : null}
            {label}
          </>
        );
        return (
          <li key={key}>
            <AppLink link={link} className={className}>
              {content}
            </AppLink>
          </li>
        );
      })}
    </ul>
  );
}

/**
 * Desktop search. From `xl` there is room for the inline field. Between `lg`
 * and `xl` it is a magnifying-glass button that opens the field in a small
 * popover, which closes on Escape or a click outside it.
 */
function HeaderSearch({ action, placeholder }: { action?: string; placeholder: string }) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const field = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    field.current?.focus();
    function onPointer(event: MouseEvent) {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <div ref={root} className="relative order-2 hidden lg:row-span-2 lg:block xl:hidden">
        <button
          type="button"
          className="inline-flex size-9 items-center justify-center text-white"
          aria-label="Search"
          aria-expanded={open}
          onClick={() => setOpen((current) => !current)}
        >
          <SearchIcon className="size-[18px]" />
        </button>
        {open ? (
          <SearchForm
            id="site-search-popover"
            action={action}
            placeholder={placeholder}
            inputRef={field}
            className="absolute right-0 top-full z-50 mt-2 flex w-64 items-center gap-2 rounded-md bg-white px-3 py-2 shadow-menu"
            inputClassName="w-full min-w-0 bg-transparent text-[15px] text-ink-strong outline-none placeholder:text-ink-muted"
          />
        ) : null}
      </div>
      <div className="order-2 hidden xl:row-span-2 xl:block">
        <SearchForm
          id="site-search-desktop"
          action={action}
          placeholder={placeholder}
          className="flex h-8 items-center gap-2 rounded-pill bg-white px-4"
          inputClassName="w-48 min-w-0 bg-transparent text-[15px] text-ink-strong outline-none placeholder:text-ink-muted"
        />
      </div>
    </>
  );
}

interface SearchFormProps {
  /** Must be unique on the page: the header renders up to three of these. */
  id: string;
  action?: string;
  placeholder: string;
  className: string;
  inputClassName: string;
  inputRef?: Ref<HTMLInputElement>;
}

function SearchForm({ id, action, placeholder, className, inputClassName, inputRef }: SearchFormProps) {
  return (
    <form role="search" action={action} method="get" className={className}>
      <label htmlFor={id} className="sr-only">
        Search
      </label>
      <SearchIcon className="size-[18px] shrink-0 text-sky" />
      <input
        ref={inputRef}
        id={id}
        name="q"
        type="search"
        placeholder={placeholder}
        className={inputClassName}
      />
    </form>
  );
}
