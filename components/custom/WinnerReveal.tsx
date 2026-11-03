"use client";

import { useEffect, useState } from "react";
import Confetti from "react-confetti";
import { usePrefersReducedMotion, useViewportSize } from "@/lib/client";

const CONFETTI_COLORS = [
  "#f5d547",
  "#ffffff",
  "#f4f2ec",
  "#e11d7a",
  "#3ddc84",
  "#12141a",
];

export function WinnerReveal({
  winners,
  onClose,
}: {
  winners: string[];
  onClose: () => void;
}) {
  const viewport = useViewportSize();
  const reduceMotion = usePrefersReducedMotion();
  const [phase, setPhase] = useState<"drumroll" | "reveal">(
    reduceMotion ? "reveal" : "drumroll"
  );
  const [shower, setShower] = useState(true);
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);

    const revealAt = reduceMotion ? 0 : 720;
    const revealTimer = window.setTimeout(() => setPhase("reveal"), revealAt);
    const showerTimer = window.setTimeout(() => setShower(false), 5200);

    return () => {
      window.removeEventListener("keydown", onKey);
      window.clearTimeout(revealTimer);
      window.clearTimeout(showerTimer);
    };
  }, [onClose, reduceMotion]);

  const plural = winners.length > 1;
  const showConfetti = phase === "reveal" && !reduceMotion && viewport.width > 0;

  return (
    <div
      className="scrim-enter fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-desk/88 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="winner-title"
      aria-busy={phase === "drumroll"}
    >
      {showConfetti && (
        <>
          <Confetti
            width={viewport.width}
            height={viewport.height}
            colors={CONFETTI_COLORS}
            numberOfPieces={280}
            recycle={false}
            gravity={0.28}
            initialVelocityY={18}
            tweenDuration={4800}
            style={{ position: "fixed", inset: 0, pointerEvents: "none" }}
          />
          {shower && (
            <Confetti
              width={viewport.width}
              height={viewport.height}
              colors={CONFETTI_COLORS}
              numberOfPieces={70}
              recycle
              gravity={0.12}
              friction={0.97}
              initialVelocityY={8}
              confettiSource={{
                x: viewport.width / 2 - 40,
                y: viewport.height * 0.2,
                w: 80,
                h: 12,
              }}
              style={{ position: "fixed", inset: 0, pointerEvents: "none" }}
            />
          )}
        </>
      )}

      <div className="winner-rays-wrap pointer-events-none absolute inset-0" aria-hidden>
        <div className="winner-rays" />
      </div>

      {phase === "drumroll" ? (
        <div className="drumroll relative z-10 text-center">
          <p className="font-display text-sm font-bold uppercase tracking-[0.28em] text-ticket">
            Tirage
          </p>
          <p className="mt-3 font-display text-5xl font-extrabold uppercase tracking-wide text-foreground md:text-6xl">
            …
          </p>
        </div>
      ) : (
        <div className="stamp-reveal relative z-10 w-full max-w-lg border-4 border-ticket bg-porcelain text-porcelain-ink shadow-[0_22px_50px_rgba(0,0,0,0.5)]">
          <div className="ticket-stub winner-banner border-b border-porcelain-ink/10 bg-ticket px-6 py-5 text-ticket-ink">
            <h2
              id="winner-title"
              className="font-display text-4xl font-extrabold uppercase tracking-wide md:text-5xl"
            >
              {plural ? "Gagnants" : "Gagnant"}
            </h2>
          </div>

          <div className="ticket-stub space-y-5 px-6 py-8">
            <ul className="theme-scroll winner-list-scroll space-y-2 pr-1">
              {winners.map((name, index) => (
                <li
                  key={`${name}-${index}`}
                  className="winner-name flex min-h-14 items-center gap-3 border border-porcelain-ink/10 bg-white px-3 py-3"
                  style={{
                    animationDelay: `${120 + Math.min(index, 5) * 140}ms`,
                  }}
                >
                  {plural && (
                    <span className="font-display text-lg font-bold text-porcelain-ink/40">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  )}
                  <span className="min-w-0 flex-1 break-all font-display text-2xl font-extrabold md:text-3xl">
                    {name}
                  </span>
                </li>
              ))}
            </ul>
            <p className="text-center text-sm text-porcelain-ink/60">
              Tirés au hasard parmi les inscrits.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="btn-press mx-auto flex h-12 w-full max-w-xs items-center justify-center bg-desk font-display text-lg font-bold uppercase tracking-wide text-foreground transition hover:bg-desk-raised"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
