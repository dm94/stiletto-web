import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import { getStyle } from "../BGDarkSyles";

class ResourcesInTheMapList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      resourceTypeFilter: "All",
    };
  }

  filterTheResources(r) {
    this.setState({ resourceTypeFilter: r });
    this.props.onFilter(r);
  }

  list(t) {
    if (this.state.resourceTypeFilter !== "All") {
      let resourcesFiltered = this.props.resources.filter(
        (r) => r.resourcetype === this.state.resourceTypeFilter
      );
      return resourcesFiltered.map((resource) => (
        <li key={resource.resourceid}>
          <button
            className={getStyle("list-group-item btn-block")}
            onClick={() => this.props.onSelect(resource.x, resource.y)}
          >
            {t(resource.resourcetype)} | Q: {resource.quality} | X: {resource.x}{" "}
            | Y: {resource.y}
          </button>
        </li>
      ));
    } else {
      return this.props.resources.map((resource) => (
        <li key={resource.resourceid}>
          <button
            className={getStyle("list-group-item btn-block")}
            onClick={() => this.props.onSelect(resource.x, resource.y)}
          >
            {t(resource.resourcetype)} | Q: {resource.quality} | X: {resource.x}{" "}
            | Y: {resource.y}
          </button>
        </li>
      ));
    }
  }

  filterlist(t) {
    let resourceTypes = ["All"];

    this.props.resources.map((resource) => {
      if (resourceTypes.indexOf(resource.resourcetype) === -1) {
        resourceTypes.push(resource.resourcetype);
      }
    });

    return resourceTypes.map((r) => (
      <button
        type="button"
        key={r}
        className={
          r === this.state.resourceTypeFilter
            ? "btn btn-outline-secondary active"
            : "btn btn-outline-secondary"
        }
        onClick={() => this.filterTheResources(r)}
      >
        {t(r)}
      </button>
    ));
  }

  render() {
    const { t } = this.props;
    if (this.props.resources != null) {
      return (
        <div>
          <div className="btn-group btn-group-sm" role="group">
            {this.filterlist(t)}
          </div>
          {this.list(t)}
        </div>
      );
    } else {
      return <div></div>;
    }
  }
}

export default withTranslation()(ResourcesInTheMapList);
