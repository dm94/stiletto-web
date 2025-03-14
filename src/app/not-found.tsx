import Link from "next/link";
import { useTranslations } from "next-intl";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page not found - Stiletto for Last Oasis",
  description: "Page not found",
  robots: "noindex",
};

export default function NotFound() {
  const t = useTranslations();

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="text-center">
        <h1 className="text-8xl font-bold">404</h1>
        <h2 className="text-2xl mb-4">{t("Oops! Page Not Found")}</h2>
        <p className="mb-4">
          {t("The page you are looking for does not exist")}
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          {t("Go Back to Home")}
        </Link>
      </div>
    </div>
  );
}
