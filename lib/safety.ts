export type SafetyKind = "self_harm" | "crime" | "pii" | "homework" | null;

const SELF_HARM =
  /死にたい|消えたい|自傷|自殺|殺して|殺す|死ぬ|生きていても|リストカット/;

const CRIME =
  /爆弾|爆発物|人殺|殺人|犯罪のやり方|盗み方|ハッキングの手順|薬物の作り方|武器の作り方/;

const PII =
  /[\w.+-]+@[\w.-]+\.\w+|0\d{1,4}[-(]?\d{1,4}[-)]?\d{3,4}|本名は|住所は|番地|電話番号|メールアドレス|(小学校|中学校|高校|大学)名|学校名は/;

const HOMEWORK =
  /宿題の答え|テストの答え|この問題の答え|丸写し|答えを教えて|解いて(?:ください|くれ)/;

export function detectSafety(text: string): SafetyKind {
  const t = text.replace(/\s+/g, "");
  if (SELF_HARM.test(t)) return "self_harm";
  if (CRIME.test(t)) return "crime";
  if (PII.test(text)) return "pii";
  if (HOMEWORK.test(t)) return "homework";
  return null;
}

export function safetyClosing(kind: SafetyKind): string {
  if (kind === "self_harm" || kind === "crime") {
    return "それは、ここだけじゃ持てない重さかも。おうちの人か、信頼できる大人に話してね。今日はここで止まってもいいよ。";
  }
  if (kind === "pii") {
    return "氏名・住所・学校名・電話番号・メールは入れなくて大丈夫。興味や「好き」「気になる」だけ教えてね。";
  }
  if (kind === "homework") {
    return "宿題の答えは、ここでは出さないよ。興味や「好き」から、まだ名前のない未来を探してみよう。";
  }
  return "";
}
