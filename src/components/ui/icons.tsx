import type { ReactNode } from "react";

// Inline SVG icons. All except CheckIcon are stroked with `currentColor`, so
// they take the text color of their parent: 1.6px for the user, list and cart
// outlines, 2px for the rest. Every icon is `aria-hidden`; the surrounding link
// or button supplies the accessible name.

interface IconProps {
  className?: string;
}

const strokeProps = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function Svg({ className = "", children }: IconProps & { children: ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" className={className}>
      {children}
    </svg>
  );
}

export function UserIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <circle cx="12" cy="8" r="3.4" {...strokeProps} />
      <path d="M4.8 20a7.2 7.2 0 0 1 14.4 0" {...strokeProps} />
    </Svg>
  );
}

export function ListIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M8.5 6.5h11M8.5 12h11M8.5 17.5h11M4.5 6.5h.01M4.5 12h.01M4.5 17.5h.01" {...strokeProps} />
    </Svg>
  );
}

export function CartIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M3 4h2.2l2.2 10.6h9.9L19.5 7H6.2" {...strokeProps} />
      <circle cx="9" cy="19" r="1.5" {...strokeProps} />
      <circle cx="17" cy="19" r="1.5" {...strokeProps} />
    </Svg>
  );
}

export function SearchIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <circle cx="10.5" cy="10.5" r="6" {...strokeProps} strokeWidth={2} />
      <path d="m15.2 15.2 4.3 4.3" {...strokeProps} strokeWidth={2} />
    </Svg>
  );
}

export function ChevronDownIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="m6 9.5 6 6 6-6" {...strokeProps} strokeWidth={2} />
    </Svg>
  );
}

export function PlusIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M12 5v14M5 12h14" {...strokeProps} strokeWidth={2} />
    </Svg>
  );
}

export function MinusIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M5 12h14" {...strokeProps} strokeWidth={2} />
    </Svg>
  );
}

export function MenuIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M4 7h16M4 12h16M4 17h16" {...strokeProps} strokeWidth={2} />
    </Svg>
  );
}

export function CloseIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="m6 6 12 12M18 6 6 18" {...strokeProps} strokeWidth={2} />
    </Svg>
  );
}

/**
 * Sky checkmark for Checklist rows. Filled, not stroked, and always
 * decorative: the text beside it carries the meaning.
 */
export function CheckIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" className={`fill-sky ${className}`.trim()}>
      <path d="M20.99 6.3a1.1 1.1 0 0 1 0 1.55l-9.2 9.3a1.1 1.1 0 0 1-1.56 0l-4.35-4.4a1.1 1.1 0 0 1 1.56-1.54l3.57 3.61 8.42-8.52a1.1 1.1 0 0 1 1.56 0Z" />
    </svg>
  );
}
