import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/style.css";
import "@/styles/desert-theme.css";
import { supportedLanguages } from "@/config/languages";

const inter = Inter({ subsets: ["latin"] });

export async function generateStaticParams() {
  return supportedLanguages.map((lang) => ({ lang: lang.key }));
}

export const metadata: Metadata = {
  title: "Stiletto for Last Oasis",
  description: "Web with different utilities for the game Last Oasis",
};

export default async function RootLayout(props: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const params = await props.params;
  return (
    <html lang={params.lang}>
      <body className={inter.className}>
        <div id="root">
            {props.children}
        </div>
      </body>
    </html>
  );
}
