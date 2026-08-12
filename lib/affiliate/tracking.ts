/** Shared, provider-neutral helper. IDs are server-only environment variables. */
export function appendTrackingParameter(productUrl: string, key: string, value?: string) {
  if (!value?.trim()) return productUrl;
  const url = new URL(productUrl);
  url.searchParams.set(key, value.trim());
  return url.toString();
}
