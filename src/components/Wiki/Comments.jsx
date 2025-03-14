import React from "react";
import Giscus from "@giscus/react";
import { getStoredItem } from "../../functions/services";

const Comments = ({ name }) => {
  if (name && localStorage.getItem("acceptscookies")) {
    const language = getStoredItem("i18nextLng");
    return (
      <div className="col-12">
        <div className="card border-secondary mb-3">
          <div className="card-body">
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
              lang={language}
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
