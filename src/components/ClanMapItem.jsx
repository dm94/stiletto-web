import React, { Component } from "react";
import { withTranslation } from "react-i18next";

class ClanMapItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isHover: false,
    };
  }

  showButton() {
    const { t } = this.props;
    if (this.state.isHover) {
      return (
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
          }}
          className="btn-group-vertical"
        >
          <button
            className="btn btn-primary btn-sm"
            variant="primary"
            onClick={() => this.props.onOpen(this.props.map)}
          >
            {t("Show map")}
          </button>
          {this.deleteMapButton(t)}
          {this.ShareMapButton(t)}
        </div>
      );
    }
  }

  deleteMapButton(t) {
    if (this.props.map.discordid === localStorage.getItem("discordid")) {
      return (
        <button
          className="btn btn-danger btn-sm"
          variant="primary"
          onClick={() => this.props.onDelete(this.props.map.mapid)}
        >
          {t("Delete map")}
        </button>
      );
    }
  }

  ShareMapButton(t) {
    if (this.props.map.discordid === localStorage.getItem("discordid")) {
      var http = window.location.protocol;
      var slashes = http.concat("//");
      var host = slashes.concat(window.location.hostname);
      return (
        <a
          className="btn btn-success btn-sm"
          href={
            host +
            (window.location.port ? ":" + window.location.port : "") +
            "/map?mapid=" +
            this.props.map.mapid +
            "&pass=" +
            this.props.map.pass
          }
          target="_blank"
          rel="noopener noreferrer"
        >
          {t("Share map")}
        </a>
      );
    }
  }

  render() {
    var date = new Date();
    var dateBurning = new Date(this.props.map.dateofburning);
    return (
      <div
        className="m-2 col-sm-2 col-xl-2 text-center"
        key={"clanmap" + this.props.map.mapid}
        onMouseOver={() => this.setState({ isHover: true })}
        onMouseLeave={() => this.setState({ isHover: false })}
      >
        <img
          src={process.env.REACT_APP_MAPS_URL + this.props.value + ".jpg"}
          className="img-fluid"
          alt={this.props.map.name}
        />
        {this.showButton()}
        <h6>
          {this.props.map.name}{" "}
          <small className={dateBurning <= date ? "text-danger" : "text-muted"}>
            {this.props.map.dateofburning}
          </small>
        </h6>
      </div>
    );
  }
}

export default withTranslation()(ClanMapItem);
