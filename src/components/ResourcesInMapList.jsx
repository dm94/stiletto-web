import React, { Component } from "react";
import { withTranslation } from "react-i18next";

class ResourcesInTheMapList extends Component {
  render() {
    const { t } = this.props;
    if (this.props.resources != null) {
      return this.props.resources.map((resource) => (
        <li key={resource.resourceid}>
          <button
            className="list-group-item btn-block"
            onClick={() => this.props.onSelect(resource.x, resource.y)}
          >
            {t(resource.resourcetype)} | Q: {resource.quality} | X: {resource.x}{" "}
            | Y: {resource.y}
          </button>
        </li>
      ));
    } else {
      return <div></div>;
    }
  }
}

export default withTranslation()(ResourcesInTheMapList);
