/** Owner-confirmed approval is not evidence of EU campaign eligibility or tracking. */
export const renogyProgram = {
  network: "impact",
  approved: true,
  approvedAt: "2026-10-14",
  evidence: "owner-confirmed",
  programId: "14864",
  advertiserId: "3086767",
} as const;

export function verifiedImpactLinks(links: Record<string, string>, originsJson: string | undefined) {
  let origins: unknown;
  try { origins = JSON.parse(originsJson ?? "[]"); } catch { return {}; }
  if (!Array.isArray(origins)) return {};
  const allowed = new Set(origins.filter((origin): origin is string => {
    if (typeof origin !== "string") return false;
    try {
      const url = new URL(origin);
      return url.protocol === "https:" && !url.username && !url.password && !url.port && url.origin === origin;
    } catch { return false; }
  }));
  return Object.fromEntries(Object.entries(links).filter(([source, target]) => {
    try {
      const url = new URL(target);
      return target !== source && url.protocol === "https:" && !url.username && !url.password && !url.port && !url.hash && allowed.has(url.origin);
    } catch { return false; }
  }));
}
