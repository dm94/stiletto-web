import React, { Component, Fragment } from "react";
import { withTranslation } from "react-i18next";
import Icon from "./Icon";

class WalkerListItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      walker: this.props.walker,
    };
  }

  walkerInfo(t) {
    if (this.state.isOpen) {
      return (
        <tr>
          <td colSpan="5">
            <div className="row">
              <div className="col-4">
                <div className="card">
                  <div className="card-body">
                    <div className="input-group">
                      <div className="input-group-prepend">
                        <span className="input-group-text">
                          {t("Walker ID")}
                        </span>
                      </div>
                      <input
                        type="text"
                        className="form-control"
                        value={this.props.walker.walkerID}
                        readOnly
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-4">
                <div className="card">
                  <div className="card-body">
                    <div className="input-group">
                      <div className="input-group-prepend">
                        <span className="input-group-text">
                          {t("Last User")}
                        </span>
                      </div>
                      <input
                        type="text"
                        className="form-control"
                        value={this.props.walker.lastUser}
                        readOnly
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-4">
                <div className="card">
                  <div className="card-body">
                    <div className="input-group">
                      <div className="input-group-prepend">
                        <span className="input-group-text">
                          {t("Last Use")}
                        </span>
                      </div>
                      <input
                        type="text"
                        className="form-control"
                        value={this.props.walker.datelastuse}
                        readOnly
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-3">
                <div className="card">
                  <div className="card-body">
                    <div className="input-group">
                      <div className="input-group-prepend">
                        <span className="input-group-text">{t("Owner")}</span>
                      </div>
                      <input
                        type="text"
                        className="form-control"
                        value={this.props.walker.ownerUser}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-3">
                <div className="card">
                  <div className="card-body">
                    <div className="input-group">
                      <div className="input-group-prepend">
                        <span className="input-group-text">{t("Use")}</span>
                      </div>
                      <select
                        className="form-control"
                        id="inputUse"
                        value={this.state.walker.use}
                        onChange={(evt) => {
                          let walkerCopy = this.state.walker;
                          walkerCopy.use = evt.target.value;
                          this.setState({ walker: walkerCopy });
                        }}
                      >
                        <option>{t("Personal")}</option>
                        <option>{t("PVP")}</option>
                        <option>{t("Farming")}</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-3">
                <div className="card">
                  <div className="card-body">
                    <div className="input-group">
                      <div className="input-group-prepend">
                        <span className="input-group-text">{t("Type")}</span>
                      </div>
                      <select
                        className="form-control"
                        id="inputType"
                        value={this.state.walker.type}
                        onChange={(evt) => {
                          let walkerCopy = this.state.walker;
                          walkerCopy.type = evt.target.value;
                          this.setState({ walker: walkerCopy });
                        }}
                      >
                        {this.props.walkerListTypes.map((name) => {
                          return <option value={name}>{name}</option>;
                        })}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12">
                <div className="row mt-3">
                  <div className="btn-group mx-auto">
                    <button
                      className={
                        this.state.walker.isReady
                          ? "btn btn-success active"
                          : "btn btn-success"
                      }
                      onClick={() => {
                        let walkerCopy = this.state.walker;
                        walkerCopy.isReady = true;
                        this.setState({ walker: walkerCopy });
                      }}
                    >
                      <i className="fas fa-check"></i>
                    </button>
                    <button className="btn btn-secondary" disabled>
                      {t("Is ready?")}
                    </button>
                    <button
                      className={
                        this.props.walker.isReady
                          ? "btn btn-danger"
                          : "btn btn-danger active"
                      }
                      onClick={() => {
                        let walkerCopy = this.state.walker;
                        walkerCopy.isReady = false;
                        this.setState({ walker: walkerCopy });
                      }}
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                </div>
                <div className="row mt-3">
                  <div className="col-xs-12 col-lg-3 mx-auto">
                    <button className="btn btn-block btn-success">
                      {t("Save")}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </td>
        </tr>
      );
    }
  }

  render() {
    const { t } = this.props;
    if (this.props.walker.walkerID != null) {
      return (
        <Fragment>
          <tr>
            <td className="text-center">
              {this.props.walker.type ? (
                <Icon
                  key={this.props.walker.type}
                  name={this.props.walker.type}
                />
              ) : (
                ""
              )}
            </td>
            <td className="text-center">{this.props.walker.name}</td>
            <td className="text-center">
              {this.props.walker.use == null
                ? t("Not Defined")
                : this.props.walker.use}
            </td>
            <td className="text-center">
              {this.props.walker.isReady ? (
                <i className="fas fa-check text-success"></i>
              ) : (
                <i className="fas fa-times text-danger"></i>
              )}
            </td>
            <td
              className="text-center text-info"
              onClick={() =>
                this.setState((state) => ({ isOpen: !state.isOpen }))
              }
              role="button"
            >
              {this.state.isOpen ? (
                <i className="fas fa-eye-slash"></i>
              ) : (
                <i className="fas fa-eye"></i>
              )}
            </td>
          </tr>
          {this.walkerInfo(t)}
        </Fragment>
      );
    } else {
      return "";
    }
  }
}

export default withTranslation()(WalkerListItem);
