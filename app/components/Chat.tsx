"use client";

import { FormEvent, useRef, useState } from "react";

type Message = { role: "user" | "assistant"; content: string };

const STARTERS = [
  "電車の音が好き",
  "Robloxで変なゲームを見つけた",
  "ソラシドエアーの画像作成して",
  "宿題がわからない",
  "今日なんとなくつまらない",
];

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    setError(null);
    setInput("");
    const next: Message[] = [...messages, { role: "user", content: trimmed }];
    setMessages(next);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      const data = (await res.json()) as { reply?: string; error?: string };
      if (!res.ok) throw new Error(data.error ?? "エラーが発生しました");
      setMessages([...next, { role: "assistant", content: data.reply ?? "" }]);
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
    } catch (e) {
      setError(e instanceof Error ? e.message : "エラーが発生しました");
      setMessages(messages);
      setInput(trimmed);
    } finally {
      setLoading(false);
    }
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    send(input);
  }

  return (
    <section className="mx-auto w-full max-w-2xl">
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-lg sm:p-6">
        <p className="mb-4 text-sm text-[var(--muted)]">まぎれこみ車掌 · preview</p>

        <div className="mb-4 max-h-[420px] space-y-4 overflow-y-auto pr-1">
          {messages.length === 0 && (
            <div className="space-y-2 text-sm text-[var(--muted)]">
              <p>きっかけ：</p>
              <div className="flex flex-wrap gap-2">
                {STARTERS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => send(s)}
                    className="rounded-full border border-[var(--border)] px-3 py-1.5 text-left text-[var(--text)] transition hover:border-[var(--accent)] hover:text-[var(--accent-soft)]"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m, i) => (
            <div
              key={i}
              className={
                m.role === "user"
                  ? "ml-8 rounded-2xl rounded-tr-sm bg-[#2a2433] px-4 py-3 text-sm"
                  : "mr-4 rounded-2xl rounded-tl-sm border border-[var(--border)] px-4 py-3 text-sm leading-relaxed"
              }
            >
              <span className="mb-1 block text-xs text-[var(--muted)]">
                {m.role === "user" ? "子ども" : "車掌"}
              </span>
              {m.content}
            </div>
          ))}

          {loading && (
            <p className="text-sm text-[var(--muted)]">車掌が考え中…</p>
          )}
          <div ref={bottomRef} />
        </div>

        {error && (
          <p className="mb-3 rounded-lg border border-red-900/50 bg-red-950/30 px-3 py-2 text-sm text-red-200">
            {error}
          </p>
        )}

        <form onSubmit={onSubmit} className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="話してみる…"
            disabled={loading}
            className="flex-1 rounded-xl border border-[var(--border)] bg-[var(--bg)] px-4 py-3 text-sm outline-none focus:border-[var(--accent)]"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="rounded-xl bg-[var(--accent)] px-5 py-3 text-sm font-medium text-[#2a1520] transition hover:opacity-90 disabled:opacity-40"
          >
            送信
          </button>
        </form>
      </div>
    </section>
  );
}
