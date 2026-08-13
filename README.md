# ひみつの車庫 — Vercel Preview

Web 版プレビュー（まぎれこみ車掌 v0.7.3 + NOT YET v0.2）

## Concept

ひみつの車庫は、子どもの「好き」「わからない」「作りたい」を、答えに閉じ込めず観察・言葉・制作につなげる小さなAI実験です。

**まぎれこみ車掌**は会話の案内人。  
**NOT YET**は、いまの興味から「まだ名前のない仕事」を一緒に探す体験です。適職診断ではありません。

## Architecture

```
web/
├── app/
│   ├── page.tsx                 # まぎれこみ車掌（既存）
│   ├── not-yet/page.tsx         # NOT YET
│   ├── api/chat/route.ts        # 車掌チャット API
│   └── api/not-yet/route.ts     # NOT YET 生成 API
├── lib/
│   ├── prompt.ts / system-prompt-local.txt
│   ├── not-yet-prompt.ts
│   ├── not-yet-types.ts
│   └── safety.ts                # PII / 自傷 / 犯罪 / 宿題答え
└── app/components/
    ├── Chat.tsx
    └── not-yet/
```

- Next.js App Router
- OpenAI API（`OPENAI_MODEL` 未指定時は `gpt-4o-mini`）
- DBなし・ログインなし

## Route

| Path | 体験 |
|------|------|
| `/` | まぎれこみ車掌 |
| `/not-yet` | NOT YET — まだ名前のない仕事を探そう |

## AI generation flow（NOT YET v0.2）

1. Landing → 「はじめる」
2. 7問を1問ずつ（session state のみ）
3. `POST /api/not-yet` に回答を送信
4. Safety check → 問題があれば停車メッセージのみ
5. OpenAI が JSON schema で生成（inferred signals / 領域 / 再結合した未来役割）
6. 品質セルフチェック → 未達なら **1回だけ** 再生成
7. Results: Signals / Possible Worlds / Not-yet-named Jobs / Try this week

Anti-literal: 入力名詞を「○○技術者」に直結しない。最低2つの signal を再結合する。

テスト: `npm run test:not-yet`

## Safety principles

- 自傷・犯罪・危険行為 → 未来職業は出さず、大人へ戻す（停車場）
- 宿題の答えは出さない
- 能力・人格・将来を断定しない（possibility language）

## Privacy principles

- 氏名・住所・学校名・電話・メールは入力しないよう UI で案内
- v0.1 は DB / アカウント / 永続メモリなし
- 回答はブラウザの React state のみ（リロードで消える）

## v0.1 / v0.2 limitations

実装しない: アカウント、永続メモリ、Supabase、SNS共有、ランキング、職業DB、保護者ダッシュボード、PDF、過去比較

## ローカル開発

```bash
cd ひみつの車庫/web
npm install
cp .env.example .env.local
# .env.local に OPENAI_API_KEY を設定
npm run dev
```

- 車掌: http://localhost:3000
- NOT YET: http://localhost:3000/not-yet

## Vercel デプロイ

1. [Vercel](https://vercel.com) で New Project
2. **Root Directory:** `ひみつの車庫/web`（リポジトリ全体を import する場合）
3. Environment Variables:
   - `OPENAI_API_KEY` — 必須
   - `OPENAI_MODEL` — 任意（デフォルト `gpt-4o-mini`）
4. Deploy

プロンプト更新時（車掌）:

```bash
npm run sync-prompt
git commit && git push
```

## 注意

- これは **local preview** です。本番のオフライン版は `local/garage-local-swallow`
- 子どもだけでの利用を想定していません（トップに注意書きあり）
- 宿題の答えは出さない設計（プロンプト v0.7.3）
- NOT YET は適職診断ではありません
