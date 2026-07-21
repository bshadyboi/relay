"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  clearSession,
  clearShift,
  loadPrefs,
  loadSession,
  loadShift,
  savePrefs,
  saveSession,
  saveShift,
} from "./auth";
import {
  channels as seedChannels,
  directMessages as seedDms,
  getUser,
  incidents as seedIncidents,
  initialMessages,
  users as seedUsers,
  vehicles as seedVehicles,
} from "./data";
import { LIVE_EVENTS } from "./liveTraffic";
import { extractMentionUserIds } from "./parseMessage";
import { pickReplyTarget } from "./personas";
import { playAlertSound } from "./sound";
import type {
  AlertToast,
  AppScreen,
  Conversation,
  DetailTarget,
  Incident,
  IncidentStage,
  Message,
  Presence,
  SessionUser,
  ShiftMetrics,
  User,
  Vehicle,
} from "./types";

type WorkspaceContextValue = {
  screen: AppScreen;
  session: SessionUser | null;
  currentUserId: string;
  users: User[];
  messages: Message[];
  channels: typeof seedChannels;
  directMessages: typeof seedDms;
  incidents: Incident[];
  vehicles: Vehicle[];
  active: Conversation;
  threadRootId: string | null;
  sidebarOpen: boolean;
  detail: DetailTarget;
  runbooksOpen: boolean;
  searchOpen: boolean;
  pinsOpen: boolean;
  rosterOpen: boolean;
  mentionsOpen: boolean;
  statusPickerOpen: boolean;
  profileUserId: string | null;
  focusMessageId: string | null;
  liveTrafficOn: boolean;
  soundOn: boolean;
  botsEnabled: boolean;
  typingUserIds: string[];
  alerts: AlertToast[];
  mentionCount: number;
  mentionMessages: Message[];
  shift: ShiftMetrics | null;
  handoffNotes: string;
  login: (user: SessionUser) => void;
  logout: () => void;
  clockIn: () => void;
  endShift: (notes: string) => void;
  continueShift: () => void;
  setHandoffNotes: (notes: string) => void;
  requestHandoff: () => void;
  setActive: (c: Conversation) => void;
  setThreadRootId: (id: string | null) => void;
  setSidebarOpen: (open: boolean) => void;
  setDetail: (d: DetailTarget) => void;
  setRunbooksOpen: (open: boolean) => void;
  setSearchOpen: (open: boolean) => void;
  setPinsOpen: (open: boolean) => void;
  setRosterOpen: (open: boolean) => void;
  setMentionsOpen: (open: boolean) => void;
  setStatusPickerOpen: (open: boolean) => void;
  setProfileUserId: (id: string | null) => void;
  setLiveTrafficOn: (on: boolean) => void;
  setSoundOn: (on: boolean) => void;
  setBotsEnabled: (on: boolean) => void;
  setFocusMessageId: (id: string | null) => void;
  jumpToMessage: (messageId: string) => void;
  setCustomStatus: (status: string, presence: Presence) => void;
  openDm: (userId: string) => void;
  dismissAlert: (id: string) => void;
  sendMessage: (text: string, threadId?: string, attachmentName?: string) => void;
  toggleReaction: (messageId: string, emoji: string) => void;
  togglePin: (messageId: string) => void;
  acknowledgeIncident: (id: string) => void;
  resolveIncident: (id: string) => void;
  setAssistStatus: (on: boolean) => void;
  clearUnread: (conversation: Conversation) => void;
};

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

