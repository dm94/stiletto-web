import type React from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
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

  const getLearned = async (): Promise<void> => {
    try {
      const users = await seeWhoHasLearntIt(String(clan), {
        tree,
        tech: item.name
      });

      if (users?.length <= 0) {
        setLoaded(true);
        return;
      }

      const mapped = users.map((user) => user.discordtag);
      setUsersSavedData(mapped);
      setLoaded(true);
    } catch (_err) {
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
    return <p>{t("techTree.noOneHasLearnedIt")}</p>;
  }
  return (
    <button
      type="button"
      className="btn btn-primary btn-block"
      onClick={getLearned}
    >
      {t("techTree.seeWhoHasLearnedIt")}
    </button>
  );
};

export default SkillNodeBtn;
