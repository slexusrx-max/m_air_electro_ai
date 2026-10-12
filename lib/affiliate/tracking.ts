/** URLs are supplied by the approved program, never constructed from guessed IDs. */
export function resolveSupplierLink(
  productUrl: string,
  approvedUrl: string | undefined,
  enabled: boolean,
) {
  const normal = new URL(productUrl);
  if (normal.protocol !== "https:" || normal.username || normal.password || malformedPath(normal))
    throw new Error("Supplier URLs must use HTTPS");
  if (!enabled || !approvedUrl) return { href: normal.href, tracked: false };
  try {
    const approved = new URL(approvedUrl);
    if (
      approved.protocol !== "https:" ||
      approved.username ||
      approved.password || malformedPath(approved)
    )
      return { href: normal.href, tracked: false };
    return { href: approved.href, tracked: true };
  } catch {
    return { href: normal.href, tracked: false };
  }
}
function malformedPath(url: URL) {
  try {
    let path = url.pathname;
    for (let i = 0; i < 3; i++) path = decodeURIComponent(path);
    return /https?:[\/\\]/i.test(path) || path.split("/").includes(url.host);
  } catch { return true; }
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
