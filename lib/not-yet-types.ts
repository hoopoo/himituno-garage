export const INTERESTS = [
  "作る",
  "調べる",
  "話す",
  "直す",
  "集める",
  "観察する",
  "わからない",
] as const;

export type Interest = (typeof INTERESTS)[number];

export type NotYetAnswers = {
  q1: string;
  q2: string;
  q3: string;
  q4: string;
  q5: Interest[];
  q6: string;
  q7: string;
};

export type PossibleWorld = {
  world: string;
  description: string;
  examples: string[];
  connection: string;
};

export type NotYetJob = {
  name: string;
  whatTheyDo: string;
  signalsCombined: string[];
  futureChange: string;
  whyItMightExist: string;
};

export type TryThisWeek = {
  title: string;
  description: string;
};

export type NotYetResult = {
  safetyHold?: boolean;
  signals: {
    title: string;
    summary: string;
    items: string[];
  };
  possibleWorlds: PossibleWorld[];
  notYetJobs: NotYetJob[];
  tryThisWeek: TryThisWeek[];
  closingMessage: string;
};

export const EMPTY_ANSWERS: NotYetAnswers = {
  q1: "",
  q2: "",
  q3: "",
  q4: "",
  q5: [],
  q6: "",
  q7: "",
};

export function answersText(a: NotYetAnswers): string {
  return [
    `Q1 時間を忘れてやってしまうこと: ${a.q1 || "わからない"}`,
    `Q2 つい見てしまうもの: ${a.q2 || "わからない"}`,
    `Q3 学校で好きな時間: ${a.q3 || "わからない"}`,
    `Q4 なんでこうなってるんだろうと思うもの: ${a.q4 || "わからない"}`,
    `Q5 好きなこと: ${(a.q5 ?? []).join("、") || "わからない"}`,
    `Q6 ちょっとだけ人より詳しいこと: ${a.q6 || "わからない"}`,
    `Q7 いまやってみたいこと: ${a.q7 || "わからない"}`,
  ].join("\n");
}
