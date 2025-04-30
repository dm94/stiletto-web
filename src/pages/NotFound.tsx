import { memo, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { Helmet } from "react-helmet";
import { getDomain } from "@functions/utils";

const NotFoundPage = () => {
  const { t } = useTranslation();

  const helmetInfo = useMemo(
    () => (
      <Helmet>
        <title>{t("errors.pageNotFoundTitle", "Page not found")} - {t("app.title")} {t("app.subtitle", "for Last Oasis")}</title>
        <meta name="description" content={t("errors.pageNotFoundDescription", "Page not found")} />
        <meta name="robots" content="noindex" />
        <link rel="canonical" href={`${getDomain()}/not-found`} />
      </Helmet>
    ),
    [],
  );

  return (
    <div
      className="flex items-center justify-center"
      style={{ height: "80vh" }}
    >
      {helmetInfo}
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
