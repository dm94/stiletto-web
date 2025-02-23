import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { getExternalWikiDescription } from "../../functions/requests/other";

const WikiDescription = ({ name }) => {
  const [description, setDescription] = useState(undefined);
  const { t } = useTranslation();

  useEffect(() => {
    const updateDescription = async () => {
      const detail = await getExternalWikiDescription(name);
      if (detail) {
        setDescription(detail);
      }
    };

    updateDescription();
  }, [name]);

  if (description) {
    return (
      <div className="col-12">
        <div className="card border-secondary mb-3">
          <div className="card-header">{t("Description by Wiki")}</div>
          <div className="card-body">
            <pre>{description}</pre>
          </div>
          <div className="card-footer">
            <a
              type="button"
              className="btn btn-lg btn-info btn-block"
              target="_blank"
              rel="noopener noreferrer"
              href={`https://lastoasis.fandom.com/wiki/Special:Search?query=${name}&scope=internal&navigationSearch=true`}
            >
              {t("Wiki")}
            </a>
          </div>
        </div>
      </div>
    );
  }

  return false;
};

export default WikiDescription;
