import { memo } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { getDomain } from "@functions/utils";
import HeaderMeta from "@components/HeaderMeta";

const NotFoundPage = () => {
  const { t } = useTranslation();

  return (
    <div
      className="flex items-center justify-center"
      style={{ height: "80vh" }}
    >
      <HeaderMeta
        title={`${t("errors.pageNotFoundTitle", "Page not found")} - Stiletto ${t("app.subtitle", "for Last Oasis")}`}
        description={t("errors.pageNotFoundDescription", "Page not found")}
        canonical={`${getDomain()}/not-found`}
      >
        <meta name="robots" content="noindex" />
      </HeaderMeta>
      <div className="text-center">
        <h1 className="text-8xl font-bold text-gray-300">404</h1>
        <h2 className="text-2xl font-semibold text-gray-300 mb-4">
          {t("errors.oopsPageNotFound")}
        </h2>
        <p className="text-gray-400 mb-4">{t("errors.pageNotFound")}</p>
        <Link
          to="/"
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {t("common.goBackToHome")}
        </Link>
      </div>
    </div>
  );
};

export default memo(NotFoundPage);
