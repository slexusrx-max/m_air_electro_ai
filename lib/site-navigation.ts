export type SiteNavItem = {
  description: string;
  href: string;
  label: string;
};

export type FooterNavGroup = {
  items: SiteNavItem[];
  title: string;
};

export type CalculatorItem = {
  description: string;
  href: string;
  label: string;
  status: "available";
};

export const siteNavItems: SiteNavItem[] = [
  {
    label: "AI Assistant",
    href: "/assistant",
    description: "Electrical AI assistant for technical Q&A and guidance.",
  },
  {
    label: "Diagnostics",
    href: "/diagnostics",
    description: "Step-by-step electrical fault diagnostics.",
  },
  {
    label: "Calculators",
    href: "/calculators",
    description: "Engineering calculators for electrical work.",
  },
  {
    label: "Marketplace",
    href: "/marketplace",
    description: "Verified experts, protected services, and trusted parts exchange.",
  },
  {
    label: "Experts",
    href: "/experts",
    description: "Verified expert tracks for residential, industrial, and marine work.",
  },
  {
    label: "Knowledge Base",
    href: "/knowledge-base",
    description: "Technical articles, playbooks, and reusable electrical guidance.",
  },
];

export const calculatorItems: CalculatorItem[] = [
  {
    label: "Cable sizing",
    href: "/calculators/cable-sizing",
    description: "Estimate conductor size using load current, ampacity, and voltage drop.",
    status: "available",
  },
  {
    label: "Voltage drop",
    href: "/calculators/voltage-drop",
    description: "Check voltage drop for feeders, branches, and long cable runs.",
    status: "available",
  },
  {
    label: "Motor current",
    href: "/calculators/motor-current",
    description: "Estimate motor current for single-phase and three-phase loads.",
    status: "available",
  },
  {
    label: "Transformer",
    href: "/calculators/transformer",
    description: "Estimate transformer current, loading, and primary-secondary demand.",
    status: "available",
  },
  {
    label: "Battery",
    href: "/calculators/battery",
    description: "Estimate battery-bank capacity and backup runtime requirements.",
    status: "available",
  },
  {
    label: "Generator",
    href: "/calculators/generator",
    description: "Estimate generator sizing for steady load, surge, and operating reserve.",
    status: "available",
  },
  {
    label: "Breaker selection",
    href: "/calculators/breaker-selection",
    description: "Select a preliminary breaker rating using design current and duty assumptions.",
    status: "available",
  },
  {
    label: "Fuse selection",
    href: "/calculators/fuse-selection",
    description: "Select a preliminary fuse rating and application family for common loads.",
    status: "available",
  },
];

export const footerNavGroups: FooterNavGroup[] = [
  {
    title: "Platform",
    items: [
      { label: "AI Assistant", href: "/assistant", description: "AI assistance for electrical reasoning." },
      { label: "Diagnostics", href: "/diagnostics", description: "Structured troubleshooting workflows." },
      { label: "Documents AI", href: "/documents", description: "Manual, PDF, and schematic analysis." },
      { label: "Calculators", href: "/calculators", description: "Deterministic engineering tools." },
    ],
  },
  {
    title: "Marketplace",
    items: [
      { label: "Marketplace", href: "/marketplace", description: "Protected services and verified parts." },
      { label: "Experts", href: "/experts", description: "Verified expert profiles and specializations." },
      { label: "Knowledge Base", href: "/knowledge-base", description: "Articles and operating guidance." },
      { label: "Contact", href: "/contact", description: "Commercial, pilot, and support contact." },
    ],
  },
  {
    title: "Company",
    items: [
      { label: "About", href: "/about", description: "Positioning, focus, and product direction." },
      { label: "Privacy Policy", href: "/privacy", description: "Privacy and data handling." },
      { label: "Terms", href: "/terms", description: "Terms of use and marketplace rules." },
      { label: "Sign In", href: "/sign-in", description: "Access architecture and future auth flows." },
    ],
  },
];
