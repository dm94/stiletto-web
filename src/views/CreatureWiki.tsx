"use client";
import React, { useState, useEffect, Suspense, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { getCreatures, getCreatureInfo } from "@functions/github";
import { useParams, useRouter } from "next/navigation";
import Icon from "@components/Icon";
import LoadingScreen from "@components/LoadingScreen";
import Comments from "@components/Wiki/Comments";
import {
  getDomain,
  getItemDecodedName,
  getCreatureUrl,
  getItemUrl,
} from "@functions/utils";
import HeaderMeta, { OpenGraphType } from "@components/HeaderMeta";
import type { Creature, CreatureCompleteInfo } from "@ctypes/creature";
import CreatureDropsInfo from "@components/Wiki/CreatureDropsInfo";
import ExtraInfo from "@components/Wiki/ExtraInfo";
import RelatedCreatures from "@components/Wiki/RelatedCreatures";

const WikiDescription = React.lazy(
  () => import("@components/Wiki/WikiDescription"),
);

const CreatureWiki = () => {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const { name } = useParams() as { name: string };
  const [creature, setCreature] = useState<Creature>();
  const [creatureInfo, setCreatureInfo] = useState<CreatureCompleteInfo>();
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    const loadData = async () => {
      try {
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
        }
      } catch {
        setCreature(undefined);
        setCreatureInfo(undefined);
      } finally {
        setIsLoaded(true);
      }
    };

    void loadData();
  }, [name]);

  const loadingCreaturePart = () => (
    <div className="w-full md:w-1/2">
      <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden mb-4">
        <LoadingScreen />
      </div>
    </div>
  );
  const creatureName =
    creature?.name ?? creatureInfo?.name ?? getItemDecodedName(name ?? "");
  const domain = getDomain();
  const canonical = `${domain}${getCreatureUrl(creatureName)}`;
  const creatureDescription = `Drops, stats and locations for ${creatureName} in Last Oasis.`;
  const creatureStructuredData = useMemo(() => {
    const additionalProperty: Array<Record<string, unknown>> = [];
    const mentions: Array<Record<string, unknown>> = [];

    if (creatureInfo?.category) {
      additionalProperty.push({
        "@type": "PropertyValue",
        name: "category",
        value: creatureInfo.category,
      });
    }

    if (creatureInfo?.health !== undefined) {
      additionalProperty.push({
        "@type": "PropertyValue",
        name: "health",
        value: creatureInfo.health,
      });
    }

    if (creatureInfo?.experiencie !== undefined) {
      additionalProperty.push({
        "@type": "PropertyValue",
        name: "experience",
        value: creatureInfo.experiencie,
      });
    }

    if (creatureInfo?.tier) {
      additionalProperty.push({
        "@type": "PropertyValue",
        name: "tier",
        value: creatureInfo.tier,
      });
    }

    if (creatureInfo?.maps) {
      additionalProperty.push({
        "@type": "PropertyValue",
        name: "maps",
        value: creatureInfo.maps.join(", "),
      });
    }

    for (const relatedCreature of creatureInfo?.related ?? []) {
      mentions.push({
        "@type": "Thing",
        name: relatedCreature,
        url: `${domain}${getCreatureUrl(relatedCreature)}`,
      });
    }

    for (const creatureDrop of creatureInfo?.drops ?? []) {
      mentions.push({
        "@type": "Thing",
        name: creatureDrop.name,
        url: `${domain}${getItemUrl(creatureDrop.name)}`,
      });
    }

    const data: Record<string, unknown> = {
      "@context": "https://schema.org",
      "@type": "Thing",
      name: creatureName,
      description: creatureDescription,
      url: canonical,
      inLanguage: i18n.language,
      isPartOf: {
        "@type": "CollectionPage",
        name: t("seo.wiki.title"),
        url: `${domain}/wiki`,
      },
    };

    if (additionalProperty.length > 0) {
      data.additionalProperty = additionalProperty;
    }

    if (mentions.length > 0) {
      data.mentions = mentions;
    }

    return data;
  }, [
    canonical,
    creatureDescription,
    creatureInfo,
    creatureName,
    domain,
    i18n.language,
    t,
  ]);

  useEffect(() => {
    if (isLoaded && !creature) {
      router.push("/wiki");
    }
  }, [isLoaded, creature, router]);

  if (!isLoaded) {
    return <LoadingScreen />;
  }

  if (!creature) {
    return null;
  }

  const showCreatureInfo = () => {
    if (!creatureInfo) {
      return null;
    }

    return (
      <ul className="space-y-2">
        {creatureInfo.category && (
          <li className="flex justify-between items-center p-3 border-b border-gray-700 last:border-b-0">
            <div className="text-gray-300">{t("common.category")}</div>
            <div className="text-gray-400">
              {t(creatureInfo.category, { ns: "creatures" })}
            </div>
          </li>
        )}
        {creatureInfo.health && (
          <li className="flex justify-between items-center p-3 border-b border-gray-700 last:border-b-0">
            <div className="text-gray-300">{t("creature.health")}</div>
            <div className="text-gray-400">{creatureInfo.health}</div>
          </li>
        )}
        {creatureInfo.experiencie && (
          <li className="flex justify-between items-center p-3 border-b border-gray-700 last:border-b-0">
            <div className="text-gray-300">{t("creature.experience")}</div>
            <div className="text-gray-400">{creatureInfo.experiencie}</div>
          </li>
        )}
        {creatureInfo.tier && (
          <li className="flex justify-between items-center p-3 border-b border-gray-700 last:border-b-0">
            <div className="text-gray-300">{t("creature.tier")}</div>
            <div className="text-gray-400">{creatureInfo.tier}</div>
          </li>
        )}
        {creatureInfo.maps && (
          <li className="flex justify-between items-center p-3 border-b border-gray-700 last:border-b-0">
            <div className="text-gray-300">{t("wiki.maps")}</div>
            <div className="text-gray-400">{creatureInfo.maps.join(", ")}</div>
          </li>
        )}
      </ul>
    );
  };

  return (
    <div
      className="container mx-auto px-4"
      data-testid="wiki-creature"
      data-name={creatureName}
    >
      <HeaderMeta
        title={`${creatureName} Creature Wiki - Stiletto for Last Oasis`}
        description={creatureDescription}
        canonical={canonical}
        ogType={OpenGraphType.Article}
        structuredData={creatureStructuredData}
      />
      <h1 className="text-4xl font-bold text-gray-200 text-center mb-8 mt-4">
        {t(creatureName, { ns: "creatures" })}
      </h1>
      <div className="flex flex-wrap -mx-4">
        <div className="w-full md:w-1/2 px-4">
          <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden mb-4">
            <div className="p-3 bg-gray-900 border-b border-gray-700 text-neutral-300">
              <Icon key={creatureName} name={creatureName} width={35} />
              <span className="ml-2">
                {t(creatureName, { ns: "creatures" })}
              </span>
            </div>
            <div className="p-4">{showCreatureInfo()}</div>
          </div>
        </div>
        <Suspense fallback={loadingCreaturePart()}>
          {creatureInfo?.related && (
            <RelatedCreatures
              key="relatedInfo"
              related={creatureInfo?.related}
            />
          )}
        </Suspense>
        <Suspense fallback={loadingCreaturePart()}>
          {creatureInfo?.drops && (
            <CreatureDropsInfo key="dropInfo" drops={creatureInfo?.drops} />
          )}
        </Suspense>
        <Suspense fallback={loadingCreaturePart()}>
          <ExtraInfo type="creatures" name={creatureName} />
        </Suspense>
        <Suspense fallback={loadingCreaturePart()}>
          <WikiDescription key="wikidescription" name={creatureName} />
        </Suspense>
        <Suspense fallback={loadingCreaturePart()}>
          <Comments key="comments" name={creatureName} />
        </Suspense>
      </div>
    </div>
  );
};

export default CreatureWiki;
