import { getSystemPrompt } from "@/lib/prompt";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

type Message = { role: "user" | "assistant"; content: string };

export async function POST(req: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "OPENAI_API_KEY が設定されていません。" },
      { status: 503 },
    );
  }

  const body = (await req.json()) as { messages?: Message[] };
  const messages = body.messages ?? [];
  if (messages.length === 0 || messages.length > 40) {
    return NextResponse.json({ error: "不正なリクエストです。" }, { status: 400 });
  }

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
      messages: [{ role: "system", content: getSystemPrompt() }, ...messages],
      temperature: 0.7,
      max_tokens: 220,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    return NextResponse.json({ error: err }, { status: 502 });
  }

  const data = (await res.json()) as {
    choices: { message: { content: string } }[];
  };
  const reply = data.choices[0]?.message?.content?.trim() ?? "";
  return NextResponse.json({ reply });
}
