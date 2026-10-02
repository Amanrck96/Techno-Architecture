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
  { label: "TEAM", href: "/about#team" },
  { label: "CAREERS", href: "/careers" },
  { label: "CONTACT", href: "/contact" },
  { label: "FAQ", href: "/faq" },
  { label: "GALLERY", href: "/gallery" },
  { label: "RECOGNITIONS", href: "/recognitions" },
];
