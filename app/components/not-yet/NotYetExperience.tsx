"use client";

import { EMPTY_ANSWERS, type NotYetAnswers, type NotYetResult } from "@/lib/not-yet-types";
import { useState } from "react";
import NotYetLanding from "./NotYetLanding";
import NotYetQuestions from "./NotYetQuestions";
import NotYetResults from "./NotYetResults";

type Phase = "landing" | "questions" | "generating" | "results";

export default function NotYetExperience() {
  const [phase, setPhase] = useState<Phase>("landing");
  const [savedAnswers, setSavedAnswers] = useState<NotYetAnswers>(EMPTY_ANSWERS);
  const [result, setResult] = useState<NotYetResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function generate(next: NotYetAnswers) {
    setSavedAnswers(next);
    setPhase("generating");
    setError(null);
    try {
      const res = await fetch("/api/not-yet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: next }),
      });
      const data = (await res.json()) as NotYetResult & { error?: string };
      if (!res.ok) throw new Error(data.error ?? "うまく探せなかったよ");
      setResult(data);
      setPhase("results");
    } catch (e) {
      setError(e instanceof Error ? e.message : "うまく探せなかったよ");
      setPhase("questions");
    }
  }

  function retry() {
    setSavedAnswers(EMPTY_ANSWERS);
    setResult(null);
    setError(null);
    setPhase("landing");
  }

  if (phase === "landing") {
    return <NotYetLanding onStart={() => setPhase("questions")} />;
  }

  if (phase === "generating") {
    return (
      <main className="ny-page mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center px-4 text-center">
        <p className="text-xs tracking-[0.35em] text-[var(--ny-muted)]">SEARCHING</p>
        <h1 className="ny-hero mt-6 text-4xl font-bold sm:text-5xl">NOT YET</h1>
        <p className="mt-6 text-sm leading-relaxed text-[var(--muted)]">
          きみのサインから、まだ名前のない未来を探しています。
        </p>
      </main>
    );
  }

  if (phase === "results" && result) {
    return <NotYetResults result={result} onRetry={retry} />;
  }

  return (
    <>
      {error && (
        <p className="mx-auto max-w-xl px-4 pt-6 text-sm text-red-200">{error}</p>
      )}
      <NotYetQuestions
        initial={savedAnswers}
        onComplete={generate}
        onBackHome={() => setPhase("landing")}
      />
    </>
  );
}
