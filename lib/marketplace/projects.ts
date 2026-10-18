/** Account and guest projects share the same bounded, catalog-ID based format. */
export const projectLimits = { projects: 20, items: 100, quantity: 999, name: 100, bodyBytes: 48_000 } as const;

export type ProjectItem = { productId: string; quantity: number };
export type ProjectDraft = { name: string; items: ProjectItem[] };
export type EquipmentProject = ProjectDraft & {
  id: string;
  revision: number;
  created_at: string;
  updated_at: string;
};
export type ProjectValidation<T> = { ok: true; value: T } | { ok: false; error: string };

export function isProjectObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function validateProjectDraft(value: unknown, knownProductIds: ReadonlySet<string>): ProjectValidation<ProjectDraft> {
  if (!isProjectObject(value)) return { ok: false, error: "A project is required." };
  if (typeof value.name !== "string" || !value.name.trim() || value.name.trim().length > projectLimits.name || /[\u0000-\u001f\u007f]/.test(value.name)) {
    return { ok: false, error: "Project name must contain 1–100 characters." };
  }
  if (!Array.isArray(value.items) || value.items.length > projectLimits.items) {
    return { ok: false, error: "A project can contain up to 100 equipment lines." };
  }
  const items: ProjectItem[] = [];
  const seen = new Set<string>();
  for (const item of value.items) {
    if (!isProjectObject(item) || Object.keys(item).some(key => key !== "productId" && key !== "quantity") ||
      typeof item.productId !== "string" || !knownProductIds.has(item.productId) || seen.has(item.productId) ||
      typeof item.quantity !== "number" || !Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > projectLimits.quantity) {
      return { ok: false, error: "Use unique catalog products and whole-number quantities from 1 to 999." };
    }
    seen.add(item.productId);
    items.push({ productId: item.productId, quantity: item.quantity });
  }
  return { ok: true, value: { name: value.name.trim(), items } };
}

export function validateProjectVersion(value: unknown): ProjectValidation<{ id: string; revision: number }> {
  if (!isProjectObject(value) || typeof value.id !== "string" ||
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value.id) ||
    typeof value.revision !== "number" || !Number.isSafeInteger(value.revision) || value.revision < 1 || value.revision >= 2_147_483_647) {
    return { ok: false, error: "A valid project id and revision are required." };
  }
  return { ok: true, value: { id: value.id, revision: value.revision } };
}

/** Quote cells and neutralise spreadsheet formulas, including user-entered names. */
export function projectCsv(project: ProjectDraft, productNames: Readonly<Record<string, string>>): string {
  const cell = (value: string | number) => {
    const text = String(value);
    const safe = /^[\s]*[=+@-]/.test(text) ? `'${text}` : text;
    return `"${safe.replaceAll('"', '""')}"`;
  };
  const rows: (string | number)[][] = [["Project", "Product ID", "Product", "Quantity"]];
  for (const item of project.items) rows.push([project.name, item.productId, productNames[item.productId] ?? item.productId, item.quantity]);
  return "\uFEFF" + rows.map(row => row.map(cell).join(",")).join("\r\n") + "\r\n";
}
