import { useTranslation } from "react-i18next";

type ContentTypeSelectorProps = {
  contentType: "items" | "creatures";
  onContentTypeChange: (type: "items" | "creatures") => void;
};

const ContentTypeSelector = ({
  contentType,
  onContentTypeChange,
}: ContentTypeSelectorProps) => {
  const { t } = useTranslation();

  return (
    <div className="max-w-md mx-auto mb-6">
      <div className="flex justify-center space-x-4" role="group" aria-label={t("wiki.contentTypeSelection")}>
        <button
          type="button"
          className={`px-6 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${contentType === "items" ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"}`}
          onClick={() => onContentTypeChange("items")}
          aria-pressed={contentType === "items"}
        >
          {t("menu.items")}
        </button>
        <button
          type="button"
          className={`px-6 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${contentType === "creatures" ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"}`}
          onClick={() => onContentTypeChange("creatures")}
          aria-pressed={contentType === "creatures"}
        >
          {t("menu.creatures")}
        </button>
      </div>
    </div>
  );
};

export default ContentTypeSelector;
