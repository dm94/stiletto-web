import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const NotFoundPage = () => {
  const { t } = useTranslation();

  return (
    <div className="d-flex align-items-center justify-content-center" style={{ height: "80vh" }}>
      <div className="text-center">
        <h1 className="display-1 font-weight-bold">404</h1>
        <h2 className="mb-4">{t("Oops! Page Not Found")}</h2>
        <p className="mb-4">{t("The page you are looking for does not exist")}</p>
        <Link to="/" className="btn btn-primary">{t("Go Back to Home")}</Link>
      </div>
    </div>
  );
};

export default NotFoundPage;