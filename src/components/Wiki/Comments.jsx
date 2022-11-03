import React, { Component } from "react";
import Giscus from "@giscus/react";
import { getStoredItem } from "../../services";

class Comments extends Component {
  render() {
    if (this.props.name && localStorage.getItem("acceptscookies")) {
      let language = getStoredItem("i18nextLng");
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
                term={this.props.name}
                reactionsEnabled="1"
                emitMetadata="0"
                inputPosition="top"
                theme={getStoredItem("darkmode") !== "false" ? "dark" : "light"}
                lang={language}
                loading="lazy"
              />
            </div>
          </div>
        </div>
      );
    }

    return "";
  }
}

export default Comments;
