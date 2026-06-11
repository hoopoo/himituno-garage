import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ひみつの車庫 local preview",
  description:
    "子どもの発見を、観察・言葉・制作につなげる小さなAI実験",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
