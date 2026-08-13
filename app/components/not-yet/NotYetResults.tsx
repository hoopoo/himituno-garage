import type { NotYetResult } from "@/lib/not-yet-types";
import Link from "next/link";

type Props = {
  result: NotYetResult;
  onRetry: () => void;
};

export default function NotYetResults({ result, onRetry }: Props) {
  if (result.safetyHold) {
    return (
      <main className="ny-page mx-auto min-h-screen max-w-xl px-4 pb-16 pt-12 sm:px-6">
        <p className="text-xs tracking-[0.3em] text-[var(--ny-muted)]">HOLD</p>
        <h1 className="mt-4 text-2xl font-medium leading-relaxed">いったん停車</h1>
        <p className="mt-6 text-base leading-relaxed text-[var(--accent-soft)]">
          {result.closingMessage}
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <button type="button" onClick={onRetry} className="ny-cta-secondary">
            もう一度やってみる
          </button>
          <Link href="/" className="ny-cta-secondary text-center">
            ひみつの車庫に戻る
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="ny-page mx-auto min-h-screen max-w-2xl px-4 pb-20 pt-10 sm:px-6 sm:pt-14">
      <p className="text-center text-xs tracking-[0.35em] text-[var(--ny-muted)]">
        NOT YET · RESULT
      </p>

      <section className="mt-10">
        <p className="text-xs tracking-[0.25em] text-[var(--ny-muted)]">01 YOUR SIGNALS</p>
        <h2 className="mt-2 text-xl font-medium sm:text-2xl">きみの中に見えるサイン</h2>
        {result.signals.title && (
          <p className="mt-4 text-lg text-[var(--ny-accent)]">{result.signals.title}</p>
        )}
        {result.signals.summary && (
          <p className="mt-3 text-sm leading-relaxed text-[var(--text)]">
            {result.signals.summary}
          </p>
        )}
        {result.signals.items.length > 0 && (
          <ul className="mt-5 flex flex-wrap gap-2">
            {result.signals.items.map((item) => (
              <li
                key={item}
                className="rounded-full border border-[var(--border)] px-3 py-1.5 text-sm text-[var(--accent-soft)]"
              >
                {item}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-14">
        <p className="text-xs tracking-[0.25em] text-[var(--ny-muted)]">
          02 POSSIBLE WORLDS
        </p>
        <h2 className="mt-2 text-xl font-medium sm:text-2xl">
          そこからつながる、いまある仕事
        </h2>
        <div className="mt-6 space-y-4">
          {result.possibleWorlds.map((w) => (
            <article
              key={w.name}
              className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-5 py-4"
            >
              <h3 className="text-base font-medium text-[var(--text)]">{w.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                {w.description}
              </p>
              {w.connection && (
                <p className="mt-3 text-sm leading-relaxed text-[var(--ny-accent)]">
                  {w.connection}
                </p>
              )}
            </article>
          ))}
        </div>
      </section>

      <section className="ny-jobs mt-16 rounded-3xl border border-[var(--ny-border)] px-5 py-8 sm:px-8 sm:py-10">
        <p className="text-xs tracking-[0.25em] text-[var(--ny-muted)]">
          03 NOT-YET-NAMED JOBS
        </p>
        <h2 className="mt-2 text-xl font-medium sm:text-2xl">まだ名前のない仕事</h2>
        <div className="mt-8 space-y-10">
          {result.notYetJobs.map((job, i) => (
            <article key={job.name}>
              <p className="text-xs tracking-[0.3em] text-[var(--ny-muted)]">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="ny-job-name mt-2 text-3xl font-bold leading-tight sm:text-4xl">
                {job.name}
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-[var(--text)] sm:text-base">
                {job.description}
              </p>
              {job.whyItConnects && (
                <p className="mt-3 text-sm leading-relaxed text-[var(--ny-accent)]">
                  {job.whyItConnects}
                </p>
              )}
            </article>
          ))}
        </div>
      </section>

      <section className="mt-14">
        <p className="text-xs tracking-[0.25em] text-[var(--ny-muted)]">04 TRY THIS WEEK</p>
        <h2 className="mt-2 text-xl font-medium sm:text-2xl">今週やってみよう</h2>
        <div className="mt-6 space-y-4">
          {result.tryThisWeek.map((t) => (
            <article
              key={t.title}
              className="rounded-2xl border border-[var(--border)] px-5 py-4"
            >
              <h3 className="text-base font-medium">{t.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                {t.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      {result.closingMessage && (
        <p className="mt-12 text-center text-sm leading-relaxed text-[var(--accent-soft)] sm:text-base">
          {result.closingMessage}
        </p>
      )}

      <aside
        role="note"
        className="mt-10 rounded-xl border border-[var(--warn-border)] bg-[var(--warn-bg)] px-5 py-4 text-sm leading-relaxed text-[var(--warn-text)]"
      >
        これは適職診断ではありません。いまの興味から見える可能性を、少し広げてみるための実験です。
      </aside>

      <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <button type="button" onClick={onRetry} className="ny-cta">
          もう一度やってみる
        </button>
        <Link href="/" className="ny-cta-secondary text-center">
          ひみつの車庫に戻る
        </Link>
      </div>
    </main>
  );
}
