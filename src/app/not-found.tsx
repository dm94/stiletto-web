"use client";

import React from "react";
import Link from "next/link";
import { useTranslation } from "next-i18next";

export default function NotFound() {
  const { t } = useTranslation();

  return (
    <div
      className="flex items-center justify-center"
      style={{ height: "80vh" }}
    >
      <div className="text-center">
        <h1 className="text-8xl font-bold text-gray-300">404</h1>
        <h2 className="text-2xl font-semibold text-gray-300 mb-4">
          {t("errors.oopsPageNotFound")}
        </h2>
        <p className="text-gray-400 mb-4">{t("errors.pageNotFound")}</p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {t("common.goBackToHome")}
        </Link>
      </div>
    </div>
  );
}
