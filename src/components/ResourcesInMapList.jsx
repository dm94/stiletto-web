import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import Icon from "./Icon";

class ResourcesInMapList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      resourceTypeFilter: "All",
    };
  }

  filterTheResources = (r) => {
    this.setState({ resourceTypeFilter: r });
    this.props.onFilter(r);
  };

  list(t) {
    if (this.state.resourceTypeFilter !== "All") {
      let resourcesFiltered = this.props.resources.filter(
        (r) => r.x != null && r.resourcetype === this.state.resourceTypeFilter
      );
      return resourcesFiltered.map((resource) => (
        <li className="list-group-item text-center" key={resource.resourceid}>
          <button
            className="btn btn-block"
            onClick={() => this.props.onSelect(resource.x, resource.y)}
          >
            <Icon
              key={"icon-rmap-" + resource.resourceid}
              name={resource.resourcetype}
            />
            {t(resource.resourcetype)}{" "}
            {resource.quality > 0 && "| Q: " + resource.quality}
          </button>
        </li>
      ));
    } else {
      return this.props.resources
        .filter((r) => r.x != null)
        .map((resource) => (
          <li className="list-group-item text-center" key={resource.resourceid}>
            <button
              className="btn btn-block"
              onClick={() => this.props.onSelect(resource.x, resource.y)}
            >
              <Icon
                key={"icon-rmap-" + resource.resourceid}
                name={resource.resourcetype}
              />
              {t(resource.resourcetype)}{" "}
              {resource.quality > 0 && "| Q: " + resource.quality}
            </button>
          </li>
        ));
    }
  }

  filterlist(t) {
    let resourceTypes = ["All"];

    this.props.resources.forEach((resource) => {
      if (
        resource.x != null &&
        resourceTypes.indexOf(resource.resourcetype) === -1
      ) {
        resourceTypes.push(resource.resourcetype);
      }
    });

    return resourceTypes.map((r) => (
      <button
        type="button"
        key={r}
        className={
          r === this.state.resourceTypeFilter
            ? "btn btn-secondary active"
            : "btn btn-secondary"
        }
        onClick={() => this.filterTheResources(r)}
      >
        <Icon key={"icon-rlist-" + r} name={r} />
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
          <ul className="list-group">{this.list(t)}</ul>
        </div>
      );
    } else {
      return <div></div>;
    }
  }
}

export default withTranslation()(ResourcesInMapList);
