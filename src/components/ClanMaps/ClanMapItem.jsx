import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import { getStoredItem } from "../../services";

class ClanMapItem extends Component {
  showButton() {
    const { t } = this.props;
    return (
      <div className="btn-group-vertical w-100 m-0 p-0 h-100">
        <button
          className="btn btn-primary btn-block"
          variant="primary"
          onClick={() => this.props.onOpen(this.props.map)}
        >
          <i className="fas fa-eye"></i> {t("Show map")}
        </button>
        {this.deleteMapButton(t)}
        {this.ShareMapButton(t)}
      </div>
    );
  }

  deleteMapButton(t) {
    if (this.props.map.discordid === getStoredItem("discordid")) {
      return (
        <button
          className="btn btn-danger btn-block"
          variant="primary"
          onClick={() => this.props.onDelete(this.props.map.mapid)}
        >
          <i className="fas fa-trash-alt"></i> {t("Delete map")}
        </button>
      );
    }
  }

  ShareMapButton(t) {
    if (this.props.map.discordid === getStoredItem("discordid")) {
      let http = window.location.protocol;
      let slashes = http.concat("//");
      let host = slashes.concat(window.location.hostname);
      return (
        <button
          className="btn btn-success btn-block"
          variant="primary"
          onClick={() =>
            window.open(
              host +
                (window.location.port ? ":" + window.location.port : "") +
                "/map/" +
                this.props.map.mapid +
                "?pass=" +
                this.props.map.pass
            )
          }
        >
          <i className="fas fa-share-alt"></i> {t("Share map")}
        </button>
      );
    }
  }

  render() {
    let date = new Date();
    let dateBurning = new Date(this.props.map.dateofburning);
    return (
      <div
        className="p-2 col-sm-12 col-xl-4 text-center"
        key={"clanmap" + this.props.map.mapid}
      >
        <div className="row">
          <div className="col-6 pr-0">
            <img
              src={
                process.env.REACT_APP_RESOURCES_URL +
                "/maps/" +
                this.props.value.replace("_new", "") +
                ".jpg"
              }
              className="img-fluid"
              alt={this.props.map.name}
              onClick={() => this.props.onOpen(this.props.map)}
            />
          </div>
          <div className="col-6 pl-0">{this.showButton()}</div>
        </div>
        <h5 className="mb-0">
          {this.props.map.name}{" "}
          <small
            className={dateBurning <= date ? "text-danger" : "text-success"}
          >
            {this.props.map.dateofburning}
          </small>
        </h5>
        <p className="m-0 fw-lighter">
          {this.props.map.discordTag !== null ? this.props.map.discordTag : ""}
        </p>
      </div>
    );
  }
}

export default withTranslation()(ClanMapItem);
