import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { withTranslation } from "react-i18next";
import { sendEvent } from "../page-tracking";

class ModalMessage extends Component {
  state = { redirect: false };

  redirectButton() {
    return (
      <button
        className="btn btn-lg btn-outline-warning btn-block"
        onClick={() => this.setState({ redirect: true })}
      >
        OK
      </button>
    );
  }

  onlyOkButton() {
    return (
      <button
        className="btn btn-lg btn-outline-warning btn-block"
        onClick={() => this.props?.onClickOk()}
      >
        OK
      </button>
    );
  }

  render() {
    const { t } = this.props;
    if (this.props?.message.text === "Error when connecting to the API") {
      localStorage.removeItem("allItems");
      sessionStorage.removeItem("allItems");
      caches.keys().then((names) => {
        for (const name of names) {
          caches.delete(name);
        }
      });
    }
    if (this.state.redirect) {
      return <Redirect to={this.props?.message.redirectPage} />;
    }

    sendEvent("modal", {
      props: {
        action: this.props?.message?.isError ? "Error" : "Information",
        label: this.props?.message?.text,
      },
    });

    return (
      <div className="modal d-block">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="modal">
                {this.props?.message.isError ? t("Error") : t("Information")}
              </h5>
            </div>
            <div className="modal-body">{t(this.props?.message.text)}</div>
            <div className="modal-footer">
              {this.props?.message.redirectPage == null
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
