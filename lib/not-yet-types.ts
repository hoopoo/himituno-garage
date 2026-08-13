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
  name: string;
  description: string;
  connection: string;
};

export type NotYetJob = {
  name: string;
  description: string;
  whyItConnects: string;
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
