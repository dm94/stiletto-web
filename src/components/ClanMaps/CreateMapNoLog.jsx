import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import Axios from "axios";
import { getMaps, getStoredItem } from "../../services";
import CreateMapPanel from "./CreateMapPanel";
import { getDomain } from "../../functions/utils";
class CreateMapNoLog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      maps: null,
      error: null,
      mapIdInput: 0,
      mapPassInput: "",
      showShareMap: false,
    };
  }

  async componentDidMount() {
    const maps = await getMaps();
    this.setState({ maps: maps });
  }

  createMap = (event, mapNameInput, mapDateInput, mapSelectInput) => {
    event.preventDefault();
    const options = {
      method: "post",
      url: `${process.env.REACT_APP_API_URL}/maps`,
      params: {
        mapname: mapNameInput,
        mapdate: mapDateInput,
        maptype: `${mapSelectInput}_new`,
      },
    };

    if (getStoredItem("token") != null) {
      options.headers = {
        Authorization: `Bearer ${getStoredItem("token")}`,
      };
    }

    Axios.request(options)
      .then((response) => {
        if (response.status === 201) {
          this.setState({
            mapIdInput: response.data.IdMap,
            mapPassInput: response.data.PassMap,
            showShareMap: true,
          });
        } else if (response.status === 401) {
          this.setState({ error: "Unauthorized" });
        } else if (response.status === 503) {
          this.setState({ error: "Error connecting to database" });
        }
      })
      .catch(() => {
        this.setState({ error: "Error when connecting to the API" });
      });
  };

  shareMapLink() {
    return (
      <input
        className="btn btn-success btn-sm btn-block"
        type="text"
        value={`${getDomain()}/map/${this.state.mapIdInput}?pass=${
          this.state.mapPassInput
        }`}
        disabled
      />
    );
  }
  render() {
    const { t } = this.props;
    const showHideClassName = this.state.showShareMap
      ? "modal d-block"
      : "modal d-none";
    return (
      <div className="row">
        <div className="col-xl-12">
          <div className="card border-secondary mb-3">
            <div className="card-header">
              {t("Open a map that has already been created")}
            </div>
            <div className="card-body text-succes">
              <div className="row">
                <div className="col-xl-3 form-group">
                  <label htmlFor="map_id">{t("Map ID")}</label>
                  <input
                    type="number"
                    className="form-control"
                    id="map_id"
                    name="map_id"
                    maxLength="4"
                    value={this.state.mapIdInput}
                    onChange={(evt) =>
                      this.setState({
                        mapIdInput: evt.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="col-xl-9 form-group">
                  <label htmlFor="map_id">{t("Map Pass")}</label>
                  <input
                    type="text"
                    className="form-control"
                    id="map_pass"
                    name="map_pass"
                    maxLength="30"
                    value={this.state.mapPassInput}
                    onChange={(evt) =>
                      this.setState({
                        mapPassInput: evt.target.value,
                      })
                    }
                    required
                  />
                </div>
              </div>
              <button
                className="btn btn-lg btn-outline-success btn-block"
                type="button"
                onClick={() =>
                  this.props?.onOpen(
                    this.state.mapIdInput,
                    this.state.mapPassInput
                  )
                }
              >
                {t("Open map")}
              </button>
            </div>
          </div>
        </div>
        <CreateMapPanel maps={this.state.maps} onCreateMap={this.createMap} />
        <div className={showHideClassName}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{t("Map created")}</h5>
              </div>
              <div className="modal-body">{this.shareMapLink()}</div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-outline-success btn-block"
                  onClick={() =>
                    this.props?.onOpen(
                      this.state.mapIdInput,
                      this.state.mapPassInput
                    )
                  }
                >
                  {t("Open map")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withTranslation()(CreateMapNoLog);
