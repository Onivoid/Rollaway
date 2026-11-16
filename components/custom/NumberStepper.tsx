"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";

export function NumberStepper({
  id,
  value,
  min = 1,
  max,
  disabled = false,
  onChange,
}: {
  id?: string;
  value: number;
  min?: number;
  max: number;
  disabled?: boolean;
  onChange: (value: number) => void;
}) {
  const clampedMax = Math.max(min, max);
  const current = Math.min(Math.max(min, value), clampedMax);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(String(current));
  const canDec = !disabled && current > min;
  const canInc = !disabled && current < clampedMax;
  const display = editing ? draft : String(current);

  const commit = (next: number) => {
    onChange(Math.min(Math.max(min, Math.floor(next)), clampedMax));
  };

  return (
    <div
      className={`flex h-11 w-full items-stretch border border-porcelain-ink/15 bg-white ${
        disabled ? "opacity-55" : ""
      }`}
    >
      <button
        type="button"
        aria-label="Diminuer"
        disabled={!canDec}
        onClick={() => {
          setEditing(false);
          commit(current - 1);
        }}
        className="flex w-11 shrink-0 items-center justify-center border-r border-porcelain-ink/15 text-porcelain-ink transition hover:bg-porcelain-ink/5 disabled:cursor-not-allowed disabled:opacity-35"
      >
        <Minus className="size-4" aria-hidden />
      </button>

      <input
        id={id}
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        role="spinbutton"
        aria-valuemin={min}
        aria-valuemax={clampedMax}
        aria-valuenow={current}
        disabled={disabled}
        value={display}
        onFocus={() => {
          setDraft(String(current));
          setEditing(true);
        }}
        onChange={(e) => {
          const digits = e.target.value.replace(/\D/g, "");
          setDraft(digits);
          if (digits === "") return;
          commit(Number(digits));
        }}
        onBlur={() => {
          setEditing(false);
          if (draft === "") {
            commit(min);
            return;
          }
          commit(Number(draft));
        }}
        className="min-w-0 flex-1 bg-transparent text-center font-display text-lg font-extrabold tabular-nums text-porcelain-ink outline-none disabled:cursor-not-allowed"
      />

      <button
        type="button"
        aria-label="Augmenter"
        disabled={!canInc}
        onClick={() => {
          setEditing(false);
          commit(current + 1);
        }}
        className="flex w-11 shrink-0 items-center justify-center border-l border-porcelain-ink/15 text-porcelain-ink transition hover:bg-porcelain-ink/5 disabled:cursor-not-allowed disabled:opacity-35"
      >
        <Plus className="size-4" aria-hidden />
      </button>
    </div>
  );
}
