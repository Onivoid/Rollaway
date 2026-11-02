"use client";

import { useEffect, useRef, useState } from "react";
import tmi from "tmi.js";

interface UseTwitchChatOptions {
  channel: string;
  onMessage: (
    username: string,
    message: string,
    tags: tmi.ChatUserstate
  ) => void;
}

export function useTwitchChat({ channel, onMessage }: UseTwitchChatOptions) {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const clientRef = useRef<tmi.Client | null>(null);
  const onMessageRef = useRef(onMessage);

  useEffect(() => {
    onMessageRef.current = onMessage;
  }, [onMessage]);

  const disconnectFromChat = () => {
    if (clientRef.current) {
      clientRef.current.disconnect();
      clientRef.current = null;
      setIsConnected(false);
    }
  };

  const connectToChat = () => {
    if (!channel) {
      setError("Veuillez entrer un nom de chaîne");
      return;
    }

    try {
      disconnectFromChat();

      const client = new tmi.Client({
        options: { debug: false },
        connection: {
          reconnect: true,
          secure: true,
        },
        channels: [channel],
      });

      client.on("message", (_channelName, tags, message, self) => {
        if (self) return;
        const username = tags.username || tags["display-name"] || "anonyme";
        onMessageRef.current(username, message, tags);
      });

      client.on("connected", () => {
        setIsConnected(true);
        setError(null);
      });

      client.on("disconnected", () => {
        setIsConnected(false);
      });

      client.connect().catch((err: Error) => {
        setError(`Erreur de connexion: ${err.message}`);
        setIsConnected(false);
      });

      clientRef.current = client;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "erreur inconnue";
      setError(`Erreur: ${message}`);
    }
  };

  useEffect(() => {
    return () => {
      disconnectFromChat();
    };
  }, []);

  return {
    isConnected,
    error,
    connectToChat,
    disconnectFromChat,
  };
}