function uid(prefix = "m") {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [screen, setScreen] = useState<AppScreen>("login");
  const [session, setSession] = useState<SessionUser | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [users, setUsers] = useState(seedUsers);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [channels, setChannels] = useState(seedChannels);
  const [directMessages, setDirectMessages] = useState(seedDms);
  const [incidents, setIncidents] = useState(seedIncidents);
  const [vehicles] = useState(seedVehicles);
  const [active, setActiveState] = useState<Conversation>({
    type: "channel",
    id: "c-fleet-ops",
  });
  const [threadRootId, setThreadRootId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [detail, setDetail] = useState<DetailTarget>(null);
  const [runbooksOpen, setRunbooksOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [pinsOpen, setPinsOpen] = useState(false);
  const [rosterOpen, setRosterOpen] = useState(false);
  const [mentionsOpen, setMentionsOpen] = useState(false);
  const [statusPickerOpen, setStatusPickerOpen] = useState(false);
  const [profileUserId, setProfileUserId] = useState<string | null>(null);
  const [focusMessageId, setFocusMessageId] = useState<string | null>(null);
  const [liveTrafficOn, setLiveTrafficOnState] = useState(true);
  const [soundOn, setSoundOnState] = useState(true);
  const [botsEnabled, setBotsEnabled] = useState(true);
  const [typingUserIds, setTypingUserIds] = useState<string[]>([]);
  const [alerts, setAlerts] = useState<AlertToast[]>([]);
  const [shift, setShift] = useState<ShiftMetrics | null>(null);
  const [handoffNotes, setHandoffNotes] = useState("");
  const [liveIndex, setLiveIndex] = useState(0);
  const activeRef = useRef(active);
  const threadRef = useRef(threadRootId);
  const soundRef = useRef(soundOn);
  const messagesRef = useRef(messages);
  const botsRef = useRef(botsEnabled);

  useEffect(() => {
    activeRef.current = active;
  }, [active]);
  useEffect(() => {
    threadRef.current = threadRootId;
  }, [threadRootId]);
  useEffect(() => {
    soundRef.current = soundOn;
  }, [soundOn]);
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);
  useEffect(() => {
    botsRef.current = botsEnabled;
  }, [botsEnabled]);

  useEffect(() => {
    const existing = loadSession();
    const prefs = loadPrefs();
    setLiveTrafficOnState(prefs.liveTrafficOn);
    setSoundOnState(prefs.soundOn);
    if (existing) {
      setSession(existing);
      const savedShift = loadShift();
      setShift(
        savedShift ?? {
          startedAt: new Date().toISOString(),
          messagesSent: 0,
          incidentsAcknowledged: 0,
          assists: 0,
        },
      );
      setScreen("workspace");
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!shift) return;
    saveShift(shift);
  }, [shift]);

  const setLiveTrafficOn = useCallback((on: boolean) => {
    setLiveTrafficOnState(on);
    savePrefs({ ...loadPrefs(), liveTrafficOn: on });
  }, []);

  const setSoundOn = useCallback((on: boolean) => {
    setSoundOnState(on);
    savePrefs({ ...loadPrefs(), soundOn: on });
  }, []);

  const pushAlert = useCallback((alert: Omit<AlertToast, "id">) => {
    setAlerts((prev) => [...prev, { id: uid("alert"), ...alert }]);
    if (
      soundRef.current &&
      (alert.type === "pager" || alert.type === "incident")
    ) {
      playAlertSound();
    }
  }, []);

  useEffect(() => {
    if (!hydrated || screen !== "workspace") return;
    const t = window.setTimeout(() => {
      pushAlert({
        type: "pager",
        title: "PagerDuty · HD-4421",
        body: "ZX-1134 telemetry gap still open — eng on-call escalation window.",
      });
    }, 12000);
    return () => window.clearTimeout(t);
  }, [hydrated, screen, pushAlert]);

  useEffect(() => {
    if (!hydrated || screen !== "workspace" || !liveTrafficOn) return;
    if (liveIndex >= LIVE_EVENTS.length) return;

    const quiet = !!threadRef.current;
    const delay = (quiet ? 22000 : 9000) + (liveIndex % 3) * (quiet ? 6000 : 4000);
    const t = window.setTimeout(() => {
      const event = LIVE_EVENTS[liveIndex];
      const viewing =
        activeRef.current.type === "channel" &&
        activeRef.current.id === event.channelId;

      setMessages((prev) => [
        ...prev,
        {
          id: uid("live"),
          channelId: event.channelId,
          userId: event.userId,
          text: event.text,
          createdAt: new Date().toISOString(),
          reactions: [],
        },
      ]);

      if (event.bumpUnread && !viewing) {
        setChannels((prev) =>
          prev.map((c) =>
            c.id === event.channelId
              ? { ...c, unread: (c.unread ?? 0) + 1 }
              : c,
          ),
        );
      }

      if (event.alert) {
        pushAlert(event.alert);
      }

      setLiveIndex((i) => i + 1);
    }, delay);

    return () => window.clearTimeout(t);
  }, [hydrated, screen, liveTrafficOn, liveIndex, pushAlert]);

  const currentUserId = session?.userId ?? "u1";

  const mentionMessages = useMemo(() => {
    const handle = getUser(currentUserId)?.displayName;
    if (!handle) return [] as Message[];
    const needle = `@${handle.toLowerCase()}`;
    return messages
      .filter(
        (m) =>
          !m.threadId &&
          m.userId !== currentUserId &&
          m.text.toLowerCase().includes(needle),
      )
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
  }, [messages, currentUserId]);

  const mentionCount = mentionMessages.length;

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

  const login = useCallback((user: SessionUser) => {
    saveSession(user);
    setSession(user);
    setScreen("clock-in");
  }, []);

  const logout = useCallback(() => {
    clearSession();
    clearShift();
    setSession(null);
    setShift(null);
    setScreen("login");
  }, []);

  const clockIn = useCallback(() => {
    const next = {
      startedAt: new Date().toISOString(),
      messagesSent: 0,
      incidentsAcknowledged: 0,
      assists: 0,
    };
    setShift(next);
    saveShift(next);
    setScreen("workspace");
    pushAlert({
      type: "info",
      title: "Shift started",
      body: "Clocked in at 1600 Bryant St · Bay coverage live.",
    });
  }, [pushAlert]);

  const requestHandoff = useCallback(() => setScreen("handoff"), []);
  const continueShift = useCallback(() => setScreen("workspace"), []);

  const endShift = useCallback(
    (notes: string) => {
      if (notes.trim()) {
        setMessages((prev) => [
          ...prev,
          {
            id: uid(),
            channelId: "c-shift",
            userId: currentUserId,
            text: `Handoff @ 1600 Bryant:\n${notes.trim()}`,
            createdAt: new Date().toISOString(),
            reactions: [],
            pinned: true,
          },
        ]);
      }
      clearSession();
      clearShift();
      setSession(null);
      setShift(null);
      setHandoffNotes("");
      setScreen("login");
    },
    [currentUserId],
  );

  const requestBotReply = useCallback(
    async (opts: {
      botUserId: string;
      channelId: string;
      threadId?: string;
      userText: string;
    }) => {
      if (!botsRef.current) return;
      const { botUserId, channelId, threadId, userText } = opts;

      setTypingUserIds((prev) =>
        prev.includes(botUserId) ? prev : [...prev, botUserId],
      );

      const history = messagesRef.current
        .filter(
          (m) =>
            m.channelId === channelId &&
            (threadId ? m.threadId === threadId || m.id === threadId : !m.threadId),
        )
        .slice(-10)
        .map((m) => ({
          role:
            m.userId === botUserId
              ? ("assistant" as const)
              : ("user" as const),
          content: m.text,
        }));

      try {
        await new Promise((r) =>
          setTimeout(r, 700 + Math.floor(Math.random() * 900)),
        );

        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            botUserId,
            userText,
            history,
          }),
        });
        const data = (await res.json()) as { text?: string };
        const reply = data.text?.trim();
        if (!reply) return;

        setMessages((prev) => {
          const next = [
            ...prev,
            {
              id: uid("bot"),
              channelId,
              userId: botUserId,
              text: reply,
              createdAt: new Date().toISOString(),
              reactions: [],
              threadId,
            },
          ];
          if (threadId) {
            return next.map((m) =>
              m.id === threadId
                ? { ...m, replyCount: (m.replyCount ?? 0) + 1 }
                : m,
            );
          }
          return next;
        });
      } catch (err) {
        console.error("Bot reply failed", err);
      } finally {
        setTypingUserIds((prev) => prev.filter((id) => id !== botUserId));
      }
    },
    [],
  );

  const sendMessage = useCallback(
    (text: string, threadId?: string, attachmentName?: string) => {
      const trimmed = text.trim();
      if (!trimmed && !attachmentName) return;

      const channelId = threadId
        ? (messages.find((m) => m.id === threadId)?.channelId ?? active.id)
        : active.id;

      const body =
        trimmed ||
        (attachmentName ? `Attached ${attachmentName}` : "");

      const newMsg: Message = {
        id: uid(),
        channelId,
        userId: currentUserId,
        text: body,
        createdAt: new Date().toISOString(),
        reactions: [],
        threadId,
        attachmentName,
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

      setShift((s) =>
        s ? { ...s, messagesSent: s.messagesSent + 1 } : s,
      );

      const mentions = extractMentionUserIds(body, currentUserId);
      if (mentions.length) {
        setAlerts((prev) => [
          ...prev,
          {
            id: uid("alert"),
            type: "info",
            title: "Mention sent",
            body: `Notified ${mentions.length} operator${mentions.length > 1 ? "s" : ""}.`,
          },
        ]);
      }

      const dm = directMessages.find((d) => d.id === channelId);
      const botUserId = pickReplyTarget({
        channelId,
        text: body,
        currentUserId,
        mentionedUserIds: mentions,
        dmPartnerId: dm?.userId,
      });

      if (botUserId && botsRef.current && trimmed) {
        void requestBotReply({
          botUserId,
          channelId,
          threadId,
          userText: body,
        });
      }
    },
    [
      active.id,
      messages,
      currentUserId,
      directMessages,
      requestBotReply,
    ],
  );

  const toggleReaction = useCallback(
    (messageId: string, emoji: string) => {
      setMessages((prev) =>
        prev.map((m) => {
          if (m.id !== messageId) return m;
          const existing = m.reactions.find((r) => r.emoji === emoji);
          if (existing) {
            const hasMe = existing.userIds.includes(currentUserId);
            const userIds = hasMe
              ? existing.userIds.filter((id) => id !== currentUserId)
              : [...existing.userIds, currentUserId];
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
              { emoji, userIds: [currentUserId] },
            ],
          };
        }),
      );
    },
    [currentUserId],
  );

  const togglePin = useCallback((messageId: string) => {
    setMessages((prev) =>
      prev.map((m) =>
        m.id === messageId ? { ...m, pinned: !m.pinned } : m,
      ),
    );
  }, []);

  const acknowledgeIncident = useCallback(
    (id: string) => {
      setIncidents((prev) =>
        prev.map((i) => {
          if (i.id !== id) return i;
          const stage: IncidentStage =
            i.stage === "open" ? "acknowledged" : i.stage;
          return {
            ...i,
            stage,
            updatedAt: new Date().toISOString(),
          };
        }),
      );
      setShift((s) =>
        s
          ? {
              ...s,
              incidentsAcknowledged: s.incidentsAcknowledged + 1,
            }
          : s,
      );
      pushAlert({
        type: "incident",
        title: "Incident acknowledged",
        body: "Ticket moved to acknowledged.",
      });
    },
    [pushAlert],
  );

  const resolveIncident = useCallback((id: string) => {
    setIncidents((prev) =>
      prev.map((i) =>
        i.id === id
          ? {
              ...i,
              stage: "resolved" as const,
              updatedAt: new Date().toISOString(),
            }
          : i,
      ),
    );
  }, []);

  const setAssistStatus = useCallback(
    (on: boolean) => {
      setUsers((prev) =>
        prev.map((u) =>
          u.id === currentUserId
            ? {
                ...u,
                presence: on ? "assist" : "active",
                status: on ? "Remote assist in progress" : "On shift · Bay-2",
              }
            : u,
        ),
      );
      if (on) {
        setShift((s) => (s ? { ...s, assists: s.assists + 1 } : s));
      }
    },
    [currentUserId],
  );

  const setCustomStatus = useCallback(
    (status: string, presence: Presence) => {
      setUsers((prev) =>
        prev.map((u) =>
          u.id === currentUserId ? { ...u, status, presence } : u,
        ),
      );
      if (presence === "assist") {
        setShift((s) => (s ? { ...s, assists: s.assists + 1 } : s));
      }
    },
    [currentUserId],
  );

  const jumpToMessage = useCallback(
    (messageId: string) => {
      const msg = messages.find((m) => m.id === messageId);
      if (!msg) return;
      const isDm = msg.channelId.startsWith("dm-");
      setActive(
        isDm
          ? { type: "dm", id: msg.channelId }
          : { type: "channel", id: msg.channelId },
      );
      setMentionsOpen(false);
      setFocusMessageId(messageId);
      window.setTimeout(() => setFocusMessageId(null), 2600);
    },
    [messages, setActive],
  );

  const openDm = useCallback(
    (userId: string) => {
      const existing = directMessages.find((d) => d.userId === userId);
      if (existing) {
        setActive({ type: "dm", id: existing.id });
      } else {
        const id = `dm-${userId}`;
        setDirectMessages((prev) => [...prev, { id, userId }]);
        setActive({ type: "dm", id });
      }
      setRosterOpen(false);
      setProfileUserId(null);
    },
    [directMessages, setActive],
  );

  const dismissAlert = useCallback((id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const value = useMemo(
    () => ({
      screen: hydrated ? screen : "login",
      session,
      currentUserId,
      users,
      messages,
      channels,
      directMessages,
      incidents,
      vehicles,
      active,
      threadRootId,
      sidebarOpen,
      detail,
      runbooksOpen,
      searchOpen,
      pinsOpen,
      rosterOpen,
      mentionsOpen,
      statusPickerOpen,
      profileUserId,
      focusMessageId,
      liveTrafficOn,
      soundOn,
      botsEnabled,
      typingUserIds,
      alerts,
      mentionCount,
      mentionMessages,
      shift,
      handoffNotes,
      login,
      logout,
      clockIn,
      endShift,
      continueShift,
      setHandoffNotes,
      requestHandoff,
      setActive,
      setThreadRootId,
      setSidebarOpen,
      setDetail,
      setRunbooksOpen,
      setSearchOpen,
      setPinsOpen,
      setRosterOpen,
      setMentionsOpen,
      setStatusPickerOpen,
      setProfileUserId,
      setLiveTrafficOn,
      setSoundOn,
      setBotsEnabled,
      setFocusMessageId,
      jumpToMessage,
      setCustomStatus,
      openDm,
      dismissAlert,
      sendMessage,
      toggleReaction,
      togglePin,
      acknowledgeIncident,
      resolveIncident,
      setAssistStatus,
      clearUnread,
    }),
    [
      hydrated,
      screen,
      session,
      currentUserId,
      users,
      messages,
      channels,
      directMessages,
      incidents,
      vehicles,
      active,
      threadRootId,
      sidebarOpen,
      detail,
      runbooksOpen,
      searchOpen,
      pinsOpen,
      rosterOpen,
      mentionsOpen,
      statusPickerOpen,
      profileUserId,
      focusMessageId,
      liveTrafficOn,
      soundOn,
      botsEnabled,
      typingUserIds,
      alerts,
      mentionCount,
      mentionMessages,
      shift,
      handoffNotes,
      login,
      logout,
      clockIn,
      endShift,
      continueShift,
      requestHandoff,
      setActive,
      sendMessage,
      toggleReaction,
      togglePin,
      acknowledgeIncident,
      resolveIncident,
      setAssistStatus,
      clearUnread,
      dismissAlert,
      openDm,
      setLiveTrafficOn,
      setSoundOn,
      jumpToMessage,
      setCustomStatus,
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
