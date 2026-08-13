import Link from "next/link";
import Chat from "./components/Chat";

export default function Home() {
  return (
    <main className="mx-auto min-h-screen max-w-3xl px-4 pb-16 pt-10 sm:px-6 sm:pt-16">
      <header className="mb-10 text-center sm:mb-14">
        <h1 className="text-4xl font-bold leading-tight tracking-tight text-[var(--accent-soft)] sm:text-5xl md:text-6xl">
          ひみつの車庫
          <span className="mt-2 block text-2xl font-normal text-[var(--muted)] sm:text-3xl">
            local preview
          </span>
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-[var(--text)] sm:text-lg">
          子どもの発見を、観察・言葉・制作につなげる小さなAI実験
        </p>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-[var(--muted)] sm:text-base">
          これは、正解を急がず、子どもの「なんか変」「好き」「作りたい」をいったん受け止めるための車庫です。
        </p>
      </header>

      <aside
        role="note"
        className="mx-auto mb-10 max-w-2xl rounded-xl border border-[var(--warn-border)] bg-[var(--warn-bg)] px-5 py-4 text-sm leading-relaxed text-[var(--warn-text)] sm:text-base"
      >
        これは子どもだけで使わせる完成サービスではありません。保護者・先生が見守る前提の実験版です。宿題の答えは出しません。個人情報は入力しないでください。
      </aside>

      <p className="mx-auto mb-8 max-w-2xl text-center text-sm text-[var(--muted)]">
        <Link href="/not-yet" className="text-[var(--ny-accent)] underline-offset-4 hover:underline">
          NOT YET — まだ名前のない仕事を探そう
        </Link>
      </p>

      <Chat />

      <footer className="mt-10 text-center text-xs text-[var(--muted)]">
        v0.7.3 · まぎれこみ車掌 · preview
      </footer>
    </main>
  );
}
