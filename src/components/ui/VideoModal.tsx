import { useEffect, useRef, useState } from "react";
import PlayButton from "./PlayButton";
import { CloseIcon } from "./icons";

interface VideoModalProps {
  /** Video URL: a YouTube or Vimeo page link, or an embed URL. */
  url: string;
  /** Accessible name for the trigger and the dialog. */
  label?: string;
}

/**
 * YouTube and Vimeo refuse to load their normal watch pages in an iframe, so a
 * pasted page link is turned into the matching embed URL (autoplaying, since
 * the visitor just pressed play). Anything else is used as-is.
 */
function toEmbedUrl(url: string): string {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\.|^m\./, "");
    let youtubeId: string | null = null;
    if (host === "youtube.com") {
      youtubeId =
        parsed.searchParams.get("v") ?? parsed.pathname.match(/^\/(?:shorts|live)\/([^/]+)/)?.[1] ?? null;
    } else if (host === "youtu.be") {
      youtubeId = parsed.pathname.slice(1) || null;
    }
    if (youtubeId) return `https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0`;

    const vimeoId = host === "vimeo.com" ? parsed.pathname.match(/^\/(\d+)/)?.[1] : undefined;
    if (vimeoId) return `https://player.vimeo.com/video/${vimeoId}?autoplay=1`;
  } catch {
    // Not an absolute URL; fall through and use it unchanged.
  }
  return url;
}

/**
 * Play button that opens a video in a native modal `<dialog>`. Not a Uniform
 * component; SplitMedia renders it when its `videoUrl` param is set.
 *
 * `showModal()` makes the rest of the page inert, closes on Escape, renders in
 * the top layer, and returns focus to the play button on close. The iframe
 * mounts only while open, so nothing loads or plays behind the page.
 */
export default function VideoModal({ url, label = "Play video" }: VideoModalProps) {
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <>
      <PlayButton label={label} onClick={() => setOpen(true)} />

      <dialog
        ref={dialogRef}
        aria-label={label}
        onClose={() => setOpen(false)}
        // Clicking the backdrop (the dialog element itself) closes it.
        onClick={(event) => {
          if (event.target === dialogRef.current) setOpen(false);
        }}
        // m-auto: Tailwind's base styles zero every margin, which removes the
        // browser's centring of a modal dialog. overflow-visible: browsers give
        // a modal dialog `overflow: auto`, which would clip the close button
        // that sits above the video.
        className="m-auto w-[min(90vw,64rem)] overflow-visible bg-transparent p-0 backdrop:bg-navy-deep/80"
      >
        <div className="relative">
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close video"
            className="absolute -top-12 right-0 inline-flex size-10 items-center justify-center rounded-pill bg-white text-navy hover:bg-surface-grey"
          >
            <CloseIcon className="size-5" />
          </button>
          {open ? (
            <iframe
              src={toEmbedUrl(url)}
              title={label}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="aspect-video w-full border-0 bg-black"
            />
          ) : null}
        </div>
      </dialog>
    </>
  );
}
