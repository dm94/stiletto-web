import type React from "react";
import { useTranslation } from "react-i18next";
import Icon from "../Icon";
import { getItemUrl } from "@functions/utils";
import type { Item } from "@ctypes/item";

interface SchematicItemsProps {
  item: Item;
}

const SchematicItems: React.FC<SchematicItemsProps> = ({ item }) => {
  const { t } = useTranslation();

  const showSchematicItems = () => {
    return item?.learn?.map((itemCraft: string) => {
      const url = getItemUrl(itemCraft);

      return (
        <li className="inline-block mr-2 mb-2" key={itemCraft}>
          <div className="p-2 bg-gray-800 border border-gray-700 rounded-lg flex items-center space-x-2">
            <Icon key={itemCraft} name={itemCraft} />
            <a href={url} className="text-blue-400 hover:text-blue-300">
              {t(itemCraft)}
            </a>
          </div>
        </li>
      );
    });
  };

  if (!item?.learn) {
    return null;
  }

  return (
    <div className="w-full p-4">
      <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
        <div className="p-3 bg-gray-900 border-b border-gray-700 text-neutral-300">
          {t("wiki.schematicItems")}
        </div>
        <div className="p-4">
          <ul className="space-y-2">{showSchematicItems()}</ul>
        </div>
      </div>
    </div>
  );
};

export default SchematicItems;
