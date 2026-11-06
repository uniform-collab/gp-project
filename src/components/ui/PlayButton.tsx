interface PlayButtonProps {
  onClick?: () => void;
  /** Accessible name. Defaults to "Play video". */
  label?: string;
  className?: string;
}

/**
 * Trigger for VideoModal (not a Uniform component). Usually overlaid on media,
 * so it carries `shadow-card` to stay legible against a photograph. The
 * triangle is decorative; the accessible name comes from `aria-label`.
 */
export default function PlayButton({ onClick, label = "Play video", className = "" }: PlayButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`inline-flex size-[88px] items-center justify-center rounded-pill bg-sky shadow-card transition-transform duration-200 hover:scale-105 ${className}`.trim()}
    >
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        focusable="false"
        // Nudged right so the triangle reads optically centered in the circle.
        className="ml-1 size-8 fill-white"
      >
        <path d="M8 5.2v13.6a1 1 0 0 0 1.53.85l10.9-6.8a1 1 0 0 0 0-1.7L9.53 4.35A1 1 0 0 0 8 5.2Z" />
      </svg>
    </button>
  );
}
