# ひみつの車庫 — Vercel Preview

Web 版プレビュー（まぎれこみ車掌 v0.7.3）

## ローカル開発

```bash
cd ひみつの車庫/web
npm install
cp .env.example .env.local
# .env.local に OPENAI_API_KEY を設定
npm run dev
```

http://localhost:3000

## Vercel デプロイ

1. [Vercel](https://vercel.com) で New Project
2. **Root Directory:** `ひみつの車庫/web`（リポジトリ全体を import する場合）
3. Environment Variables:
   - `OPENAI_API_KEY` — 必須
   - `OPENAI_MODEL` — 任意（デフォルト `gpt-4o-mini`）
4. Deploy

プロンプト更新時：

```bash
npm run sync-prompt
git commit && git push
```

## 注意

- これは **local preview** です。本番のオフライン版は `local/garage-local-swallow`
- 子どもだけでの利用を想定していません（トップに注意書きあり）
- 宿題の答えは出さない設計（プロンプト v0.7.3）
