"use client";

import { useEffect } from "react";

const TILT_SELECTOR = [
  "[data-pointer-tilt]",
  ".equipment-card",
  ".supplier-entry-card",
  "[data-feed-sku]",
  ".discovery-card",
  ".info-card",
  ".finder-recommendation",
  ".starter-scenarios .content-panel",
  ".category-tiles > a",
  ".planning-links > a",
  ".hero-equipment-tile",
  ".home-buying-guide-grid > article",
  ".quick-solution-scenarios > button",
  ".water-category-grid > a",
  ".water-suppliers > a",
].join(",");

export function PointerTiltController() {
  useEffect(() => {
    if (!window.matchMedia("(any-hover: hover) and (any-pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    function update(event: PointerEvent) {
      if (event.pointerType === "touch") return;
      const target = (event.target as Element | null)?.closest<HTMLElement>(TILT_SELECTOR);
      if (!target) return;
      target.setAttribute("data-pointer-tilt", "");
      const bounds = target.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width;
      const y = (event.clientY - bounds.top) / bounds.height;
      // Reach a visible tilt before the edge, capped at seven degrees per axis.
      const tiltX = Math.max(-7, Math.min(7, (0.5 - y) * 20));
      const tiltY = Math.max(-7, Math.min(7, (x - 0.5) * 20));
      target.style.setProperty("--tilt-x", `${tiltX.toFixed(2)}deg`);
      target.style.setProperty("--tilt-y", `${tiltY.toFixed(2)}deg`);
      target.style.setProperty("--tilt-lift", "-3px");
      target.style.setProperty("--tilt-light-x", `${(x * 100).toFixed(1)}%`);
      target.style.setProperty("--tilt-light-y", `${(y * 100).toFixed(1)}%`);
      target.dataset.tiltActive = "true";
    }

    function reset(event: PointerEvent) {
      const target = (event.target as Element | null)?.closest<HTMLElement>(TILT_SELECTOR);
      if (!target || target.contains(event.relatedTarget as Node | null)) return;
      target.style.removeProperty("--tilt-x");
      target.style.removeProperty("--tilt-y");
      target.style.removeProperty("--tilt-lift");
      target.style.removeProperty("--tilt-light-x");
      target.style.removeProperty("--tilt-light-y");
      delete target.dataset.tiltActive;
    }

    document.addEventListener("pointermove", update, { passive: true });
    document.addEventListener("pointerout", reset, { passive: true });
    return () => {
      document.removeEventListener("pointermove", update);
      document.removeEventListener("pointerout", reset);
    };
  }, []);

  return null;
}
