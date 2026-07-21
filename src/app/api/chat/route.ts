import { NextResponse } from "next/server";
import { buildSystemPrompt } from "@/lib/personas";
import { localPersonaReply } from "@/lib/localReply";

export const runtime = "nodejs";

type ChatBody = {
  botUserId: string;
  history: { role: "user" | "assistant"; content: string }[];
  userText: string;
};

export async function POST(req: Request) {
  let body: ChatBody;
  try {
    body = (await req.json()) as ChatBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { botUserId, history = [], userText } = body;
  if (!botUserId || !userText?.trim()) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const openaiKey = process.env.OPENAI_API_KEY;
  const anthropicKey = process.env.ANTHROPIC_API_KEY;

  try {
    if (openaiKey) {
      const text = await replyOpenAI(openaiKey, botUserId, history, userText);
      return NextResponse.json({ text, provider: "openai" });
    }
    if (anthropicKey) {
      const text = await replyAnthropic(
        anthropicKey,
        botUserId,
        history,
        userText,
      );
      return NextResponse.json({ text, provider: "anthropic" });
    }
  } catch (err) {
    console.error("LLM reply failed, falling back", err);
  }

  const text = localPersonaReply({ botUserId, userText, history });
  return NextResponse.json({ text, provider: "local" });
}

async function replyOpenAI(
  key: string,
  botUserId: string,
  history: ChatBody["history"],
  userText: string,
) {
  const messages = [
    { role: "system", content: buildSystemPrompt(botUserId) },
    ...history.slice(-8).map((h) => ({
      role: h.role,
      content: h.content,
    })),
    { role: "user", content: userText },
  ];

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      temperature: 0.7,
      max_tokens: 180,
      messages,
    }),
  });

  if (!res.ok) {
    throw new Error(`OpenAI ${res.status}`);
  }
  const data = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  const text = data.choices?.[0]?.message?.content?.trim();
  if (!text) throw new Error("Empty OpenAI response");
  return text;
}

async function replyAnthropic(
  key: string,
  botUserId: string,
  history: ChatBody["history"],
  userText: string,
) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": key,
      "anthropic-version": "2023-06-01",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.ANTHROPIC_MODEL || "claude-3-5-haiku-latest",
      max_tokens: 180,
      system: buildSystemPrompt(botUserId),
      messages: [
        ...history.slice(-8).map((h) => ({
          role: h.role === "assistant" ? "assistant" : "user",
          content: h.content,
        })),
        { role: "user", content: userText },
      ],
    }),
  });

  if (!res.ok) {
    throw new Error(`Anthropic ${res.status}`);
  }
  const data = (await res.json()) as {
    content?: { type: string; text?: string }[];
  };
  const text = data.content?.find((c) => c.type === "text")?.text?.trim();
  if (!text) throw new Error("Empty Anthropic response");
  return text;
}
