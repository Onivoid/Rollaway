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

type ViewportSize = { width: number; height: number };

let viewportSnapshot: ViewportSize = { width: 0, height: 0 };

function getViewportSnapshot(): ViewportSize {
  const width = window.innerWidth;
  const height = window.innerHeight;
  if (
    viewportSnapshot.width === width &&
    viewportSnapshot.height === height
  ) {
    return viewportSnapshot;
  }
  viewportSnapshot = { width, height };
  return viewportSnapshot;
}

const serverViewportSnapshot: ViewportSize = { width: 0, height: 0 };

export function useViewportSize() {
  return useSyncExternalStore(
    (onChange) => {
      window.addEventListener("resize", onChange);
      return () => window.removeEventListener("resize", onChange);
    },
    getViewportSnapshot,
    () => serverViewportSnapshot
  );
}
