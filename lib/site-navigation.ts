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
  { label: "Home", href: "/", description: "Energy resilience for Ukraine." },
  { label: "Ukraine Energy Live", href: "/ukraine-energy", description: "System status, restrictions and sources." },
  { label: "My Home", href: "/my-home", description: "Your household energy readiness." },
  { label: "Energy AI", href: "/energy-ai", description: "Specialist backup-power guidance." },
  { label: "Energy Marketplace", href: "/marketplace", description: "Energy equipment catalogue." },
  { label: "Energy Map", href: "/energy-map", description: "Ukraine-focused public energy map." },
  { label: "For Business", href: "/business", description: "Business continuity and energy planning." },
  { label: "Backup Calculator", href: "/backup-calculator", description: "Size a household backup system." },
  { label: "Find Installer", href: "/installers", description: "Find energy installation specialists." },
  { label: "Buildings", href: "/buildings", description: "Building energy-resilience information." },
  { label: "Professionals", href: "/professionals", description: "Profiles and leads for energy specialists." },
  { label: "Calculators", href: "/calculators", description: "Engineering calculation tools." },
];

export const primaryNavItems = siteNavItems.slice(1, 7);
export const moreNavItems = siteNavItems.slice(7);

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
