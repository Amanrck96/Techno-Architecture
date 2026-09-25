export interface NavItem {
  label: string;
  href: string;
  badge?: string;
}

export const primaryNavigation: NavItem[] = [
  { label: "HOME", href: "/home" },
  { label: "ABOUT", href: "/about" },
  { label: "SERVICES", href: "/services" },
  { label: "PROJECTS", href: "/projects" },
  { label: "TEAM", href: "/team" },
  { label: "CAREERS", href: "/careers" },
  { label: "FAQ", href: "/faq" },
  { label: "GALLERY", href: "/gallery" },
  { label: "RECOGNITIONS", href: "/recognitions" },
  { label: "CONTACT", href: "/contact" },
];
