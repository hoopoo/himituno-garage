"use client";

import {
  EMPTY_ANSWERS,
  INTERESTS,
  type Interest,
  type NotYetAnswers,
} from "@/lib/not-yet-types";
import { useState } from "react";

type Props = {
  initial?: NotYetAnswers;
  onComplete: (answers: NotYetAnswers) => void;
  onBackHome: () => void;
};

const STEPS: { key: keyof NotYetAnswers; title: string; hint?: string }[] = [
  { key: "q1", title: "最近、時間を忘れてやってしまうことは？" },
  {
    key: "q2",
    title: "YouTubeやゲームなどで、つい見てしまうものは？",
  },
  { key: "q3", title: "学校で好きな時間は？" },
  {
    key: "q4",
    title: "「なんでこうなってるんだろう？」と思うものは？",
  },
  {
    key: "q5",
    title: "次の中ならどれが好き？",
    hint: "いくつ選んでも大丈夫。",
  },
  { key: "q6", title: "ちょっとだけ人より詳しいことは？" },
  { key: "q7", title: "いま、やってみたいことは？" },
];

export default function NotYetQuestions({ initial, onComplete, onBackHome }: Props) {
  const start = initial ?? EMPTY_ANSWERS;
  const startStep = start.q7 ? 6 : 0;
  const [step, setStep] = useState(startStep);
  const [answers, setAnswers] = useState<NotYetAnswers>(start);
  const [draft, setDraft] = useState(
    startStep === 6 ? start.q7 : start.q1,
  );

  const current = STEPS[step];
  const total = STEPS.length;
  const isMulti = current.key === "q5";
  const selected = answers.q5;

  function canNext() {
    if (isMulti) return selected.length > 0;
    return draft.trim().length > 0;
  }

  function goNext() {
    const nextAnswers = isMulti
      ? answers
      : { ...answers, [current.key]: draft.trim() };
    if (!isMulti) setAnswers(nextAnswers);

    if (step >= total - 1) {
      onComplete(nextAnswers);
      return;
    }
    const next = STEPS[step + 1];
    setStep(step + 1);
    if (next.key !== "q5") {
      setDraft(String(nextAnswers[next.key] ?? ""));
    }
  }

  function goBack() {
    const saved = isMulti ? answers : { ...answers, [current.key]: draft.trim() };
    if (!isMulti) setAnswers(saved);
    if (step === 0) {
      onBackHome();
      return;
    }
    const prev = STEPS[step - 1];
    setStep(step - 1);
    if (prev.key !== "q5") {
      setDraft(String(saved[prev.key] ?? ""));
    }
  }

  function toggleInterest(item: Interest) {
    const next = selected.includes(item)
      ? selected.filter((x) => x !== item)
      : [...selected, item];
    setAnswers({ ...answers, q5: next });
  }

  function markUnknown() {
    if (isMulti) {
      setAnswers({ ...answers, q5: ["わからない"] });
      return;
    }
    setDraft("わからない");
  }

  return (
    <main className="ny-page mx-auto min-h-screen max-w-xl px-4 pb-16 pt-8 sm:px-6 sm:pt-12">
      <p className="mb-6 text-sm tracking-widest text-[var(--ny-muted)]">
        {step + 1} / {total}
      </p>
      <div className="mb-8 h-1 overflow-hidden rounded-full bg-[var(--surface)]">
        <div
          className="h-full rounded-full bg-[var(--ny-accent)] transition-[width] duration-300"
          style={{ width: `${((step + 1) / total) * 100}%` }}
        />
      </div>

      <h2 className="text-xl font-medium leading-relaxed text-[var(--text)] sm:text-2xl">
        {current.title}
      </h2>
      {current.hint && (
        <p className="mt-2 text-sm text-[var(--muted)]">{current.hint}</p>
      )}

      <div className="mt-8">
        {isMulti ? (
          <div className="flex flex-wrap gap-2">
            {INTERESTS.map((item) => {
              const on = selected.includes(item);
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => toggleInterest(item)}
                  className={
                    on
                      ? "rounded-full border border-[var(--ny-accent)] bg-[var(--ny-accent)]/15 px-4 py-2 text-sm text-[var(--ny-accent)]"
                      : "rounded-full border border-[var(--border)] px-4 py-2 text-sm text-[var(--text)] hover:border-[var(--ny-accent)]"
                  }
                >
                  {item}
                </button>
              );
            })}
          </div>
        ) : (
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={4}
            placeholder="自由に書いていいよ"
            className="w-full resize-none rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm outline-none focus:border-[var(--ny-accent)]"
          />
        )}
      </div>

      <p className="mt-4 text-xs leading-relaxed text-[var(--muted)]">
        氏名・住所・学校名・電話番号・メールは書かないでね。「わからない」でも大丈夫。
      </p>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={goBack}
          className="rounded-xl border border-[var(--border)] px-4 py-3 text-sm text-[var(--muted)] hover:text-[var(--text)]"
        >
          {step === 0 ? "戻る" : "前へ"}
        </button>
        <button
          type="button"
          onClick={markUnknown}
          className="rounded-xl border border-[var(--border)] px-4 py-3 text-sm text-[var(--muted)] hover:text-[var(--text)]"
        >
          わからない
        </button>
        <button
          type="button"
          onClick={goNext}
          disabled={!canNext()}
          className="ml-auto rounded-xl bg-[var(--ny-accent)] px-5 py-3 text-sm font-medium text-[#0d1520] transition hover:opacity-90 disabled:opacity-40"
        >
          {step === total - 1 ? "未来を探す" : "次へ"}
        </button>
      </div>
    </main>
  );
}
