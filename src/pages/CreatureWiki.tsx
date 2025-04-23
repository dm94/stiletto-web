import React, { useState, useEffect, Suspense } from "react";
import { useTranslation } from "react-i18next";
import { getCreatures, getCreatureInfo } from "@functions/github";
import { Navigate, useParams } from "react-router";
import Icon from "@components/Icon";
import LoadingScreen from "@components/LoadingScreen";
import Comments from "@components/Wiki/Comments";
import { getItemDecodedName, getCreatureUrl } from "@functions/utils";
import HeaderMeta from "@components/HeaderMeta";
import type { Creature, CreatureCompleteInfo } from "@ctypes/creature";
import DropsInfo from "@components/Wiki/DropsInfo";
import CreatureInfo from "@components/Wiki/CreatureInfo";

const WikiDescription = React.lazy(
  () => import("@components/Wiki/WikiDescription"),
);

const CreatureWiki = () => {
  const { t } = useTranslation();
  const { name } = useParams();
  const [creature, setCreature] = useState<Creature>();
  const [creatureInfo, setCreatureInfo] = useState<CreatureCompleteInfo>();
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    const loadData = async () => {
      let creatureName = name;
      if (creatureName) {
        creatureName = getItemDecodedName(creatureName);
      }

      const creatures = await getCreatures();
      if (creatures) {
        const foundCreature = creatures.find(
          (cr) => cr.name.toLowerCase() === creatureName?.toLowerCase(),
        );
        setCreature(foundCreature);

        try {
          const creatureInfo = await getCreatureInfo(
            foundCreature?.name ?? creatureName ?? "",
          );
          setCreatureInfo({
            ...creatureInfo,
            ...foundCreature,
          });
        } catch {
          setCreatureInfo(undefined);
        }
        setIsLoaded(true);
      }
    };

    loadData();
  }, [name]);

  const loadingCreaturePart = () => (
    <div className="w-full md:w-1/2">
      <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden mb-4">
        <LoadingScreen />
      </div>
    </div>
  );

  if (!isLoaded) {
    return <LoadingScreen />;
  }

  if (!creature) {
    return <Navigate to={"/not-found"} />;
  }

  const creatureName = creature?.name ?? creatureInfo?.name;

  return (
    <div
      className="container mx-auto px-4"
      data-cy="wiki-creature"
      data-name={creatureName}
    >
      <HeaderMeta
        title={`${creatureName} - Stiletto for Last Oasis`}
        description={`All information for ${creatureName}`}
        cannonical={getCreatureUrl(creatureName)}
      />
      <div className="flex flex-wrap -mx-4">
        <div className="w-full md:w-1/2 px-4">
          <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden mb-4">
            <div className="p-4 bg-gray-900 border-b border-gray-700">
              <div className="flex items-center text-neutral-300">
                <Icon key={creatureName} name={creatureName} width={35} />
                <span className="ml-2">
                  {t(creatureName, { ns: "creatures" })}
                </span>
              </div>
            </div>
          </div>
        </div>
        <Suspense fallback={loadingCreaturePart()}>
          <CreatureInfo key="creatureInfo" creatureInfo={creatureInfo} />
        </Suspense>
        <Suspense fallback={loadingCreaturePart()}>
          <WikiDescription key="wikidescription" name={creatureName} />
        </Suspense>
        <Suspense fallback={loadingCreaturePart()}>
          {creatureInfo?.drops && (
            <DropsInfo key="dropInfo" drops={creatureInfo?.drops} />
          )}
        </Suspense>
        <Suspense fallback={loadingCreaturePart()}>
          <Comments key="comments" name={creatureName} />
        </Suspense>
      </div>
    </div>
  );
};

export default CreatureWiki;
