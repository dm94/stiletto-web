"use client";

import { useTranslations } from "next-intl";

interface PaginationProps {
  currentPage: number;
  hasMore: boolean;
  onPrev: () => void;
  onNext: () => void;
}

export default function Pagination({
  currentPage,
  hasMore,
  onPrev,
  onNext,
}: PaginationProps) {
  const t = useTranslations();

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
            aria-disabled={!hasMore}
          >
            {t("Next Page")}
          </button>
        </li>
      </ul>
    </nav>
  );
}
