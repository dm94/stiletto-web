import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import Axios from "axios";
import { closeSession, getUserPermssions } from "../../services";

class MemberPermissionsConfig extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bot: false,
      diplomacy: false,
      kickmembers: false,
      request: false,
      walkers: false,
    };
  }

  async componentDidMount() {
    let request = await getUserPermssions(
      this.props.clanid,
      this.props.memberid
    );
    if (request) {
      if (request.success) {
        let allPermissions = request.message;
        this.setState({
          bot: allPermissions.bot === "1",
          diplomacy: allPermissions.diplomacy === "1",
          kickmembers: allPermissions.kickmembers === "1",
          request: allPermissions.request === "1",
          walkers: allPermissions.walkers === "1",
        });
      } else {
        this.props.onError(request.message);
      }
    }
  }

  updateMemberPermissions = () => {
    const options = {
      method: "put",
      url:
        process.env.REACT_APP_API_URL +
        "/clans/" +
        this.props.clanid +
        "/members/" +
        this.props.memberid +
        "/permissions",
      params: {
        bot: this.state.bot,
        diplomacy: this.state.diplomacy,
        kickmembers: this.state.kickmembers,
        request: this.state.request,
        walkers: this.state.walkers,
      },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    };
    Axios.request(options)
      .then((response) => {
        if (response.status === 200) {
          this.props.onClose();
        } else if (response.status === 401) {
          closeSession();
          this.props.onError("You don't have access here, try to log in again");
          this.props.onClose();
        } else if (response.status === 503) {
          this.props.onError("Error connecting to database");
          this.props.onClose();
        }
      })
      .catch(() => {
        this.props.onError("Error when connecting to the API");
      });
  };

  render() {
    const { t } = this.props;
    return (
      <div className="modal d-block" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{t("Change Permissions")}</h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
                onClick={() => this.props.onClose()}
              >
                <span aria-hidden="true">X</span>
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <div
                  className="custom-control custom-switch my-1"
                  role="button"
                  title={t("Allow to change bot settings")}
                >
                  <input
                    type="checkbox"
                    className="custom-control-input"
                    id="botInput"
                    checked={this.state.bot}
                    onChange={() =>
                      this.setState((state) => {
                        this.setState({ bot: !state.bot });
                      })
                    }
                  />
                  <label
                    className="custom-control-label"
                    role="button"
                    htmlFor="botInput"
                  >
                    {t("Discord Bot settings")}
                  </label>
                </div>
                <div
                  className="custom-control custom-switch my-1"
                  role="button"
                  title={t("Allow editing walkers")}
                >
                  <input
                    type="checkbox"
                    className="custom-control-input"
                    id="walkersInput"
                    checked={this.state.walkers}
                    onChange={() =>
                      this.setState((state) => {
                        this.setState({ walkers: !state.walkers });
                      })
                    }
                  />
                  <label
                    className="custom-control-label"
                    role="button"
                    htmlFor="walkersInput"
                  >
                    {t("Allow editing walkers")}
                  </label>
                </div>
                <div
                  className="custom-control custom-switch my-1"
                  role="button"
                  title={t("Allow editing diplomacy")}
                >
                  <input
                    type="checkbox"
                    className="custom-control-input"
                    id="diplomacyInput"
                    checked={this.state.diplomacy}
                    onChange={() =>
                      this.setState((state) => {
                        this.setState({ diplomacy: !state.diplomacy });
                      })
                    }
                  />
                  <label
                    className="custom-control-label"
                    role="button"
                    htmlFor="diplomacyInput"
                  >
                    {t("Allow editing diplomacy")}
                  </label>
                </div>
                <div
                  className="custom-control custom-switch my-1"
                  role="button"
                  title={t("Allow management of request")}
                >
                  <input
                    type="checkbox"
                    className="custom-control-input"
                    id="requestInput"
                    checked={this.state.request}
                    onChange={() =>
                      this.setState((state) => {
                        this.setState({ request: !state.request });
                      })
                    }
                  />
                  <label
                    className="custom-control-label"
                    role="button"
                    htmlFor="requestInput"
                  >
                    {t("Allow management of request")}
                  </label>
                </div>
                <div
                  className="custom-control custom-switch my-1"
                  role="button"
                  title={t("Allow kick members")}
                >
                  <input
                    type="checkbox"
                    className="custom-control-input"
                    id="kickmembersInput"
                    checked={this.state.kickmembers}
                    onChange={() =>
                      this.setState((state) => {
                        this.setState({ kickmembers: !state.kickmembers });
                      })
                    }
                  />
                  <label
                    className="custom-control-label"
                    role="button"
                    htmlFor="kickmembersInput"
                  >
                    {t("Allow kick members")}
                  </label>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => this.props.onClose()}
              >
                {t("Close")}
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={this.updateMemberPermissions}
              >
                {t("Save")}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withTranslation()(MemberPermissionsConfig);
