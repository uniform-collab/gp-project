import type { LinkParamValue } from "@uniformdev/canvas";
import { ComponentProps, linkParamValueToAnchorProps } from "@uniformdev/canvas-react";
import { useIsCanvasEditor } from "../uniform/editorSelection";
import { isOption } from "../uniform/params";
import AppLink from "./ui/AppLink";
import { FacebookIcon, InstagramIcon, LinkedInIcon, XIcon, YouTubeIcon } from "./ui/socialIcons";

// Keyed by the values of the `platform` select parameter.
const platforms = {
  linkedin: { label: "LinkedIn", Icon: LinkedInIcon },
  x: { label: "X", Icon: XIcon },
  youtube: { label: "YouTube", Icon: YouTubeIcon },
  facebook: { label: "Facebook", Icon: FacebookIcon },
  instagram: { label: "Instagram", Icon: InstagramIcon },
} as const;

type SocialLinkProps = ComponentProps<{
  platform?: string;
  link?: LinkParamValue;
}>;

const className =
  "inline-flex size-8 items-center justify-center rounded-pill bg-link text-white transition-colors duration-200 hover:bg-sky";

/**
 * `socialLink`: a circular icon chip. `platform` picks the icon and the
 * link's accessible name.
 *
 * Renders only with a platform and a link. In Canvas edit mode an empty chip
 * shows until both are set, so it can be selected.
 */
export default function SocialLink({ platform, link }: SocialLinkProps) {
  const editMode = useIsCanvasEditor();
  const known = isOption(platforms, platform) ? platforms[platform] : undefined;

  if (!known || !linkParamValueToAnchorProps(link).href) {
    return editMode ? (
      <span className={className}>{known ? <known.Icon className="size-4" /> : null}</span>
    ) : null;
  }

  const { label, Icon } = known;

  return (
    <AppLink link={link} aria-label={label} className={className}>
      <Icon className="size-4" />
    </AppLink>
  );
}
