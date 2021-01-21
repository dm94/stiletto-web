import React, { Component } from "react";
import { BrowserRouter as Router, Redirect } from "react-router-dom";
import { withTranslation } from "react-i18next";
import { getStyle } from "./BGDarkSyles";

class ModalMessage extends Component {
  state = { redirect: false };

  redirectButton() {
    return (
      <button
        className="btn btn-lg btn-outline-warning btn-block"
        onClick={(e) => this.setState({ redirect: true })}
      >
        OK
      </button>
    );
  }

  onlyOkButton() {
    return (
      <button
        className="btn btn-lg btn-outline-warning btn-block"
        onClick={(e) => this.props.onClickOk()}
      >
        OK
      </button>
    );
  }

  render() {
    const { t } = this.props;
    if (this.state.redirect) {
      return <Redirect to={this.props.message.redirectPage} />;
    }
    return (
      <div className="modal d-block">
        <div className="modal-dialog">
          <div className={getStyle("modal-content")}>
            <div className="modal-header">
              <h5 className="modal-title" id="modal">
                {this.props.message.isError ? t("Error") : t("Information")}
              </h5>
            </div>
            <div className="modal-body">{this.props.message.text}</div>
            <div className="modal-footer">
              {this.props.message.redirectPage == null
                ? this.onlyOkButton()
                : this.redirectButton()}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withTranslation()(ModalMessage);
