import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { getWhoHasLearntIt } from "../../functions/requests/clan";

const SkillNodeBtn = ({ clan, tree, item }) => {
  const { t } = useTranslation();
  const [usersSavedData, setUsersSavedData] = useState([]);
  const [loaded, setLoaded] = useState(false);

  const getLearned = async () => {
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
    return <p>{t("No one has learnt it")}</p>;
  }
  return (
    <button
      type="button"
      className="btn btn-primary btn-block"
      onClick={getLearned}
    >
      {t("See who has learned it")}
    </button>
  );
};

export default SkillNodeBtn;
