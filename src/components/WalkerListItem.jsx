import React, { Component, Fragment } from "react";
import { withTranslation } from "react-i18next";

class WalkerListItem extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { t } = this.props;
    if (this.props.walker.walkerID != null) {
      return (
        <tr
          onMouseOver={() => this.setState({ isHover: true })}
          onMouseLeave={() => this.setState({ isHover: false })}
        >
          <td className="text-center">{this.props.walker.walkerID}</td>
          <td className="text-center">{this.props.walker.name}</td>
          <td className="text-center">{this.props.walker.ownerUser}</td>
          <td className="text-center">{this.props.walker.lastUser}</td>
          <td className="text-center">{this.props.walker.datelastuse}</td>
          <td className="text-center">
            <button
              className="btn btn-danger btn-block"
              onClick={() => this.props.onRemove(this.props.walker.walkerID)}
            >
              {t("Delete")}
            </button>
          </td>
        </tr>
      );
    } else {
      return "";
    }
  }
}

export default withTranslation()(WalkerListItem);
