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
        <section
          className="w-full"
          key="wiki-loading"
          aria-live="polite"
          aria-busy="true"
        >
          <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden shadow-md">
            <div className="p-6 text-center text-gray-300 text-lg relative">
              <div className="loader-small" aria-label={t("common.loading")} />
            </div>
          </div>
        </section>
      );
    }

    if (contentType === "items" && displayedItems.length > 0) {
      return displayedItems.map((item, index) => (
        <article
          key={`wiki-${item.name}-${index}`}
          className="w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 p-3"
          data-testid="wiki-item"
        >
          <div className="bg-gray-800 border border-gray-700 hover:border-blue-500 rounded-lg overflow-hidden shadow-md transition-all duration-300 hover:shadow-lg hover:transform hover:scale-102">
            <div className="p-4">
              <Ingredient ingredient={item} value={1} />
            </div>
          </div>
        </article>
      ));
    }

    if (contentType === "creatures" && displayedCreatures.length > 0) {
      return displayedCreatures.map((creature, index) => (
        <article
          key={`creature-${creature.name}-${index}`}
          className="w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 p-3"
          data-testid="wiki-creature"
        >
          <Link
            to={getCreatureUrl(creature.name)}
            aria-label={t(creature.name, { ns: "creatures" })}
          >
            <div className="bg-gray-800 border border-gray-700 hover:border-blue-500 rounded-lg overflow-hidden shadow-md transition-all duration-300 hover:shadow-lg hover:transform hover:scale-102">
              <div className="p-4 flex items-center">
                <Icon
                  key={creature.name}
                  name={creature.name}
                  width={35}
                  aria-hidden="true"
                />
                <span className="ml-2 text-gray-300">
                  {t(creature.name, { ns: "creatures" })}
                </span>
              </div>
            </div>
          </Link>
        </article>
      ));
    }

    return (
      <section className="w-full" key="wiki-notfound" aria-live="polite">
        <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden shadow-md">
          <div
            className="p-6 text-center text-gray-300 text-lg"
            data-testid="wiki-nothing-found"
          >
            {t("wiki.nothingFound")}
          </div>
        </div>
      </section>
    );
  }, [displayedItems, displayedCreatures, isLoading, t, contentType]);

  return (
    <section
      className="flex flex-wrap -m-3"
      aria-label={t(contentType === "items" ? "wiki.items" : "wiki.creatures")}
      data-testid="wiki-content-area"
    >
      {content}
    </section>
  );
};

export default WikiContent;
