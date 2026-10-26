"use client";

import { useEffect } from "react";

const TILT_SELECTOR = "[data-pointer-tilt]";

export function PointerTiltController() {
  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    function update(event: PointerEvent) {
      const target = (event.target as Element | null)?.closest<HTMLElement>(TILT_SELECTOR);
      if (!target) return;
      const bounds = target.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width;
      const y = (event.clientY - bounds.top) / bounds.height;
      target.style.setProperty("--tilt-x", `${((0.5 - y) * 7).toFixed(2)}deg`);
      target.style.setProperty("--tilt-y", `${((x - 0.5) * 9).toFixed(2)}deg`);
      target.style.setProperty("--tilt-light-x", `${(x * 100).toFixed(1)}%`);
      target.style.setProperty("--tilt-light-y", `${(y * 100).toFixed(1)}%`);
      target.dataset.tiltActive = "true";
    }

    function reset(event: PointerEvent) {
      const target = (event.target as Element | null)?.closest<HTMLElement>(TILT_SELECTOR);
      if (!target || target.contains(event.relatedTarget as Node | null)) return;
      target.style.removeProperty("--tilt-x");
      target.style.removeProperty("--tilt-y");
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
