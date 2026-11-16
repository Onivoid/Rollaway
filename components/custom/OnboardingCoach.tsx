"use client";

import {
  useCallback,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { useIsClient } from "@/lib/client";

const STORAGE_KEY = "rollaway-onboarding-v2";
const STORAGE_EVENT = "rollaway-onboarding";

function subscribeOnboarding(onChange: () => void) {
  const handler = () => onChange();
  window.addEventListener("storage", handler);
  window.addEventListener(STORAGE_EVENT, handler);
  return () => {
    window.removeEventListener("storage", handler);
    window.removeEventListener(STORAGE_EVENT, handler);
  };
}

function readOnboardingDone() {
  return window.localStorage.getItem(STORAGE_KEY) === "done";
}

function writeOnboardingDone(done: boolean) {
  if (done) window.localStorage.setItem(STORAGE_KEY, "done");
  else window.localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new Event(STORAGE_EVENT));
}

export type TipId =
  | "channel"
  | "command"
  | "connect"
  | "capture"
  | "winners"
  | "draw";

const STEPS: { id: TipId; title: string; body: string }[] = [
  {
    id: "channel",
    title: "Chaîne",
    body: "Indique le nom de ta chaîne Twitch",
  },
  {
    id: "command",
    title: "Commande",
    body: "Les viewers doivent envoyer exactement ce texte pour s’inscrire.",
  },
  {
    id: "winners",
    title: "Gagnants",
    body: "Choisis combien de personnes tirer. Chacun n’est tiré qu’une fois.",
  },
  {
    id: "connect",
    title: "Connexion",
    body: "Connecte le chat en lecture seule, sans compte Twitch.",
  },
  {
    id: "capture",
    title: "Inscriptions",
    body: "Ouvre les inscriptions quand tu es prêt à recevoir les commandes.",
  },
  {
    id: "draw",
    title: "Tirage",
    body: "Lance le tirage au hasard parmi les inscrits.",
  },
];

type Rect = { top: number; left: number; width: number; height: number };

function readTargetRect(id: TipId): Rect | null {
  const el = document.querySelector(`[data-onboarding="${id}"]`);
  if (!(el instanceof HTMLElement)) return null;
  const r = el.getBoundingClientRect();
  if (r.width === 0 && r.height === 0) return null;
  return {
    top: r.top,
    left: r.left,
    width: r.width,
    height: r.height,
  };
}

export function useOnboarding() {
  const ready = useIsClient();
  const dismissed = useSyncExternalStore(
    subscribeOnboarding,
    readOnboardingDone,
    () => true
  );
  const [step, setStep] = useState(0);
  const [openTip, setOpenTip] = useState<TipId | null>(null);

  const finish = useCallback(() => {
    writeOnboardingDone(true);
    setOpenTip(null);
  }, []);

  const next = useCallback(() => {
    setStep((current) => {
      if (current >= STEPS.length - 1) {
        writeOnboardingDone(true);
        setOpenTip(null);
        return current;
      }
      return current + 1;
    });
  }, []);

  const showTip = useCallback((id: TipId) => {
    setOpenTip((current) => (current === id ? null : id));
  }, []);

  const isTourActive = ready && !dismissed;
  const activeStep = STEPS[step] ?? STEPS[0];

  return {
    ready,
    dismissed,
    isTourActive,
    step,
    activeStep,
    openTip,
    steps: STEPS,
    next,
    skip: finish,
    finish,
    showTip,
    restart: () => {
      writeOnboardingDone(false);
      setStep(0);
      setOpenTip(null);
    },
  };
}

