import type { Metadata } from "next";
import NotYetExperience from "../components/not-yet/NotYetExperience";

export const metadata: Metadata = {
  title: "NOT YET — まだ名前のない仕事を探そう",
  description:
    "子どもの好き・気になる・作りたいから、まだ名前のない未来を探す実験。適職診断ではありません。",
};

export default function NotYetPage() {
  return <NotYetExperience />;
}
