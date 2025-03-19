import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { getWhoHasLearntIt } from "../../functions/requests/clan";

interface SkillNodeBtnProps {
  clan: string;
  tree: string;
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
      const users = await getWhoHasLearntIt(clan, tree, item.name);
      setUsersSavedData(users);
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