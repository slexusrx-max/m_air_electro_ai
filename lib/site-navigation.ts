import { navigation } from '@/lib/marketplace/navigation';
export type SiteNavItem = { description: string; href: string; label: string };
export type FooterNavGroup = { items: SiteNavItem[]; title: string };
export type CalculatorItem = SiteNavItem & { status: 'available' };
export const siteNavItems: SiteNavItem[] = navigation('en').map(g=>({label:g.label,href:g.href,description:'Equipment discovery and planning for Romania / EU.'}));
export const primaryNavItems=siteNavItems;
export const moreNavItems:SiteNavItem[]=[{label:'About',href:'/about',description:'Independent energy equipment discovery.'}];
export const marketplaceNavItems:SiteNavItem[]=navigation('en')[0].children.map(g=>({label:g.label,href:g.href,description:'Explore requirements and equipment.'}));
export const calculatorItems: CalculatorItem[] = [
  {label:"Solar sizing",href:"/calculators/solar",description:"Size PV from daily energy and seasonal yield.",status:"available"},
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

export const footerNavGroups:FooterNavGroup[]=navigation('en').slice(0,4).map(g=>({title:g.label,items:g.children.map(i=>({label:i.label,href:i.href,description:''}))}));
