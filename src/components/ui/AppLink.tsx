import Link from "next/link";
import type { AnchorHTMLAttributes, HTMLAttributes, ReactNode } from "react";
import type { LinkParamValue } from "@uniformdev/canvas";
import { linkParamValueToAnchorProps } from "@uniformdev/canvas-react";

type AppLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  /** A Uniform link parameter value. */
  link?: LinkParamValue;
  children?: ReactNode;
};

/**
 * Renders a Uniform link parameter with the SDK's `linkParamValueToAnchorProps`:
 * the `href` for every link type (`mailto:` and `tel:` included) plus any
 * attributes the author set, such as opening in a new tab.
 * https://docs.uniform.app/docs/sdk/parameter-utilities/link-parameters
 *
 * Internal paths go through `next/link`. Without a link the children render in
 * a plain `<span>`, so they stay visible and editable in Canvas.
 */
export default function AppLink({ link, children, className, ...rest }: AppLinkProps) {
  const { href, className: authoredClass, ...anchorProps } = linkParamValueToAnchorProps(link);
  const classes = [className, authoredClass].filter(Boolean).join(" ") || undefined;

  if (!href) {
    return (
      <span className={classes} {...(rest as HTMLAttributes<HTMLSpanElement>)}>
        {children}
      </span>
    );
  }

  const props = { ...rest, ...anchorProps, className: classes };
  const internal = href.startsWith("/") && !href.startsWith("//");
  return internal ? (
    <Link href={href} {...props}>
      {children}
    </Link>
  ) : (
    <a href={href} {...props}>
      {children}
    </a>
  );
}
