import { NOT_YET_SYSTEM_PROMPT } from "@/lib/not-yet-prompt";
import type { NotYetAnswers, NotYetResult } from "@/lib/not-yet-types";
import { detectSafety, safetyClosing } from "@/lib/safety";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

function answersText(a: NotYetAnswers): string {
  return [
    `Q1 時間を忘れてやってしまうこと: ${a.q1 || "わからない"}`,
    `Q2 つい見てしまうもの: ${a.q2 || "わからない"}`,
    `Q3 学校で好きな時間: ${a.q3 || "わからない"}`,
    `Q4 なんでこうなってるんだろうと思うもの: ${a.q4 || "わからない"}`,
    `Q5 好きなこと: ${(a.q5 ?? []).join("、") || "わからない"}`,
    `Q6 ちょっとだけ人より詳しいこと: ${a.q6 || "わからない"}`,
    `Q7 いまやってみたいこと: ${a.q7 || "わからない"}`,
  ].join("\n");
}

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

function parseResult(raw: string): NotYetResult | null {
  const trimmed = raw.trim().replace(/^```(?:json)?\s*|\s*```$/g, "");
  try {
    const obj = JSON.parse(trimmed) as Partial<NotYetResult>;
    if (!obj || typeof obj !== "object") return null;
    return {
      safetyHold: false,
      signals: {
        title: obj.signals?.title ?? "",
        summary: obj.signals?.summary ?? "",
        items: Array.isArray(obj.signals?.items) ? obj.signals.items.map(String) : [],
      },
      possibleWorlds: Array.isArray(obj.possibleWorlds)
        ? obj.possibleWorlds.slice(0, 5).map((w) => ({
            name: String(w?.name ?? ""),
            description: String(w?.description ?? ""),
            connection: String(w?.connection ?? ""),
          }))
        : [],
      notYetJobs: Array.isArray(obj.notYetJobs)
        ? obj.notYetJobs.slice(0, 4).map((j) => ({
            name: String(j?.name ?? ""),
            description: String(j?.description ?? ""),
            whyItConnects: String(j?.whyItConnects ?? ""),
          }))
        : [],
      tryThisWeek: Array.isArray(obj.tryThisWeek)
        ? obj.tryThisWeek.slice(0, 3).map((t) => ({
            title: String(t?.title ?? ""),
            description: String(t?.description ?? ""),
          }))
        : [],
      closingMessage: String(obj.closingMessage ?? ""),
    };
  } catch {
    return null;
  }
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
  if (kind === "self_harm" || kind === "crime") {
    return NextResponse.json(emptyResult(safetyClosing(kind)));
  }
  if (kind === "pii" || kind === "homework") {
    return NextResponse.json(emptyResult(safetyClosing(kind)));
  }

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
      temperature: 0.8,
      max_tokens: 1600,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: NOT_YET_SYSTEM_PROMPT },
        {
          role: "user",
          content:
            "次の子どもの答えから、まだ名前のない未来を探して。JSONだけ返して。\n\n" + blob,
        },
      ],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    return NextResponse.json({ error: err }, { status: 502 });
  }

  const data = (await res.json()) as {
    choices: { message: { content: string } }[];
  };
  const parsed = parseResult(data.choices[0]?.message?.content ?? "");
  if (!parsed) {
    return NextResponse.json(
      { error: "結果を読み取れませんでした。もう一度試してみてね。" },
      { status: 502 },
    );
  }

  return NextResponse.json(parsed);
}
