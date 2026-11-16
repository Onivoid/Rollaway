"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useGiveaway } from "@/context/GiveawayContext";
import { useTwitchChat } from "@/hooks/useTwitchChat";
import { WinnerReveal } from "@/components/custom/WinnerReveal";
import { DrawConfirmModal } from "@/components/custom/DrawConfirmModal";
import { NumberStepper } from "@/components/custom/NumberStepper";
import {
  InfoBubble,
  OnboardingHighlight,
  OnboardingTarget,
  useOnboarding,
} from "@/components/custom/OnboardingCoach";
import { CircleHelp, FlaskConical, Github } from "lucide-react";

function formatEntryTime(timestamp: number) {
  return new Intl.DateTimeFormat("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(timestamp);
}

export function GiveawayApp() {
  const {
    participants,
    command,
    setCommand,
    winnerCount,
    setWinnerCount,
    isCapturing,
    startCapture,
    stopCapture,
    addParticipant,
    clearParticipants,
    winners,
    rollWinners,
    resetWinners,
    isDemoMode,
    startDemo,
    stopDemo,
  } = useGiveaway();

  const onboarding = useOnboarding();
  const [channelName, setChannelName] = useState("");
  const [confirmDrawOpen, setConfirmDrawOpen] = useState(false);
  const isCapturingRef = useRef(isCapturing);

  useEffect(() => {
    isCapturingRef.current = isCapturing;
  }, [isCapturing]);

  const handleMessage = useCallback(
    (username: string, message: string) => {
      if (!isCapturingRef.current) return;
      const trimmedCommand = command.trim().toLowerCase();
      const trimmedMessage = message.trim().toLowerCase();
      if (trimmedMessage === trimmedCommand) {
        addParticipant(username);
      }
    },
    [command, addParticipant]
  );

  const {
    isConnected: isChatConnected,
    error,
    connectToChat,
    disconnectFromChat,
  } = useTwitchChat({
    channel: channelName,
    onMessage: handleMessage,
  });

  const isConnected = isDemoMode || isChatConnected;

  const handleStartDemo = () => {
    if (isChatConnected) disconnectFromChat();
    setChannelName("demo_rollaway");
    startDemo();
  };

  const handleStopDemo = () => {
    stopDemo();
    setChannelName("");
  };

  const maxWinners = Math.max(1, participants.length || 1);
  const effectiveWinnerCount = Math.min(winnerCount, maxWinners);
  const canRoll = participants.length > 0 && winners.length === 0;
  const drawLabel =
    effectiveWinnerCount > 1
      ? `Tirer ${effectiveWinnerCount} gagnants`
      : "Tirer le gagnant";

  const winnerRank = (username: string) => {
    const index = winners.findIndex(
      (name) => name.toLowerCase() === username.toLowerCase()
    );
    return index === -1 ? null : index + 1;
  };

  return (
    <div className="flex min-h-dvh flex-col bg-desk text-foreground">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-border px-4 py-3 md:px-6">
        <div className="flex items-baseline gap-3">
          <span className="inline-flex size-8 items-center justify-center bg-ticket font-display text-lg font-extrabold text-ticket-ink">
            R
          </span>
          <h1 className="font-display text-2xl font-extrabold tracking-wide uppercase md:text-3xl">
            Rollaway
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <StatusChip
            active={isConnected}
            tone="live"
            idleLabel="Hors ligne"
            activeLabel={isDemoMode ? "Démo connectée" : "Connecté"}
          />
          <StatusChip
            active={isCapturing}
            tone="punch"
            idleLabel="Inscriptions fermées"
            activeLabel="Inscriptions ouvertes"
          />
          <StatusChip
            active={participants.length > 0}
            tone="ticket"
            idleLabel="0 inscrits"
            activeLabel={`${participants.length} inscrits`}
          />
          {!onboarding.isTourActive && (
            <>
              {isDemoMode ? (
                <button
                  type="button"
                  onClick={handleStopDemo}
                  className="inline-flex items-center gap-1.5 border-2 border-punch bg-punch px-3 py-1.5 text-xs font-extrabold uppercase tracking-wide text-punch-ink transition hover:brightness-110"
                >
                  <FlaskConical className="size-3.5" aria-hidden />
                  Quitter la démo
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleStartDemo}
                  className="inline-flex items-center gap-1.5 border border-ticket px-3 py-1.5 text-xs font-extrabold uppercase tracking-wide text-ticket transition hover:bg-ticket hover:text-ticket-ink"
                >
                  <FlaskConical className="size-3.5" aria-hidden />
                  Démonstration
                </button>
              )}
              <button
                type="button"
                onClick={onboarding.restart}
                className="inline-flex items-center gap-1.5 bg-ticket px-3 py-1.5 text-xs font-extrabold uppercase tracking-wide text-ticket-ink shadow-[0_4px_12px_rgba(245,213,71,0.35)] transition hover:brightness-105"
              >
                <CircleHelp className="size-3.5" aria-hidden />
                Aide
              </button>
            </>
          )}
        </div>
      </header>

      {onboarding.isTourActive && (
        <OnboardingHighlight
          stepId={onboarding.activeStep.id}
          stepIndex={onboarding.step}
          total={onboarding.steps.length}
          title={onboarding.activeStep.title}
          body={onboarding.activeStep.body}
          onNext={onboarding.next}
          onSkip={onboarding.skip}
        />
      )}

      <main className="mx-auto flex w-full max-w-[1440px] flex-1 items-center px-4 py-4 md:px-6 md:py-6">
        <div className="shell-enter grid w-full gap-4 md:grid-cols-[minmax(280px,340px)_1fr] md:items-stretch md:gap-5">
        <aside className="order-2 md:order-1">
          <section className="flex h-full flex-col bg-porcelain text-porcelain-ink">
            <div className="border-b-4 border-ticket px-4 py-3">
              <h2 className="font-display text-xl font-bold uppercase tracking-wide">
                Réglages
              </h2>
            </div>

            <div className="space-y-4 p-4">
              <OnboardingTarget
                id="channel"
                active={
                  onboarding.isTourActive &&
                  onboarding.activeStep.id === "channel"
                }
              >
                <Field
                  id="channel"
                  label="Chaîne Twitch"
                  value={channelName}
                  onChange={setChannelName}
                  placeholder="nom_de_chaine"
                  disabled={isConnected}
                  tip={
                    <InfoBubble
                      tipId="channel"
                      openTip={onboarding.openTip}
                      onToggle={onboarding.showTip}
                      disabled={onboarding.isTourActive}
                      title="Chaîne"
                      body="Le nom public de ta chaîne, sans le @."
                    />
                  }
                />
              </OnboardingTarget>

              <OnboardingTarget
                id="command"
                active={
                  onboarding.isTourActive &&
                  onboarding.activeStep.id === "command"
                }
              >
                <Field
                  id="command"
                  label="Commande"
                  value={command}
                  onChange={setCommand}
                  placeholder="!giveaway"
                  disabled={isCapturing}
                  hint="Le message du chat doit être exactement celui-ci."
                  tip={
                    <InfoBubble
                      tipId="command"
                      openTip={onboarding.openTip}
                      onToggle={onboarding.showTip}
                      disabled={onboarding.isTourActive}
                      title="Commande"
                      body="Exemple : !giveaway. Majuscules ignorées, espaces autour aussi."
                    />
                  }
                />
              </OnboardingTarget>

              <OnboardingTarget
                id="winners"
                active={
                  onboarding.isTourActive &&
                  onboarding.activeStep.id === "winners"
                }
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <label
                      htmlFor="winner-count"
                      className="block text-xs font-bold uppercase tracking-[0.12em] text-porcelain-ink/55"
                    >
                      Nombre de gagnants
                    </label>
                    <InfoBubble
                      tipId="winners"
                      openTip={onboarding.openTip}
                      onToggle={onboarding.showTip}
                      disabled={onboarding.isTourActive}
                      title="Gagnants"
                      body="Tu peux tirer plusieurs personnes d’un coup. Chacun n’est tiré qu’une fois."
                    />
                  </div>
                  <NumberStepper
                    id="winner-count"
                    value={effectiveWinnerCount}
                    min={1}
                    max={maxWinners}
                    disabled={winners.length > 0}
                    onChange={setWinnerCount}
                  />
                  {participants.length > 0 &&
                    winnerCount > participants.length && (
                      <p className="text-xs text-porcelain-ink/55">
                        Limité à {participants.length} (nombre d’inscrits).
                      </p>
                    )}
                </div>
              </OnboardingTarget>

              {error && (
                <p
                  role="alert"
                  className="border border-punch/40 bg-punch/10 px-3 py-2 text-sm text-punch"
                >
                  {error}
                </p>
              )}

              <div className="grid grid-cols-2 gap-2">
                <OnboardingTarget
                  id="connect"
                  active={
                    onboarding.isTourActive &&
                    onboarding.activeStep.id === "connect"
                  }
                  className="col-span-2"
                >
                  {!isConnected ? (
                    <div className="relative">
                      <button
                        type="button"
                        onClick={connectToChat}
                        disabled={!channelName.trim()}
                        className="btn-press h-11 w-full bg-desk font-semibold text-foreground hover:bg-desk-raised disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        Connecter le chat
                      </button>
                      <span className="absolute top-1/2 right-2 -translate-y-1/2">
                        <InfoBubble
                          tipId="connect"
                          openTip={onboarding.openTip}
                          onToggle={onboarding.showTip}
                          disabled={onboarding.isTourActive}
                          title="Connexion"
                          body="Lecture seule du chat Twitch, sans compte. Ou lance une Démonstration pour tester seul."
                          align="right"
                        />
                      </span>
                    </div>
                  ) : isDemoMode ? (
                    <button
                      type="button"
                      onClick={handleStopDemo}
                      className="h-11 w-full border border-porcelain-ink/20 font-semibold transition hover:bg-porcelain-ink/5"
                    >
                      Quitter la démonstration
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={disconnectFromChat}
                      className="h-11 w-full border border-porcelain-ink/20 font-semibold transition hover:bg-porcelain-ink/5"
                    >
                      Déconnecter
                    </button>
                  )}
                </OnboardingTarget>

                <OnboardingTarget
                  id="capture"
                  active={
                    onboarding.isTourActive &&
                    onboarding.activeStep.id === "capture"
                  }
                  className="col-span-2"
                >
                  {!isCapturing ? (
                    <div className="relative">
                      <button
                        type="button"
                        onClick={startCapture}
                        className="btn-press h-11 w-full border-2 border-desk bg-desk font-semibold text-foreground hover:bg-desk-raised"
                      >
                        Ouvrir les inscriptions
                      </button>
                      <span className="absolute top-1/2 right-2 -translate-y-1/2">
                        <InfoBubble
                          tipId="capture"
                          openTip={onboarding.openTip}
                          onToggle={onboarding.showTip}
                          disabled={onboarding.isTourActive}
                          title="Inscriptions"
                          body="Tant que c’est ouvert, chaque commande valide ajoute un inscrit."
                          align="right"
                        />
                      </span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={stopCapture}
                      className="h-11 w-full border-2 border-punch font-semibold text-punch transition hover:bg-punch/10"
                    >
                      Fermer les inscriptions
                    </button>
                  )}
                </OnboardingTarget>

                {isDemoMode ? (
                  <button
                    type="button"
                    onClick={startDemo}
                    className="col-span-2 h-10 border border-ticket/40 text-sm font-semibold text-ticket transition hover:bg-ticket/10"
                  >
                    Recharger les inscrits démo
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={clearParticipants}
                    className="col-span-2 h-10 border border-porcelain-ink/15 text-sm font-semibold text-porcelain-ink/80 transition hover:bg-porcelain-ink/5"
                  >
                    Vider la liste
                  </button>
                )}
              </div>
            </div>

            <div className="mt-auto space-y-2 border-t border-dashed border-porcelain-ink/20 p-4 pt-5">
              <OnboardingTarget
                id="draw"
                active={
                  onboarding.isTourActive && onboarding.activeStep.id === "draw"
                }
              >
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setConfirmDrawOpen(true)}
                    disabled={!canRoll}
                    className="btn-press h-16 w-full bg-ticket font-display text-2xl font-extrabold uppercase tracking-wide text-ticket-ink shadow-[0_8px_18px_rgba(18,20,26,0.28)] hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-35 disabled:shadow-none"
                  >
                    {drawLabel}
                  </button>
                  <span className="absolute top-2 right-2">
                    <InfoBubble
                      tipId="draw"
                      openTip={onboarding.openTip}
                      onToggle={onboarding.showTip}
                      disabled={onboarding.isTourActive}
                      title="Tirage"
                      body="Choisit au hasard parmi les inscrits. Personne n’est tiré deux fois."
                      align="right"
                    />
                  </span>
                </div>
              </OnboardingTarget>
              {winners.length > 0 && (
                <button
                  type="button"
                  onClick={resetWinners}
                  className="h-10 w-full text-sm font-semibold text-porcelain-ink/55 transition hover:text-porcelain-ink"
                >
                  Effacer le tirage
                </button>
              )}
            </div>
          </section>
        </aside>

        <section className="order-1 flex min-h-[420px] flex-col overflow-hidden border border-border bg-desk-raised md:order-2 md:min-h-[min(640px,calc(100dvh-11rem))] md:max-h-[min(720px,calc(100dvh-11rem))]">
          <div className="flex items-end justify-between gap-4 bg-ticket px-5 py-4 text-ticket-ink md:px-6 md:py-5">
            <div>
              <p className="font-display text-sm font-bold uppercase tracking-[0.16em]">
                Inscrits
              </p>
            </div>
            <p
              key={participants.length}
              className="ticket-count count-pop font-display text-6xl font-extrabold leading-none md:text-7xl"
            >
              {String(participants.length).padStart(2, "0")}
            </p>
          </div>

          <div className="flex items-center justify-between border-b border-border px-5 py-3 md:px-6">
            <h2 className="font-display text-lg font-bold uppercase tracking-wide">
              Liste
            </h2>
            {isCapturing && (
              <span className="open-badge bg-punch px-2 py-1 text-xs font-bold uppercase tracking-wide text-punch-ink">
                Ouvert
              </span>
            )}
          </div>

          <div className="flex-1 overflow-auto p-3 md:p-4">
            {participants.length === 0 ? (
              <div className="flex h-full min-h-40 flex-col items-center justify-center gap-3 border border-dashed border-border px-6 text-center md:min-h-48">
                <p className="text-sm text-muted-foreground">
                  Personne pour l’instant.
                </p>
                <p className="text-sm text-muted-foreground">
                  Connecte le chat Twitch, ou lance une démonstration pour
                  tester le tirage seul.
                </p>
                {!isDemoMode && (
                  <button
                    type="button"
                    onClick={handleStartDemo}
                    className="mt-1 inline-flex items-center gap-1.5 border border-ticket px-3 py-2 text-xs font-extrabold uppercase tracking-wide text-ticket transition hover:bg-ticket hover:text-ticket-ink"
                  >
                    <FlaskConical className="size-3.5" aria-hidden />
                    Lancer la démonstration
                  </button>
                )}
                {isDemoMode && (
                  <button
                    type="button"
                    onClick={startDemo}
                    className="mt-1 inline-flex items-center gap-1.5 border border-ticket px-3 py-2 text-xs font-extrabold uppercase tracking-wide text-ticket transition hover:bg-ticket hover:text-ticket-ink"
                  >
                    <FlaskConical className="size-3.5" aria-hidden />
                    Recharger les inscrits
                  </button>
                )}
              </div>
            ) : (
              <ul className="space-y-2">
                {[...participants].reverse().map((participant, index) => {
                  const rank = participants.length - index;
                  const drawnRank = winnerRank(participant.username);
                  const isNewest = index === 0;
                  return (
                    <li
                      key={`${participant.username}-${participant.timestamp}`}
                      className={`ticket-stub stub-enter flex items-center gap-3 border border-porcelain-ink/10 bg-porcelain py-2.5 pr-3 pl-7 text-porcelain-ink ${
                        drawnRank ? "ring-2 ring-ticket" : ""
                      } ${isNewest && isCapturing ? "outline outline-2 outline-punch" : ""}`}
                    >
                      <span className="w-8 font-display text-sm font-bold tabular-nums text-porcelain-ink/45">
                        {String(rank).padStart(2, "0")}
                      </span>
                      <span className="min-w-0 flex-1 truncate font-semibold">
                        {participant.username}
                      </span>
                      <span className="hidden text-xs text-porcelain-ink/50 sm:inline">
                        {formatEntryTime(participant.timestamp)}
                      </span>
                      {drawnRank ? (
                        <span className="bg-ticket px-2 py-0.5 text-xs font-bold uppercase tracking-wide text-ticket-ink">
                          {winners.length > 1
                            ? `Gagnant ${drawnRank}`
                            : "Gagnant"}
                        </span>
                      ) : isNewest && isCapturing ? (
                        <span className="bg-punch px-2 py-0.5 text-xs font-bold uppercase tracking-wide text-punch-ink">
                          Nouveau
                        </span>
                      ) : null}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </section>
        </div>
      </main>

      <footer className="mx-auto flex w-full max-w-[1440px] flex-wrap items-center justify-between gap-2 px-4 py-4 text-xs text-muted-foreground md:px-6">
        <p>MIT · open source</p>
        <a
          href="https://github.com/Onivoid/rollaway"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 transition hover:text-ticket"
        >
          <Github className="size-3.5" aria-hidden />
          @Onivoid
        </a>
      </footer>

      <DrawConfirmModal
        open={confirmDrawOpen}
        participantCount={participants.length}
        winnerCount={effectiveWinnerCount}
        onWinnerCountChange={setWinnerCount}
        onCancel={() => setConfirmDrawOpen(false)}
        onConfirm={(count) => {
          setConfirmDrawOpen(false);
          rollWinners(count);
        }}
      />

      {winners.length > 0 && (
        <WinnerReveal
          key={winners.join("|")}
          winners={winners}
          onClose={resetWinners}
        />
      )}
    </div>
  );
}

function StatusChip({
  active,
  tone,
  idleLabel,
  activeLabel,
}: {
  active: boolean;
  tone: "live" | "punch" | "ticket";
  idleLabel: string;
  activeLabel: string;
}) {
  const activeClass =
    tone === "live"
      ? "border-live/40 bg-live/15 text-live"
      : tone === "punch"
        ? "border-punch bg-punch text-punch-ink"
        : "border-ticket bg-ticket text-ticket-ink";

  const dotClass =
    tone === "live"
      ? "bg-live"
      : tone === "punch"
        ? "bg-punch-ink"
        : "bg-ticket-ink";

  return (
    <span
      className={`inline-flex items-center gap-1.5 border px-2.5 py-1 text-xs font-bold uppercase tracking-wide ${
        active
          ? `${activeClass} ${tone !== "ticket" ? "chip-pulse" : ""}`
          : "border-border bg-desk-raised text-muted-foreground"
      }`}
    >
      <span
        className={`size-1.5 rounded-full ${
          active
            ? `${dotClass} ${tone === "live" || tone === "punch" ? "live-dot" : ""}`
            : "bg-muted-foreground"
        }`}
        aria-hidden
      />
      {active ? activeLabel : idleLabel}
    </span>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  placeholder,
  disabled,
  hint,
  tip,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  hint?: string;
  tip?: ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-2">
        <label
          htmlFor={id}
          className="block text-xs font-bold uppercase tracking-[0.12em] text-porcelain-ink/55"
        >
          {label}
        </label>
        {tip}
      </div>
      <input
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="h-11 w-full border border-porcelain-ink/15 bg-white px-3 text-sm text-porcelain-ink outline-none transition placeholder:text-porcelain-ink/35 focus:border-ticket disabled:cursor-not-allowed disabled:opacity-55"
      />
      {hint && (
        <p className="text-xs text-porcelain-ink/55">{hint}</p>
      )}
    </div>
  );
}
