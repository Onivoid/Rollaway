"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

interface Participant {
  username: string;
  timestamp: number;
}

interface GiveawayContextType {
  participants: Participant[];
  command: string;
  setCommand: (cmd: string) => void;
  winnerCount: number;
  setWinnerCount: (count: number) => void;
  isCapturing: boolean;
  startCapture: () => void;
  stopCapture: () => void;
  addParticipant: (username: string) => void;
  clearParticipants: () => void;
  winners: string[];
  rollWinners: (count?: number) => void;
  resetWinners: () => void;
  isDemoMode: boolean;
  startDemo: () => void;
  stopDemo: () => void;
}

const GiveawayContext = createContext<GiveawayContextType | undefined>(
  undefined
);

const DEMO_NAMES = [
  "NightOwl_FR",
  "PixelMaraude",
  "NovaBande",
  "Chatouilleuse",
  "BlueLagoon",
  "kira_wave",
  "duskrunner",
  "luna_pixel",
  "FoxOnFire",
  "MiloStream",
  "Zael_TV",
  "PommeSucree",
  "HexaByte",
  "RouxGlitch",
  "VapeurRose",
];

function buildDemoParticipants(): Participant[] {
  const now = Date.now();
  return DEMO_NAMES.map((username, index) => ({
    username,
    timestamp: now - (DEMO_NAMES.length - index) * 18_000,
  }));
}

function pickUniqueWinners(pool: string[], count: number): string[] {
  const remaining = [...pool];
  const drawn: string[] = [];
  const take = Math.min(count, remaining.length);

  for (let i = 0; i < take; i += 1) {
    const index = Math.floor(Math.random() * remaining.length);
    drawn.push(remaining[index]);
    remaining.splice(index, 1);
  }

  return drawn;
}

export function GiveawayProvider({ children }: { children: ReactNode }) {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [command, setCommand] = useState("!giveaway");
  const [winnerCount, setWinnerCountState] = useState(1);
  const [isCapturing, setIsCapturing] = useState(false);
  const [winners, setWinners] = useState<string[]>([]);
  const [isDemoMode, setIsDemoMode] = useState(false);

  const setWinnerCount = useCallback((count: number) => {
    const next = Number.isFinite(count) ? Math.floor(count) : 1;
    setWinnerCountState(Math.max(1, next));
  }, []);

  const addParticipant = useCallback(
    (username: string) => {
      if (!isCapturing) return;

      setParticipants((prev) => {
        if (
          prev.some((p) => p.username.toLowerCase() === username.toLowerCase())
        ) {
          return prev;
        }
        return [...prev, { username, timestamp: Date.now() }];
      });
    },
    [isCapturing]
  );

  const startCapture = useCallback(() => setIsCapturing(true), []);
  const stopCapture = useCallback(() => setIsCapturing(false), []);
  const clearParticipants = useCallback(() => setParticipants([]), []);

  const rollWinners = useCallback(
    (count?: number) => {
      if (participants.length === 0) return;
      const names = participants.map((p) => p.username);
      const take = Math.min(
        Math.max(1, count ?? winnerCount),
        participants.length
      );
      setWinnerCountState(take);
      setWinners(pickUniqueWinners(names, take));
    },
    [participants, winnerCount]
  );

  const resetWinners = useCallback(() => setWinners([]), []);

  const startDemo = useCallback(() => {
    setIsDemoMode(true);
    setWinners([]);
    setWinnerCountState(1);
    setCommand("!giveaway");
    setParticipants(buildDemoParticipants());
    setIsCapturing(true);
  }, []);

  const stopDemo = useCallback(() => {
    setIsDemoMode(false);
    setParticipants([]);
    setWinners([]);
    setIsCapturing(false);
    setWinnerCountState(1);
  }, []);

  const contextValue = useMemo(
    () => ({
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
    }),
    [
      participants,
      command,
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
    ]
  );

  return (
    <GiveawayContext.Provider value={contextValue}>
      {children}
    </GiveawayContext.Provider>
  );
}

export function useGiveaway() {
  const context = useContext(GiveawayContext);
  if (context === undefined) {
    throw new Error("useGiveaway must be used within a GiveawayProvider");
  }
  return context;
}
