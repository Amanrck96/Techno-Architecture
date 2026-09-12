export interface NavItem {
  label: string;
  href: string;
  badge?: string;
}

export const primaryNavigation: NavItem[] = [
  { label: "HOME", href: "/home" },
  { label: "PROJECTS", href: "/projects" },
  { label: "ABOUT", href: "/about" },
  { label: "SERVICES", href: "/services" },
  { label: "OUR TEAM", href: "/team" },
  { label: "GALLERY", href: "/gallery" },
  { label: "BLOG", href: "/blog" },
  { label: "FAQ", href: "/faq" },
  { label: "RECOGNITIONS", href: "/recognitions" },
  { label: "CONTACT", href: "/contact" },
];
