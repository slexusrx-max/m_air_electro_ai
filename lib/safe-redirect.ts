/** Resolve only local paths; validate the parsed origin as well as the prefix. */
export function safeRedirectUrl(next: string | null, origin: string): URL {
  const fallback = new URL("/dashboard", origin);
  if (!next?.startsWith("/") || next.startsWith("//") || /[\\\u0000-\u0020]/.test(next)) return fallback;
  try {
    const target = new URL(next, origin);
    return target.origin === fallback.origin ? target : fallback;
  } catch { return fallback; }
}
