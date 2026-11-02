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
    const allowed = window.matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
    let active: HTMLElement | null = null;
    let frame = 0;
    let point: { x: number; y: number } | null = null;

    function clear() {
      cancelAnimationFrame(frame); frame = 0; point = null;
      if (!active) return;
      for (const property of ["--tilt-x", "--tilt-y", "--tilt-lift", "--tilt-light-x", "--tilt-light-y"]) active.style.removeProperty(property);
      delete active.dataset.tiltActive;
      active = null;
    }

    function paint() {
      frame = 0;
      if (!allowed.matches || !active?.isConnected || !point) { clear(); return; }
      const bounds = active.getBoundingClientRect();
      if (!bounds.width || !bounds.height) { clear(); return; }
      const x = Math.max(0, Math.min(1, (point.x - bounds.left) / bounds.width));
      const y = Math.max(0, Math.min(1, (point.y - bounds.top) / bounds.height));
      active.style.setProperty("--tilt-x", `${((0.5 - y) * 4).toFixed(2)}deg`);
      active.style.setProperty("--tilt-y", `${((x - 0.5) * 4).toFixed(2)}deg`);
      active.style.setProperty("--tilt-lift", "0px");
      active.style.setProperty("--tilt-light-x", `${(x * 100).toFixed(1)}%`);
      active.style.setProperty("--tilt-light-y", `${(y * 100).toFixed(1)}%`);
      active.dataset.tiltActive = "true";
    }

    function update(event: PointerEvent) {
      if (!allowed.matches || event.pointerType !== "mouse") { clear(); return; }
      const element = event.target instanceof Element ? event.target : null;
      const target = element?.closest<HTMLElement>(TILT_SELECTOR);
      const control = element?.closest("button,input,select,textarea,label,a,summary,[contenteditable]");
      if (!target || (control && control !== target)) { clear(); return; }
      if (active !== target) { clear(); active = target; }
      target.setAttribute("data-pointer-tilt", "");
      point = { x: event.clientX, y: event.clientY };
      if (!frame) frame = requestAnimationFrame(paint);
    }

    function reset(event: PointerEvent) {
      if (active && (!(event.relatedTarget instanceof Node) || !active.contains(event.relatedTarget))) clear();
    }

    document.addEventListener("pointermove", update, { passive: true });
    document.addEventListener("pointerout", reset, { passive: true });
    document.addEventListener("pointerdown", clear, { passive: true });
    document.addEventListener("pointercancel", clear, { passive: true });
    document.addEventListener("focusin", clear);
    window.addEventListener("scroll", clear, { passive: true });
    window.addEventListener("blur", clear);
    allowed.addEventListener("change", clear);
    return () => {
      clear();
      document.removeEventListener("pointermove", update);
      document.removeEventListener("pointerout", reset);
      document.removeEventListener("pointerdown", clear);
      document.removeEventListener("pointercancel", clear);
      document.removeEventListener("focusin", clear);
      window.removeEventListener("scroll", clear);
      window.removeEventListener("blur", clear);
      allowed.removeEventListener("change", clear);
    };
  }, []);

  return null;
}
