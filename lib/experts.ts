export type ExpertProfile = {
  audience: string[];
  description: string;
  premium: boolean;
  regions: string[];
  responseWindow: string;
  serviceModes: string[];
  signals: string[];
  slug: string;
  title: string;
  useCases: string[];
};

export const expertProfiles: ExpertProfile[] = [
  {
    slug: "residential-diagnostics-specialist",
    title: "Residential Diagnostics Specialist",
    description:
      "High-trust support for US residential troubleshooting, panel issues, branch circuits, EV chargers, generators, and hard-to-trace intermittent faults.",
    audience: ["Home users", "Property owners", "Electrical contractors"],
    serviceModes: ["Remote diagnosis", "Job scope review", "Safety triage"],
    responseWindow: "Same day for pilot users",
    regions: ["United States"],
    premium: false,
    signals: [
      "Panel and branch-circuit troubleshooting experience",
      "Load calculations and protection review",
      "Customer-safe communication and escalation paths",
    ],
    useCases: [
      "Breaker trips and nuisance shutdowns",
      "Outlet, switch, and lighting faults",
      "Generator and transfer-related issues",
      "EV charger installation review",
    ],
  },
  {
    slug: "industrial-controls-and-drives-engineer",
    title: "Industrial Controls and Drives Engineer",
    description:
      "Focused on PLC, VFD, motor systems, MCC panels, sensors, relays, and fault isolation for industrial facilities and specialist contractors.",
    audience: ["Industrial electricians", "Maintenance teams", "OEM integrators"],
    serviceModes: ["Remote diagnostics", "Document review", "Spare-parts advisory"],
    responseWindow: "Priority scheduling for verified companies",
    regions: ["United States", "International"],
    premium: true,
    signals: [
      "VFD and motor control expertise",
      "Control-panel and instrumentation troubleshooting",
      "Industrial documentation and schematic interpretation",
    ],
    useCases: [
      "Drive trips and startup instability",
      "Control-board and PLC module replacement validation",
      "4-20 mA loop and sensor diagnostics",
      "Protection selection for feeders and motors",
    ],
  },
  {
    slug: "marine-and-offshore-electro-technical-expert",
    title: "Marine & Offshore Electro-Technical Expert",
    description:
      "Premium support track for DP, PMS, generators, switchboards, thrusters, automation, alarm systems, and document-backed vessel troubleshooting.",
    audience: ["Marine ETOs", "Offshore operators", "Technical superintendents"],
    serviceModes: ["Remote diagnostics", "Alarm triage", "Manual and drawing analysis"],
    responseWindow: "Premium response path",
    regions: ["International", "Offshore", "Marine"],
    premium: true,
    signals: [
      "DP, PMS, generator, and switchboard familiarity",
      "Alarm Monitoring System and automation troubleshooting",
      "Marine spares validation and escalation support",
    ],
    useCases: [
      "Thruster and alternator failures",
      "PMS communication faults",
      "Generator alarms and repeated trips",
      "Main switchboard and protection issues",
    ],
  },
];

export function getExpertProfileBySlug(slug: string) {
  return expertProfiles.find((profile) => profile.slug === slug);
}
