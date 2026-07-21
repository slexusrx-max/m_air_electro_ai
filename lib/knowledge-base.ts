export type KnowledgeArticle = {
  audience: string[];
  category: string;
  excerpt: string;
  highlights: string[];
  readTime: string;
  sections: Array<{
    body: string[];
    title: string;
  }>;
  slug: string;
  title: string;
};

export const knowledgeArticles: KnowledgeArticle[] = [
  {
    slug: "breaker-trips-under-load",
    title: "How to Investigate a Breaker That Trips Under Load",
    category: "Diagnostics",
    readTime: "6 min read",
    audience: ["Home users", "Electricians", "Maintenance teams"],
    excerpt:
      "A practical sequence for separating overload, short circuit, nuisance trip, and equipment fault scenarios before replacing parts blindly.",
    highlights: [
      "Start with load pattern, not with random part replacement.",
      "Confirm whether the trip is thermal, magnetic, or upstream.",
      "Use insulation, inrush, and connection checks before escalating.",
    ],
    sections: [
      {
        title: "What to verify first",
        body: [
          "Identify whether the breaker trips immediately, after warm-up, or only under a specific operating sequence. The timing tells you whether you are more likely dealing with inrush, overload, or degraded insulation.",
          "Confirm the breaker size, load type, and whether the circuit has been modified recently. Unexpected additions, temporary equipment, and replacement devices with the wrong curve are common causes.",
        ],
      },
      {
        title: "Safe diagnostic sequence",
        body: [
          "Inspect terminations, torque condition, discoloration, and overheating evidence before energizing repeatedly. Loose terminations often mimic equipment failure.",
          "If the trip appears load-related, compare measured current against expected operating current and against the selected protection philosophy. Repeated guessing without current measurement delays the repair and increases risk.",
        ],
      },
      {
        title: "When to escalate",
        body: [
          "Escalate when the circuit serves critical equipment, when insulation readings degrade, when the breaker trips upstream devices, or when you suspect a coordination issue rather than a single-fault condition.",
        ],
      },
    ],
  },
  {
    slug: "4-20ma-loop-troubleshooting",
    title: "4-20 mA Loop Troubleshooting for Field Sensors and AMS Inputs",
    category: "Instrumentation",
    readTime: "7 min read",
    audience: ["Industrial electricians", "Marine ETOs", "Instrumentation teams"],
    excerpt:
      "A concise troubleshooting flow for unstable readings, frozen values, loop mismatch, and alarm integration problems in industrial and marine systems.",
    highlights: [
      "Verify loop power and grounding before changing transmitters.",
      "Separate field-side faults from AMS, PLC, or I/O card issues.",
      "Check scaling, burden resistance, and shield treatment as a system.",
    ],
    sections: [
      {
        title: "Field-side checks",
        body: [
          "Confirm transmitter supply voltage under load, loop polarity, and terminal integrity. A healthy-looking transmitter can still misbehave if the loop collapses under actual operating conditions.",
          "Measure current directly in series where safe and appropriate. If the measured loop current is correct but the control system shows the wrong value, the issue usually shifts downstream toward scaling or input interpretation.",
        ],
      },
      {
        title: "Control-system checks",
        body: [
          "Validate the configured range, engineering units, alarm thresholds, and fail-safe behavior in the AMS, PLC, or monitoring layer. Wrong scaling often looks like a bad sensor.",
          "Review shielding, common reference strategy, and any loop isolators or barriers in the path. Intermittent noise or offset can come from grounding practice rather than the transmitter itself.",
        ],
      },
      {
        title: "Marine and offshore relevance",
        body: [
          "For rotating equipment, compressors, and pumps, 4-20 mA alarms should be treated as protection-adjacent signals. If a low-pressure or temperature alarm path is unreliable, the issue becomes operationally significant, not cosmetic.",
        ],
      },
    ],
  },
  {
    slug: "cable-sizing-for-ev-and-generator-loads",
    title: "Cable Sizing for EV Chargers and Generator-Fed Loads",
    category: "Calculations",
    readTime: "8 min read",
    audience: ["Electrical contractors", "Home users", "Industrial planners"],
    excerpt:
      "Why cable size decisions must balance ampacity, voltage drop, duty cycle, installation method, and future operating margin instead of relying on a single lookup table.",
    highlights: [
      "Ampacity alone is not enough for long runs.",
      "Generator-fed systems amplify startup and voltage sensitivity issues.",
      "EV chargers behave like long-duration continuous loads.",
    ],
    sections: [
      {
        title: "Where engineers usually under-size",
        body: [
          "Long feeder runs and retrofit installations are the most common places where a cable meets current demand but still performs poorly because voltage drop was ignored.",
          "Continuous loads such as EV charging can expose thermal margins that look acceptable on paper but become uncomfortable in real use when grouping, ambient temperature, or installation method are less favorable.",
        ],
      },
      {
        title: "Generator-fed considerations",
        body: [
          "Generator systems deserve extra attention to startup demand, voltage dip tolerance, and protection coordination. The cable, breaker, and generator should be checked as one operating chain instead of separate line items.",
        ],
      },
      {
        title: "Use the calculator correctly",
        body: [
          "Treat MVP calculator outputs as preliminary engineering guidance. Final design still needs code-specific checks, installation corrections, fault duty review, and documented assumptions.",
        ],
      },
    ],
  },
];

export function getKnowledgeArticleBySlug(slug: string) {
  return knowledgeArticles.find((article) => article.slug === slug);
}
