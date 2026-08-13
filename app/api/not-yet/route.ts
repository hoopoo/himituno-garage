import { NOT_YET_RETRY_PROMPT, NOT_YET_SYSTEM_PROMPT } from "@/lib/not-yet-prompt";
import { evaluateQuality } from "@/lib/not-yet-quality";
import {
  answersText,
  type NotYetAnswers,
  type NotYetJob,
  type NotYetResult,
  type PossibleWorld,
} from "@/lib/not-yet-types";
import { detectSafety, safetyClosing } from "@/lib/safety";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

function emptyResult(closing: string): NotYetResult {
  return {
    safetyHold: true,
    signals: { title: "", summary: "", items: [] },
    possibleWorlds: [],
    notYetJobs: [],
    tryThisWeek: [],
    closingMessage: closing,
  };
}

function parseWorld(raw: unknown): PossibleWorld {
  const w = (raw ?? {}) as Record<string, unknown>;
  const examples = Array.isArray(w.examples)
    ? w.examples.map(String)
    : [];
  return {
    world: String(w.world ?? w.name ?? ""),
    description: String(w.description ?? ""),
    examples,
    connection: String(w.connection ?? ""),
  };
}

function parseJob(raw: unknown): NotYetJob {
  const j = (raw ?? {}) as Record<string, unknown>;
  const combined = Array.isArray(j.signalsCombined)
    ? j.signalsCombined.map(String)
    : [];
  return {
    name: String(j.name ?? ""),
    whatTheyDo: String(j.whatTheyDo ?? j.description ?? ""),
    signalsCombined: combined,
    futureChange: String(j.futureChange ?? ""),
    whyItMightExist: String(j.whyItMightExist ?? j.whyItConnects ?? ""),
  };
}

export function parseResult(raw: string): NotYetResult | null {
  const trimmed = raw.trim().replace(/^```(?:json)?\s*|\s*```$/g, "");
  try {
    const obj = JSON.parse(trimmed) as Partial<NotYetResult> & Record<string, unknown>;
    if (!obj || typeof obj !== "object") return null;
    return {
      safetyHold: false,
      signals: {
        title: obj.signals?.title ?? "",
        summary: obj.signals?.summary ?? "",
        items: Array.isArray(obj.signals?.items) ? obj.signals.items.map(String) : [],
      },
      possibleWorlds: Array.isArray(obj.possibleWorlds)
        ? obj.possibleWorlds.slice(0, 4).map(parseWorld)
        : [],
      notYetJobs: Array.isArray(obj.notYetJobs)
        ? obj.notYetJobs.slice(0, 3).map(parseJob)
        : [],
      tryThisWeek: Array.isArray(obj.tryThisWeek)
        ? obj.tryThisWeek.slice(0, 3).map((t) => ({
            title: String((t as { title?: string })?.title ?? ""),
            description: String((t as { description?: string })?.description ?? ""),
          }))
        : [],
      closingMessage: String(obj.closingMessage ?? ""),
    };
  } catch {
    return null;
  }
}

async function callModel(
  apiKey: string,
  blob: string,
  retryReasons?: string[],
): Promise<NotYetResult | null> {
  const messages: { role: "system" | "user"; content: string }[] = [
    { role: "system", content: NOT_YET_SYSTEM_PROMPT },
    {
      role: "user",
      content:
        "次の子どもの答えから、まだ名前のない未来を探して。JSONだけ返して。\n\n" + blob,
    },
  ];
  if (retryReasons?.length) {
    messages.push({
      role: "user",
      content: `${NOT_YET_RETRY_PROMPT}\n落ちた理由: ${retryReasons.join(" / ")}`,
    });
  }

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
      temperature: retryReasons ? 0.7 : 0.8,
      max_tokens: 2000,
      response_format: { type: "json_object" },
      messages,
    }),
  });

  if (!res.ok) return null;
  const data = (await res.json()) as {
    choices: { message: { content: string } }[];
  };
  return parseResult(data.choices[0]?.message?.content ?? "");
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "OPENAI_API_KEY が設定されていません。" },
      { status: 503 },
    );
  }

  const body = (await req.json()) as { answers?: NotYetAnswers };
  const answers = body.answers;
  if (!answers || typeof answers !== "object") {
    return NextResponse.json({ error: "不正なリクエストです。" }, { status: 400 });
  }

  const blob = answersText(answers);
  if (blob.length > 4000) {
    return NextResponse.json({ error: "入力が長すぎます。" }, { status: 400 });
  }

  const kind = detectSafety(blob);
  if (kind) {
    return NextResponse.json(emptyResult(safetyClosing(kind)));
  }

  const first = await callModel(apiKey, blob);
  if (!first) {
    return NextResponse.json(
      { error: "結果を読み取れませんでした。もう一度試してみてね。" },
      { status: 502 },
    );
  }

  const check = evaluateQuality(first, answers);
  if (check.ok) {
    return NextResponse.json(first);
  }

  const second = await callModel(apiKey, blob, check.reasons);
  return NextResponse.json(second ?? first);
}
