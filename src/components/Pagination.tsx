import type React from "react";
import { memo } from "react";
import { useTranslation } from "react-i18next";

interface PaginationProps {
  currentPage: number;
  hasMore: boolean;
  onPrev: () => void;
  onNext: () => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  hasMore,
  onPrev,
  onNext,
}) => {
  const { t } = useTranslation();

  return (
    <nav aria-label="pagination" className="flex justify-end">
      <ul className="flex items-center space-x-2">
        <li>
          <button
            type="button"
            className={`px-4 py-2 text-sm font-medium rounded-md ${
              currentPage <= 1
                ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                : "bg-gray-800 text-white hover:bg-gray-700 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            }`}
            onClick={onPrev}
            disabled={currentPage <= 1}
            aria-disabled={currentPage <= 1}
          >
            {t("common.previousPage")}
          </button>
        </li>
        <li>
          <button
            type="button"
            className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-md cursor-default"
            disabled
          >
            {currentPage}
          </button>
        </li>
        <li>
          <button
            type="button"
            className={`px-4 py-2 text-sm font-medium rounded-md ${
              hasMore
                ? "bg-gray-800 text-white hover:bg-gray-700 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                : "bg-gray-700 text-gray-400 cursor-not-allowed"
            }`}
            onClick={onNext}
            disabled={!hasMore}
            aria-disabled={!hasMore}
          >
            {t("common.nextPage")}
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default memo(Pagination);
