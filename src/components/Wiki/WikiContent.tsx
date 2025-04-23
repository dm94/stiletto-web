import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import Ingredient from "@components/Ingredient";
import Icon from "@components/Icon";
import { getCreatureUrl } from "@functions/utils";
import type { Item } from "@ctypes/item";
import type { Creature } from "@ctypes/creature";

type WikiContentProps = {
  contentType: "items" | "creatures";
  isLoading: boolean;
  displayedItems: Item[];
  displayedCreatures: Creature[];
};

const WikiContent = ({
  contentType,
  isLoading,
  displayedItems,
  displayedCreatures,
}: WikiContentProps) => {
  const { t } = useTranslation();

  const content = useMemo(() => {
    if (isLoading) {
      return (
        <div className="w-full" key="wiki-loading">
          <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden shadow-md">
            <div className="p-6 text-center text-gray-300 text-lg relative">
              <div className="loader-small" />
            </div>
          </div>
        </div>
      );
    }

    if (contentType === "items" && displayedItems.length > 0) {
      return displayedItems.map((item) => (
        <div
          key={`wiki-${item.name}`}
          className="w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 p-3"
          data-cy="wiki-item"
        >
          <div className="bg-gray-800 border border-gray-700 hover:border-blue-500 rounded-lg overflow-hidden shadow-md transition-all duration-300 hover:shadow-lg hover:transform hover:scale-102">
            <div className="p-4">
              <Ingredient ingredient={item} value={1} />
            </div>
          </div>
        </div>
      ));
    }

    if (contentType === "creatures" && displayedCreatures.length > 0) {
      return displayedCreatures.map((creature) => (
        <div
          key={`creature-${creature.name}`}
          className="w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 p-3"
          data-cy="wiki-creature"
        >
          <Link to={getCreatureUrl(creature.name)}>
            <div className="bg-gray-800 border border-gray-700 hover:border-blue-500 rounded-lg overflow-hidden shadow-md transition-all duration-300 hover:shadow-lg hover:transform hover:scale-102">
              <div className="p-4 flex items-center">
                <Icon key={creature.name} name={creature.name} width={35} />
                <span className="ml-2 text-gray-300">
                  {t(creature.name, { ns: "creatures" })}
                </span>
              </div>
            </div>
          </Link>
        </div>
      ));
    }

    return (
      <div className="w-full" key="wiki-notfound">
        <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden shadow-md">
          <div className="p-6 text-center text-gray-300 text-lg">
            {t("wiki.nothingFound")}
          </div>
        </div>
      </div>
    );
  }, [displayedItems, displayedCreatures, isLoading, t, contentType]);

  return <div className="flex flex-wrap -m-3">{content}</div>;
};

export default WikiContent;
