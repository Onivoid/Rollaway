"use client";

import { GiveawayProvider } from "@/context/GiveawayContext";
import { GiveawayApp } from "@/components/custom/GiveawayApp";

export default function Home() {
  return (
    <GiveawayProvider>
      <GiveawayApp />
    </GiveawayProvider>
  );
}