export function OnboardingHighlight({
  stepId,
  stepIndex,
  total,
  title,
  body,
  onNext,
  onSkip,
}: {
  stepId: TipId;
  stepIndex: number;
  total: number;
  title: string;
  body: string;
  onNext: () => void;
  onSkip: () => void;
}) {
  const mounted = useIsClient();
  const [rect, setRect] = useState<Rect | null>(null);

  const measure = useCallback(() => {
    setRect(readTargetRect(stepId));
  }, [stepId]);

  useLayoutEffect(() => {
    const el = document.querySelector(`[data-onboarding="${stepId}"]`);
    if (el instanceof HTMLElement) {
      el.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "nearest",
      });
    }
    const frame = window.requestAnimationFrame(() => measure());
    const t = window.setTimeout(measure, 300);
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, true);
    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(t);
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure, true);
    };
  }, [stepId, measure]);

  if (!mounted || !rect) return null;

  const pad = 10;
  const hole = {
    top: Math.max(8, rect.top - pad),
    left: Math.max(8, rect.left - pad),
    width: rect.width + pad * 2,
    height: rect.height + pad * 2,
  };

  const viewportH = window.innerHeight;
  const viewportW = window.innerWidth;
  const bubbleW = Math.min(300, viewportW - 24);
  const spaceBelow = viewportH - (hole.top + hole.height);
  const placeBelow = spaceBelow > 170 || hole.top < 150;

  const bubbleLeft = Math.min(
    Math.max(12, hole.left),
    viewportW - bubbleW - 12
  );
  const bubbleTop = placeBelow
    ? Math.min(hole.top + hole.height + 12, viewportH - 190)
    : Math.max(12, hole.top - 12);

  const holeBottom = hole.top + hole.height;
  const holeRight = hole.left + hole.width;

  return createPortal(
    <div className="pointer-events-none fixed inset-0 z-[200]" aria-live="polite">
      {/* 4-pane scrim keeps a clear hole over the active control */}
      <button
        type="button"
        aria-label="Passer l’aide"
        className="pointer-events-auto absolute bg-desk/80"
        style={{ top: 0, left: 0, right: 0, height: hole.top }}
        onClick={onSkip}
      />
      <button
        type="button"
        aria-label="Passer l’aide"
        className="pointer-events-auto absolute bg-desk/80"
        style={{
          top: holeBottom,
          left: 0,
          right: 0,
          bottom: 0,
        }}
        onClick={onSkip}
      />
      <button
        type="button"
        aria-label="Passer l’aide"
        className="pointer-events-auto absolute bg-desk/80"
        style={{
          top: hole.top,
          left: 0,
          width: hole.left,
          height: hole.height,
        }}
        onClick={onSkip}
      />
      <button
        type="button"
        aria-label="Passer l’aide"
        className="pointer-events-auto absolute bg-desk/80"
        style={{
          top: hole.top,
          left: holeRight,
          right: 0,
          height: hole.height,
        }}
        onClick={onSkip}
      />

      <div
        className="pointer-events-none absolute border-2 border-ticket ring-4 ring-ticket/30"
        style={{
          top: hole.top,
          left: hole.left,
          width: hole.width,
          height: hole.height,
        }}
      />

      <div
        role="dialog"
        aria-label={`Aide étape ${stepIndex + 1} sur ${total}`}
        className="pointer-events-auto absolute z-[210] border border-ticket bg-desk p-4 text-foreground shadow-[0_16px_40px_rgba(0,0,0,0.55)]"
        style={{
          top: bubbleTop,
          left: bubbleLeft,
          width: bubbleW,
          transform: placeBelow ? undefined : "translateY(-100%)",
        }}
      >
        <p className="font-display text-sm font-bold uppercase tracking-wide text-ticket">
          {title}
          <span className="ml-2 text-muted-foreground">
            {stepIndex + 1}/{total}
          </span>
        </p>
        <p className="mt-2 text-sm leading-relaxed text-foreground/90">{body}</p>
        <div className="mt-4 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onSkip}
            className="h-9 px-3 text-sm font-semibold text-muted-foreground transition hover:text-foreground"
          >
            Passer
          </button>
          <button
            type="button"
            onClick={onNext}
            className="h-9 bg-ticket px-4 text-sm font-bold text-ticket-ink transition hover:brightness-105"
          >
            {stepIndex >= total - 1 ? "C’est bon" : "Suivant"}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

export function InfoBubble({
  tipId,
  openTip,
  onToggle,
  title,
  body,
  align = "left",
  disabled = false,
}: {
  tipId: TipId;
  openTip: TipId | null;
  onToggle: (id: TipId) => void;
  title: string;
  body: string;
  align?: "left" | "right";
  disabled?: boolean;
}) {
  const labelId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const mounted = useIsClient();
  const [coords, setCoords] = useState<Rect | null>(null);
  const open = !disabled && openTip === tipId;

  useLayoutEffect(() => {
    if (!open || !buttonRef.current) return;
    const update = () => {
      const r = buttonRef.current!.getBoundingClientRect();
      setCoords({
        top: r.top,
        left: r.left,
        width: r.width,
        height: r.height,
      });
    };
    update();
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, [open]);

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={labelId}
        aria-label={`Info : ${title}`}
        disabled={disabled}
        onClick={() => onToggle(tipId)}
        className="inline-flex size-5 shrink-0 items-center justify-center border border-porcelain-ink/25 bg-white text-xs font-bold text-porcelain-ink/70 transition hover:border-ticket hover:text-porcelain-ink disabled:cursor-not-allowed disabled:opacity-40"
      >
        ?
      </button>
      {mounted &&
        open &&
        coords &&
        createPortal(
          <span
            id={labelId}
            role="tooltip"
            className="fixed z-[210] w-56 border border-ticket bg-desk p-3 text-left text-foreground shadow-[0_12px_32px_rgba(0,0,0,0.5)]"
            style={{
              top: coords.top + coords.height + 8,
              left:
                align === "right"
                  ? Math.max(12, coords.left + coords.width - 224)
                  : Math.min(coords.left, window.innerWidth - 236),
            }}
          >
            <span className="block font-display text-sm font-bold uppercase tracking-wide text-ticket">
              {title}
            </span>
            <span className="mt-1 block text-xs leading-relaxed text-foreground/85">
              {body}
            </span>
          </span>,
          document.body
        )}
    </>
  );
}

export function OnboardingTarget({
  id,
  active,
  children,
  className = "",
}: {
  id: TipId;
  active: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      data-onboarding={id}
      className={`${className} ${active ? "relative z-[201]" : ""}`}
    >
      {children}
    </div>
  );
}
