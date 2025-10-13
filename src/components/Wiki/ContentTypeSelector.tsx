import { useTranslation } from "react-i18next";

type ContentType = "items" | "creatures" | "perks";

type ContentTypeSelectorProps = {
  selectedType: ContentType;
  onTypeChange: (type: ContentType) => void;
};

const ContentTypeSelector = ({
  selectedType,
  onTypeChange,
}: ContentTypeSelectorProps) => {
  const { t } = useTranslation();

  return (
    <div className="max-w-md mx-auto mb-6">
      <div className="flex justify-center space-x-4">
        <button
          type="button"
          className={`px-6 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${selectedType === "items" ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"}`}
          onClick={() => onTypeChange("items")}
        >
          {t("menu.items")}
        </button>
        <button
          type="button"
          className={`px-6 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${selectedType === "creatures" ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"}`}
          onClick={() => onTypeChange("creatures")}
        >
          {t("menu.creatures")}
        </button>
        <button
          type="button"
          className={`px-6 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${selectedType === "perks" ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"}`}
          onClick={() => onTypeChange("perks")}
        >
          {t("menu.perks")}
        </button>
      </div>
    </div>
  );
};

export default ContentTypeSelector;
