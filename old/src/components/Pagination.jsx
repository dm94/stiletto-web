import React from "react";
import { useTranslation } from "react-i18next";

const Pagination = ({ currentPage, hasMore, onPrev, onNext }) => {
  const { t } = useTranslation();

  return (
    <nav aria-label="pagination">
      <ul className="pagination justify-content-end">
        <li className={currentPage <= 1 ? "page-item disabled" : "page-item"}>
          <button
            type="button"
            className="page-link"
            onClick={onPrev}
            aria-disabled={currentPage <= 1}
          >
            {t("Previous Page")}
          </button>
        </li>
        <li className="page-item active" aria-current="page">
          <button type="button" className="page-link" disabled>
            {currentPage}
          </button>
        </li>
        <li className={hasMore ? "page-item" : "page-item disabled"}>
          <button
            type="button"
            className="page-link"
            onClick={onNext}
            aria-disabled={hasMore}
          >
            {t("Next Page")}
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
