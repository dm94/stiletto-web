import type React from "react";
import { useState, useCallback } from "react";
import { useTranslation } from "next-i18next";
import type { Tree } from "../../types/dto/tech";
import { seeWhoHasLearntIt } from "../../functions/requests/clans/tech";

interface SkillNodeBtnProps {
  clan: number;
  tree: Tree;
  item: {
    name: string;
  };
}

const SkillNodeBtn: React.FC<SkillNodeBtnProps> = ({ clan, tree, item }) => {
  const { t } = useTranslation();
  const [usersSavedData, setUsersSavedData] = useState<string[]>([]);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const getLearned = useCallback(async (): Promise<void> => {
    if (isLoading) {
      return;
    }

    setIsLoading(true);
    setError(false);

    try {
      const users = await seeWhoHasLearntIt(String(clan), {
        tree,
        tech: item.name,
      });

      if (users?.length > 0) {
        const mapped = users.map((user) => user.discordtag);
        setUsersSavedData(mapped);
      }

      setLoaded(true);
    } catch (_err) {
      setError(true);
    } finally {
      setIsLoading(false);
    }
  }, [clan, tree, item.name, isLoading]);

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

  if (error) {
    return (
      <div>
        <p className="text-red-500">{t("errors.apiConnection")}</p>
        <button
          type="button"
          className="btn btn-outline-danger btn-sm mt-1"
          onClick={getLearned}
        >
          {t("common.retry")}
        </button>
      </div>
    );
  }

  if (loaded) {
    return <p>{t("techTree.noOneHasLearnedIt")}</p>;
  }

  return (
    <button
      type="button"
      className={`btn ${isLoading ? "btn-secondary" : "btn-primary"} btn-block`}
      onClick={getLearned}
      disabled={isLoading}
    >
      {isLoading ? t("common.loading") : t("techTree.seeWhoHasLearnedIt")}
    </button>
  );
};

export default SkillNodeBtn;
