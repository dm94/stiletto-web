import { useTranslation } from "react-i18next";

type PaginationProps = {
  contentType: "items" | "creatures";
  isLoading: boolean;
  hasMore: boolean;
  displayedItems: any[];
  displayedCreatures: any[];
  filteredItems: any[];
  filteredCreatures: any[];
  onLoadMore: () => void;
};

const Pagination = ({
  contentType,
  isLoading,
  hasMore,
  displayedItems,
  displayedCreatures,
  filteredItems,
  filteredCreatures,
  onLoadMore,
}: PaginationProps) => {
  const { t } = useTranslation();

  const loadMoreButton = hasMore &&
    !isLoading &&
    ((contentType === "items" && displayedItems.length > 0) ||
      (contentType === "creatures" && displayedCreatures.length > 0)) && (
      <div className="mt-8 text-center">
        <button
          type="button"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
          onClick={onLoadMore}
          data-cy="load-more-btn"
        >
          {t("common.loadMore")}
        </button>
      </div>
    );

  const paginationInfo =
    !isLoading &&
    (contentType === "items" && displayedItems.length > 0 ? (
      <div className="mt-4 text-center text-gray-400">
        {t("wiki.showingItems", {
          displayed: displayedItems.length,
          total: filteredItems.length,
        })}
      </div>
    ) : (
      contentType === "creatures" &&
      displayedCreatures.length > 0 && (
        <div className="mt-4 text-center text-gray-400">
          {t("wiki.showingItems", {
            displayed: displayedCreatures.length,
            total: filteredCreatures.length,
          })}
        </div>
      )
    ));

  return (
    <>
      {loadMoreButton}
      {paginationInfo}
    </>
  );
};

export default Pagination;
