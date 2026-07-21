"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  CURRENT_USER_ID,
  channels as seedChannels,
  directMessages as seedDms,
  initialMessages,
} from "./data";
import type { Conversation, Message } from "./types";

type WorkspaceContextValue = {
  messages: Message[];
  channels: typeof seedChannels;
  directMessages: typeof seedDms;
  active: Conversation;
  threadRootId: string | null;
  sidebarOpen: boolean;
  setActive: (c: Conversation) => void;
  setThreadRootId: (id: string | null) => void;
  setSidebarOpen: (open: boolean) => void;
  sendMessage: (text: string, threadId?: string) => void;
  toggleReaction: (messageId: string, emoji: string) => void;
  clearUnread: (conversation: Conversation) => void;
};

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

function uid() {
  return `m-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [channels, setChannels] = useState(seedChannels);
  const [directMessages, setDirectMessages] = useState(seedDms);
  const [active, setActiveState] = useState<Conversation>({
    type: "channel",
    id: "c-general",
  });
  const [threadRootId, setThreadRootId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const clearUnread = useCallback((conversation: Conversation) => {
    if (conversation.type === "channel") {
      setChannels((prev) =>
        prev.map((c) =>
          c.id === conversation.id ? { ...c, unread: 0 } : c,
        ),
      );
    } else {
      setDirectMessages((prev) =>
        prev.map((d) =>
          d.id === conversation.id ? { ...d, unread: 0 } : d,
        ),
      );
    }
  }, []);

  const setActive = useCallback(
    (c: Conversation) => {
      setActiveState(c);
      setThreadRootId(null);
      setSidebarOpen(false);
      clearUnread(c);
    },
    [clearUnread],
  );

  const sendMessage = useCallback(
    (text: string, threadId?: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;

      const channelId = threadId
        ? messages.find((m) => m.id === threadId)?.channelId ?? active.id
        : active.id;

      const newMsg: Message = {
        id: uid(),
        channelId,
        userId: CURRENT_USER_ID,
        text: trimmed,
        createdAt: new Date().toISOString(),
        reactions: [],
        threadId,
      };

      setMessages((prev) => {
        const next = [...prev, newMsg];
        if (threadId) {
          return next.map((m) =>
            m.id === threadId
              ? { ...m, replyCount: (m.replyCount ?? 0) + 1 }
              : m,
          );
        }
        return next;
      });
    },
    [active.id, messages],
  );

  const toggleReaction = useCallback((messageId: string, emoji: string) => {
    setMessages((prev) =>
      prev.map((m) => {
        if (m.id !== messageId) return m;
        const existing = m.reactions.find((r) => r.emoji === emoji);
        if (existing) {
          const hasMe = existing.userIds.includes(CURRENT_USER_ID);
          const userIds = hasMe
            ? existing.userIds.filter((id) => id !== CURRENT_USER_ID)
            : [...existing.userIds, CURRENT_USER_ID];
          const reactions =
            userIds.length === 0
              ? m.reactions.filter((r) => r.emoji !== emoji)
              : m.reactions.map((r) =>
                  r.emoji === emoji ? { ...r, userIds } : r,
                );
          return { ...m, reactions };
        }
        return {
          ...m,
          reactions: [
            ...m.reactions,
            { emoji, userIds: [CURRENT_USER_ID] },
          ],
        };
      }),
    );
  }, []);

  const value = useMemo(
    () => ({
      messages,
      channels,
      directMessages,
      active,
      threadRootId,
      sidebarOpen,
      setActive,
      setThreadRootId,
      setSidebarOpen,
      sendMessage,
      toggleReaction,
      clearUnread,
    }),
    [
      messages,
      channels,
      directMessages,
      active,
      threadRootId,
      sidebarOpen,
      setActive,
      sendMessage,
      toggleReaction,
      clearUnread,
    ],
  );

  return (
    <WorkspaceContext.Provider value={value}>
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const ctx = useContext(WorkspaceContext);
  if (!ctx) throw new Error("useWorkspace must be used within WorkspaceProvider");
  return ctx;
}
