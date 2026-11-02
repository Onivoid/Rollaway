"use client";

import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

/** True after hydration / on the client; false during SSR. */
export function useIsClient() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

export function usePrefersReducedMotion() {
  return useSyncExternalStore(
    (onChange) => {
      const media = window.matchMedia("(prefers-reduced-motion: reduce)");
      media.addEventListener("change", onChange);
      return () => media.removeEventListener("change", onChange);
    },
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false
  );
}

export function useViewportSize() {
  return useSyncExternalStore(
    (onChange) => {
      window.addEventListener("resize", onChange);
      return () => window.removeEventListener("resize", onChange);
    },
    () => ({ width: window.innerWidth, height: window.innerHeight }),
    () => ({ width: 0, height: 0 })
  );
}
