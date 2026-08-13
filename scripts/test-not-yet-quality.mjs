/**
 * NOT YET v0.2 quality fixtures (no API key)
 * Run: node scripts/test-not-yet-quality.mjs
 */
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";
import { readFileSync } from "node:fs";
import Module from "node:module";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(import.meta.url);

function loadCjs(rel, extra = "") {
  const src = readFileSync(join(root, rel), "utf8")
    .replace(/import[\s\S]*?from\s*["'][^"']+["'];?\n/g, extra)
    .replace(/export type[\s\S]*?\n(?=export |const |function |\/\/|$)/g, "");
  const js = ts.transpileModule(src, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  const m = new Module(rel);
  m.filename = join(root, rel);
  m.paths = Module._nodeModulePaths(root);
  m._compile(js, m.filename);
  return m.exports;
}

const fixtures = loadCjs("lib/not-yet-fixtures.ts").NOT_YET_FIXTURES;
const { evaluateQuality, isLiteralJobName, extractNouns } = loadCjs("lib/not-yet-quality.ts");

let failed = 0;
function assert(cond, msg) {
  if (!cond) {
    console.error("FAIL:", msg);
    failed += 1;
  } else {
    console.log("OK  ", msg);
  }
}

assert(fixtures.length === 5, "5 fixtures A–E");
for (const f of fixtures) {
  assert(Boolean(f.id && f.answers), `fixture ${f.id}: ${f.label}`);
}

const E = fixtures.find((f) => f.id === "E");
const nounsE = extractNouns(E.answers);
assert(nounsE.some((n) => n.includes("オカルト") || n === "オカルト"), `E has オカルト (${nounsE.join(", ")})`);
assert(nounsE.some((n) => n.includes("猫") || n === "猫"), "E has 猫");
assert(isLiteralJobName("オカルト技術者", nounsE), "E: オカルト技術者 is literal BAD");
assert(isLiteralJobName("猫エンジニア", nounsE), "E: 猫エンジニア is literal BAD");
assert(isLiteralJobName("Robloxデザイナー", ["Roblox"]), "Robloxデザイナー is literal BAD");
assert(!isLiteralJobName("見えないものの検証者", nounsE), "見えないものの検証者 is NOT literal");

const badE = {
  signals: {
    title: "好き",
    summary: "",
    items: ["飛行機が好き", "猫が好き", "オカルトが好き"],
  },
  possibleWorlds: [{ world: "航空", description: "", examples: ["パイロット"], connection: "" }],
  notYetJobs: [
    {
      name: "オカルト技術者",
      whatTheyDo: "オカルトを研究する",
      signalsCombined: ["オカルト"],
      futureChange: "",
      whyItMightExist: "",
    },
    {
      name: "猫エンジニア",
      whatTheyDo: "猫アプリ",
      signalsCombined: ["猫"],
      futureChange: "",
      whyItMightExist: "",
    },
  ],
  tryThisWeek: [{ title: "航空会社の仕事内容を調べよう", description: "検索する" }],
  closingMessage: "あなたには航空が向いている",
};
const bad = evaluateQuality(badE, E.answers);
assert(!bad.ok, "E bad sample fails quality");
assert(bad.reasons.some((r) => /literal/i.test(r)), `literal flagged: ${bad.reasons.join(" | ")}`);

const goodE = {
  signals: {
    title: "確かめたくなる目",
    summary: "見えないことと、飛ぶものの仕組みの両方に惹かれているようです。",
    items: [
      "動く仕組みを、自分で確かめたい",
      "言葉で説明できないものを観察したくなる",
      "調べて、飛ばして、比べて理解する",
    ],
  },
  possibleWorlds: [
    { world: "航空・モビリティ", description: "飛ぶもの。", examples: ["航空エンジニア", "ドローン開発"], connection: "飛ばして確かめる" },
    { world: "生きもの行動", description: "動物の動き。", examples: ["動物行動の観察"], connection: "猫を見る" },
    { world: "現象の検証", description: "不思議をデータで見る。", examples: ["計測"], connection: "本当？と問う" },
  ],
  notYetJobs: [
    {
      name: "見えないものの検証者",
      whatTheyDo: "噂や不思議な現象を、センサーやデータで確かめる人。",
      signalsCombined: ["言葉で説明できないものを観察したくなる", "調べて比べて理解する"],
      futureChange: "安価なセンサーとAIで個人でも検証しやすくなる",
      whyItMightExist: "本当かを自分の手で確かめたくなるから",
    },
    {
      name: "小さな飛行体の世界設計者",
      whatTheyDo: "小型の飛行体で、人が行きにくい場所を観察する仕組みを作る人。",
      signalsCombined: ["動く仕組みを自分で確かめたい", "飛ばして比べて理解する"],
      futureChange: "ドローンが日常の観察ツールになる",
      whyItMightExist: "飛ばすことと観察が一つの役割になりうるから",
    },
  ],
  tryThisWeek: [
    { title: "紙飛行機を3種類つくって飛ばす", description: "形を変えて、どれが一番長く飛ぶか記録してみよう。" },
  ],
  closingMessage: "いま決めなくていい。試してみると、何か見えるかもしれない。",
};
const good = evaluateQuality(goodE, E.answers);
assert(good.ok, `E good sample passes (${good.reasons.join(" | ")})`);

if (failed) {
  console.error(`\n${failed} failed`);
  process.exit(1);
}
console.log("\nAll quality fixture checks passed.");
