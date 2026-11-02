"use client";

import { useEffect } from "react";
import { NumberStepper } from "@/components/custom/NumberStepper";

export function DrawConfirmModal({
  open,
  participantCount,
  winnerCount,
  onWinnerCountChange,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  participantCount: number;
  winnerCount: number;
  onWinnerCountChange: (count: number) => void;
  onConfirm: (count: number) => void;
  onCancel: () => void;
}) {
  const max = Math.max(1, participantCount);
  const count = Math.min(Math.max(1, winnerCount), max);
  const plural = count > 1;

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCancel();
      if (event.key === "Enter") {
        onWinnerCountChange(count);
        onConfirm(count);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, count, onCancel, onConfirm, onWinnerCountChange]);

  if (!open) return null;

  return (
    <div
      className="scrim-enter fixed inset-0 z-[60] flex items-center justify-center bg-desk/85 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="draw-confirm-title"
    >
      <div className="modal-enter w-full max-w-md border-4 border-ticket bg-porcelain text-porcelain-ink shadow-[0_18px_40px_rgba(0,0,0,0.45)]">
        <div className="border-b border-porcelain-ink/10 bg-ticket px-5 py-4 text-ticket-ink">
          <h2
            id="draw-confirm-title"
            className="font-display text-2xl font-extrabold uppercase tracking-wide"
          >
            Confirmer le tirage
          </h2>
        </div>

        <div className="space-y-5 px-5 py-5">
          <p className="text-sm leading-relaxed text-porcelain-ink/85">
            Tu vas tirer{" "}
            <strong>
              {count} {plural ? "gagnants" : "gagnant"}
            </strong>{" "}
            parmi {participantCount} inscrit
            {participantCount > 1 ? "s" : ""}. C’est bien ça ?
          </p>

          <div className="space-y-1.5">
            <label
              htmlFor="confirm-winner-count"
              className="block text-xs font-bold uppercase tracking-[0.12em] text-porcelain-ink/55"
            >
              Nombre de gagnants
            </label>
            <NumberStepper
              id="confirm-winner-count"
              value={count}
              min={1}
              max={max}
              onChange={onWinnerCountChange}
            />
            <p className="text-xs text-porcelain-ink/55">
              Change le nombre ici si ce n’est pas le bon, puis confirme.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={onCancel}
              className="h-11 border border-porcelain-ink/20 font-semibold transition hover:bg-porcelain-ink/5"
            >
              Annuler
            </button>
            <button
              type="button"
              onClick={() => {
                onWinnerCountChange(count);
                onConfirm(count);
              }}
              className="btn-press h-11 bg-ticket font-display text-base font-extrabold uppercase tracking-wide text-ticket-ink hover:brightness-105"
            >
              {plural ? `Tirer ${count} gagnants` : "Tirer le gagnant"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
