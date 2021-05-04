import React, { Component, Fragment } from "react";
import { withTranslation } from "react-i18next";

class WalkerListItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isHover: false,
    };
  }

  showButtons() {
    const { t } = this.props;
    if (this.state.isHover) {
      return (
        <td colSpan="5" className="btn-group-lg">
          <div className="row">
            <div className="col">
              <button
                className="btn btn-danger btn-block"
                onClick={() => this.props.onRemove(this.props.walker.walkerID)}
              >
                {t("Delete")}
              </button>
            </div>
          </div>
        </td>
      );
    }
  }

  showWalkerData() {
    return (
      <Fragment>
        <td className="text-center">{this.props.walker.walkerID}</td>
        <td className="text-center">{this.props.walker.name}</td>
        <td className="text-center">{this.props.walker.ownerUser}</td>
        <td className="text-center">{this.props.walker.lastUser}</td>
        <td className="text-center">{this.props.walker.datelastuse}</td>
      </Fragment>
    );
  }

  render() {
    return (
      <tr
        onMouseOver={() => this.setState({ isHover: true })}
        onMouseLeave={() => this.setState({ isHover: false })}
      >
        {this.state.isHover && this.props.walker.walkerID != null
          ? this.showButtons()
          : this.showWalkerData()}
      </tr>
    );
  }
}

export default withTranslation()(WalkerListItem);
