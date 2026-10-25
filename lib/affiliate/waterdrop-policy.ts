import { verifiedImpactLinks } from "./renogy-policy";
import { validSupplierUrl } from "./suppliers";

// Exact origin in the issued DE short links and catalog 18289 links.
// This validates shape/destination, not approval, availability or commission.
export function verifiedWaterdropLinks(links: Record<string, string>) {
  const origins = JSON.stringify(["https://dewaterdropfilter.pxf.io"]);
  return Object.fromEntries(Object.entries(verifiedImpactLinks(links, origins)).filter(([source, target]) => {
    if (!validSupplierUrl(source, "waterdrop-eu")) return false;
    const url = new URL(target);
    // Issued opaque short codes or the documented DE catalog campaign only.
    return /^\/[A-Za-z0-9]+$/.test(url.pathname)
      ? !url.search
      : url.pathname === "/c/7767803/2102187/19363" && url.searchParams.getAll("u").length === 1;
  }));
}
