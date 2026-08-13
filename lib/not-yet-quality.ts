import type { NotYetAnswers, NotYetResult } from "./not-yet-types";

const STOP = new Set([
  "わからない",
  "作る",
  "調べる",
  "話す",
  "直す",
  "集める",
  "観察する",
  "好き",
  "こと",
  "もの",
  "時間",
  "学校",
  "youtube",
  "ゲーム",
  "動画",
  "ちょっと",
  "いま",
  "やってみたい",
]);

const LITERAL_SUFFIX =
  /(技術者|エンジニア|デザイナー|専門家|研究家|職人|屋|博士)$/;

const DIAGNOSIS =
  /向いている|向いてる|あなたは.{0,12}型|才能は|なるべき|適職|○○型/;

const ACTION =
  /観察|作る|つく|描|記録|比べ|聞く|実験|測|集める|飛ば|折|歩く|数える|撮|メモ|並べ/;

const SEARCH_ONLY = /調べよう|検索|仕事内容を調/;

export type QualityReport = {
  ok: boolean;
  reasons: string[];
};

export function extractNouns(answers: NotYetAnswers): string[] {
  const parts = [
    answers.q1,
    answers.q2,
    answers.q3,
    answers.q4,
    ...(answers.q5 ?? []),
    answers.q6,
    answers.q7,
  ]
    .join(" ")
    .split(/[\s、。・\/／,.!?！？「」『』（）()をがはにでとものもへ]+/)
    .map((t) => t.trim())
    .filter((t) => {
      if (!t || STOP.has(t.toLowerCase()) || STOP.has(t)) return false;
      if (/[\u3040-\u30ff\u4e00-\u9faf]/.test(t)) return t.length >= 1;
      return t.length >= 2;
    });

  return [...new Set(parts)];
}

export function isLiteralJobName(name: string, nouns: string[]): boolean {
  const compact = name.replace(/\s+/g, "");
  const m = compact.match(new RegExp(`^(.+?)${LITERAL_SUFFIX.source}`));
  if (m) {
    const stem = m[1];
    if (
      stem.length >= 1 &&
      nouns.some((noun) => noun.includes(stem) || stem.includes(noun))
    ) {
      return true;
    }
  }
  return nouns.some((noun) => noun.length >= 2 && compact === noun);
}

export function isInputCopy(text: string, answers: NotYetAnswers): boolean {
  const blob = [
    answers.q1,
    answers.q2,
    answers.q3,
    answers.q4,
    answers.q6,
    answers.q7,
  ]
    .map((s) => s.trim())
    .filter(Boolean);
  const t = text.trim();
  if (t.length < 2) return true;
  return blob.some((a) => a === t || t === `${a}が好き` || t === `${a}が好き。`);
}

export function evaluateQuality(
  result: NotYetResult,
  answers: NotYetAnswers,
): QualityReport {
  const reasons: string[] = [];
  const nouns = extractNouns(answers);

  if (DIAGNOSIS.test(JSON.stringify(result))) {
    reasons.push("適職診断・断定フレーズがある");
  }

  const items = result.signals?.items ?? [];
  if (items.length < 2 || items.length > 4) {
    reasons.push("signals.items は2〜4個");
  }
  if (items.some((item) => isInputCopy(item, answers))) {
    reasons.push("signals が入力語のコピー");
  }

  const worlds = result.possibleWorlds ?? [];
  if (worlds.length < 3 || worlds.length > 4) {
    reasons.push("possibleWorlds は3〜4件");
  }
  if (worlds.some((w) => !w.world || !Array.isArray(w.examples) || w.examples.length === 0)) {
    reasons.push("world に領域名と examples がない");
  }

  const jobs = result.notYetJobs ?? [];
  if (jobs.length < 2 || jobs.length > 3) {
    reasons.push("notYetJobs は2〜3件");
  }
  for (const job of jobs) {
    if (isLiteralJobName(job.name, nouns)) {
      reasons.push(`literal job: ${job.name}`);
    }
    const combined = job.signalsCombined ?? [];
    if (combined.length < 2) {
      reasons.push(`signal再結合不足: ${job.name}`);
    }
    if (!job.whatTheyDo || !job.futureChange || !job.whyItMightExist) {
      reasons.push(`job フィールド不足: ${job.name}`);
    }
  }

  const tries = result.tryThisWeek ?? [];
  if (tries.length < 1 || tries.length > 3) {
    reasons.push("tryThisWeek は1〜3件");
  }
  for (const t of tries) {
    const text = `${t.title}${t.description}`;
    if (SEARCH_ONLY.test(text) && !ACTION.test(text)) {
      reasons.push(`調べるだけ: ${t.title}`);
    }
    if (!ACTION.test(text)) {
      reasons.push(`実行可能性が弱い: ${t.title}`);
    }
  }

  return { ok: reasons.length === 0, reasons };
}
