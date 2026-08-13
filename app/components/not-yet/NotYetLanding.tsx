import Link from "next/link";

type Props = { onStart: () => void };

export default function NotYetLanding({ onStart }: Props) {
  return (
    <main className="ny-page mx-auto min-h-screen max-w-3xl px-4 pb-16 pt-10 sm:px-6 sm:pt-16">
      <header className="mb-12 text-center sm:mb-16">
        <p className="mb-4 text-xs tracking-[0.35em] text-[var(--ny-muted)]">
          GARAGE · EXPERIMENT
        </p>
        <h1 className="ny-hero text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl">
          NOT YET
        </h1>
        <p className="mt-5 text-lg text-[var(--accent-soft)] sm:text-xl">
          まだ名前のない仕事を探そう。
        </p>
      </header>

      <div className="mx-auto max-w-lg space-y-5 text-center text-base leading-relaxed text-[var(--text)] sm:text-lg">
        <p>将来の仕事を、いま決めなくていい。</p>
        <p>
          きみがつい見てしまうもの。
          <br />
          時間を忘れてしまうこと。
          <br />
          なんだか気になること。
        </p>
        <p>
          そこから、
          <br />
          まだ名前のない未来を探してみよう。
        </p>
      </div>

      <div className="mt-12 flex flex-col items-center gap-4">
        <button type="button" onClick={onStart} className="ny-cta">
          はじめる
        </button>
        <p className="max-w-sm text-center text-sm leading-relaxed text-[var(--muted)]">
          正解はありません。
          <br />
          「わからない」も立派な答えです。
        </p>
      </div>

      <aside
        role="note"
        className="mx-auto mt-10 max-w-xl rounded-xl border border-[var(--warn-border)] bg-[var(--warn-bg)] px-5 py-4 text-sm leading-relaxed text-[var(--warn-text)]"
      >
        氏名・住所・学校名・電話番号・メールアドレスは入力しないでください。答えはブラウザの中だけに残ります。
      </aside>

      <p className="mt-10 text-center text-sm text-[var(--muted)]">
        <Link href="/" className="underline-offset-4 hover:text-[var(--accent-soft)] hover:underline">
          ひみつの車庫に戻る
        </Link>
      </p>
    </main>
  );
}
