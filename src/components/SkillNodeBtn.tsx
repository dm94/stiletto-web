"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { config } from "@/config/config";
import { getStoredItem } from "@/lib/services";

interface SkillNodeBtnProps {
  clan?: string;
  tree: string;
  item: {
    name: string;
  };
}

export default function SkillNodeBtn({ clan, tree, item }: SkillNodeBtnProps) {
  const t = useTranslations();
  const [usersSavedData, setUsersSavedData] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);

  const getLearned = async () => {
    if (!clan) {
      return;
    }

    try {
      const response = await fetch(
        `${config.API_URL}/clans/${clan}/techtree/${tree}/${item.name}`,
        {
          headers: {
            Authorization: `Bearer ${getStoredItem("token")}`,
          },
        }
      );

      if (response.ok) {
        const users = await response.json();
        setUsersSavedData(users);
      }
      setLoaded(true);
    } catch {
      setLoaded(true);
    }
  };

  if (usersSavedData.length > 0) {
    return (
      <ul className="list-group list-group-horizontal flex-wrap">
        {usersSavedData.map((user) => (
          <li
            key={`skill-${item.name}-user-${user}`}
            className="list-group-item"
          >
            {user}
          </li>
        ))}
      </ul>
    );
  }

  if (loaded) {
    return <p>{t("No one has learnt it")}</p>;
  }

  return (
    <button
      type="button"
      className="btn btn-primary w-100"
      onClick={getLearned}
    >
      {t("See who has learned it")}
    </button>
  );
}
