import React from "react";
import Giscus from "@giscus/react";
import { getStoredItem } from "../../functions/services";
import { useTranslation } from "react-i18next";

interface CommentsProps {
  name: string;
}

const Comments: React.FC<CommentsProps> = ({ name }) => {
  const { t } = useTranslation();

  if (name && localStorage.getItem("acceptscookies")) {
    const language = getStoredItem("i18nextLng");
    return (
      <div className="w-full p-4">
        <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
          <div className="p-3 bg-gray-900 border-b border-gray-700 text-neutral-300">
            {t("wiki.comments")}
          </div>
          <div className="p-4">
            <Giscus
              id="comments"
              repo="dm94/stiletto-web"
              repoId="MDEwOlJlcG9zaXRvcnkyOTk5OTE5OTk="
              category="Comments"
              categoryId="DIC_kwDOEeGDv84CSWZY"
              mapping="specific"
              term={name}
              reactionsEnabled="1"
              emitMetadata="0"
              inputPosition="top"
              theme={"dark"}
              lang={language ?? "en"}
              loading="lazy"
            />
          </div>
        </div>
      </div>
    );
  }

  return false;
};

export default Comments;