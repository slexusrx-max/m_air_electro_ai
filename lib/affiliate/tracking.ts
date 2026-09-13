/** URLs are supplied by the approved program, never constructed from guessed IDs. */
export function resolveSupplierLink(
  productUrl: string,
  approvedUrl: string | undefined,
  enabled: boolean,
) {
  const normal = new URL(productUrl);
  if (normal.protocol !== "https:")
    throw new Error("Supplier URLs must use HTTPS");
  if (!enabled || !approvedUrl) return { href: normal.href, tracked: false };
  try {
    const approved = new URL(approvedUrl);
    if (
      approved.protocol !== "https:" ||
      approved.username ||
      approved.password
    )
      return { href: normal.href, tracked: false };
    return { href: approved.href, tracked: true };
  } catch {
    return { href: normal.href, tracked: false };
  }
}
export function appendTrackingParameter(
  productUrl: string,
  key: string,
  value?: string,
) {
  const url = new URL(productUrl);
  if (value?.trim()) url.searchParams.set(key, value.trim());
  return url.href;
}
