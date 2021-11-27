import React, { Component, Fragment } from "react";
import { withTranslation } from "react-i18next";
import Icon from "./Icon";

class WalkerListItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      walker: this.props.walker,
      canEdit:
        this.props.isLeader ||
        this.props.walker.ownerUser === this.props.nickname ||
        this.props.walker.lastUser === this.props.nickname,
    };
  }

  walkerInfo(t) {
    if (this.state.isOpen) {
      return (
        <tr>
          <td colSpan="5">
            <div className="row">
              <div className="col-12 col-lg-4">
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
              <div className="col-12 col-lg-4">
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
              <div className="col-12 col-lg-4">
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
              <div className="col-12 col-lg-3">
                <div className="card">
                  <div className="card-body">
                    <div className="input-group">
                      <div className="input-group-prepend">
                        <span className="input-group-text">{t("Owner")}</span>
                      </div>
                      <select
                        className="form-control"
                        id="inputOwner"
                        value={
                          this.state.walker.ownerUser != null
                            ? this.state.walker.ownerUser
                            : ""
                        }
                        onChange={(evt) => {
                          const valueInput = evt.target.value;
                          this.setState((state) => {
                            let walkerCopy = state.walker;
                            walkerCopy.ownerUser = valueInput;
                            this.setState({ walker: walkerCopy });
                          });
                        }}
                        disabled={!this.state.canEdit}
                      >
                        {this.props.memberList != null ? (
                          this.props.memberList.map((member) => {
                            return (
                              <option
                                key={member.discordid}
                                value={member.nickname}
                              >
                                {member.nickname
                                  ? member.nickname
                                  : member.discordtag}
                              </option>
                            );
                          })
                        ) : (
                          <option>{t("No options")}</option>
                        )}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12 col-lg-3">
                <div className="card">
                  <div className="card-body">
                    <div className="input-group">
                      <div className="input-group-prepend">
                        <span className="input-group-text">{t("Use")}</span>
                      </div>
                      <select
                        className="form-control"
                        id="inputUse"
                        value={
                          this.state.walker.walker_use
                            ? this.state.walker.walker_use
                            : "None"
                        }
                        onChange={(evt) => {
                          const valueInput = evt.target.value;
                          this.setState((state) => {
                            let walkerCopy = state.walker;
                            walkerCopy.walker_use = valueInput;
                            this.setState({ walker: walkerCopy });
                          });
                        }}
                        disabled={!this.state.canEdit}
                      >
                        <option value="None">{t("None")}</option>
                        <option value="Personal">{t("Personal")}</option>
                        <option value="PVP">{t("PVP")}</option>
                        <option value="Farming">{t("Farming")}</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12 col-lg-3">
                <div className="card">
                  <div className="card-body">
                    <div className="input-group">
                      <div className="input-group-prepend">
                        <span className="input-group-text">{t("Type")}</span>
                      </div>
                      <select
                        className="form-control"
                        id="inputType"
                        value={
                          this.state.walker.type != null
                            ? this.state.walker.type
                            : ""
                        }
                        onChange={(evt) => {
                          const valueInput = evt.target.value;
                          this.setState((state) => {
                            let walkerCopy = state.walker;
                            walkerCopy.type = valueInput;
                            this.setState({ walker: walkerCopy });
                          });
                        }}
                        disabled={!this.state.canEdit}
                      >
                        <option key={"no-type-select"}></option>
                        );
                        {this.props.walkerListTypes.map((name) => {
                          return (
                            <option key={name} value={name}>
                              {name}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12 col-lg-3">
                <div className="card">
                  <div className="card-body">
                    <div className="input-group">
                      <div className="input-group-prepend">
                        <span className="input-group-text">
                          {t("Description")}
                        </span>
                      </div>
                      <textarea
                        className="form-control"
                        value={
                          this.state.walker.description != null
                            ? this.state.walker.description
                            : ""
                        }
                        onChange={(evt) => {
                          const valueInput = evt.target.value;
                          this.setState((state) => {
                            let walkerCopy = state.walker;
                            walkerCopy.description = valueInput;
                            this.setState({ walker: walkerCopy });
                          });
                        }}
                        maxLength="200"
                        disabled={!this.state.canEdit}
                      ></textarea>
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
                        this.setState((state) => {
                          let walkerCopy = state.walker;
                          walkerCopy.isReady = true;
                          this.setState({ walker: walkerCopy });
                        });
                      }}
                    >
                      <i className="fas fa-check"></i>
                    </button>
                    <button className="btn btn-secondary" disabled>
                      {t("Is ready?")}
                    </button>
                    <button
                      className={
                        this.props.walker.isReady == true
                          ? "btn btn-danger"
                          : "btn btn-danger active"
                      }
                      onClick={() => {
                        this.setState((state) => {
                          let walkerCopy = state.walker;
                          walkerCopy.isReady = false;
                          this.setState({ walker: walkerCopy });
                        });
                      }}
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                </div>
                <div className="row mt-3">
                  <div className="col-12 col-lg-3 mx-auto">
                    <button
                      className="btn btn-block btn-success"
                      onClick={() => {
                        this.props.onSave(this.state.walker);
                        this.setState({ isOpen: false });
                      }}
                    >
                      <i className="fas fa-save"></i> {t("Save")}
                    </button>
                  </div>
                </div>
                <div className="row mt-3">
                  <div className="col-5 col-lg-2 mx-auto">
                    <button
                      className="btn btn-block btn-danger"
                      onClick={() => {
                        this.props.onRemove(this.props.walker.walkerID);
                      }}
                      disabled={!this.state.canEdit}
                    >
                      <i className="fas fa-trash-alt"></i> {t("Delete")}
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
                  key={this.props.walker.type + " Walker"}
                  name={this.props.walker.type + " Walker"}
                  width="30"
                />
              ) : (
                ""
              )}
            </td>
            <td className="text-center">{this.props.walker.name}</td>
            <td className="d-none d-sm-table-cell text-center">
              {this.props.walker.walker_use == null
                ? t("Not Defined")
                : this.props.walker.walker_use}
            </td>
            <td className="d-none d-sm-table-cell text-center">
              {this.props.walker.description}
            </td>
            <td className="text-center">
              {this.props.walker.isReady == true ? (
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
