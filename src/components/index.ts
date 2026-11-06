// Uniform component type (the definition's public ID) → React component.
// An unmapped type renders Uniform's "Unknown Component" placeholder.

import { createComponentStore, createComponentStoreResolver } from "@uniformdev/canvas-react";
import Page from "./Page";
import Hero from "./Hero";
import Checklist from "./Checklist";
import ChecklistItem from "./ChecklistItem";
import Button from "./Button";
import MenuLink from "./MenuLink";
import MenuColumn from "./MenuColumn";
import MenuFeatured from "./MenuFeatured";
import MegaMenuItem from "./MegaMenuItem";
import UtilityLink from "./UtilityLink";
import SiteHeader from "./SiteHeader";
import SocialLink from "./SocialLink";
import FooterColumn from "./FooterColumn";
import SiteFooter from "./SiteFooter";
import HeroSlide from "./HeroSlide";
import HeroCarousel from "./HeroCarousel";
import SplitMedia from "./SplitMedia";
import SectionIntro from "./SectionIntro";
import Logo from "./Logo";
import LogoGrid from "./LogoGrid";
import FaqItem from "./FaqItem";
import FaqAccordion from "./FaqAccordion";
import CtaBanner from "./CtaBanner";
import RichTextBlock from "./RichTextBlock";
import EventCard from "./EventCard";
import ArticleCard from "./ArticleCard";
import CardGrid from "./CardGrid";

const components = {
  hero: Hero,
  page: Page,
  checklist: Checklist,
  checklistItem: ChecklistItem,
  button: Button,
  menuLink: MenuLink,
  menuColumn: MenuColumn,
  menuFeatured: MenuFeatured,
  megaMenuItem: MegaMenuItem,
  utilityLink: UtilityLink,
  siteHeader: SiteHeader,
  socialLink: SocialLink,
  footerColumn: FooterColumn,
  siteFooter: SiteFooter,
  heroSlide: HeroSlide,
  heroCarousel: HeroCarousel,
  splitMedia: SplitMedia,
  sectionIntro: SectionIntro,
  logo: Logo,
  logoGrid: LogoGrid,
  faqItem: FaqItem,
  faqAccordion: FaqAccordion,
  ctaBanner: CtaBanner,
  richTextBlock: RichTextBlock,
  eventCard: EventCard,
  articleCard: ArticleCard,
  cardGrid: CardGrid,
};

const store = createComponentStore();
for (const [type, component] of Object.entries(components)) store.register({ type, component });

export const resolveRenderer = createComponentStoreResolver({ store });
