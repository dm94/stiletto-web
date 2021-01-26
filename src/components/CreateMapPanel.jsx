import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import MapSelectList from "./MapSelectList";
import { getStyle } from "../BGDarkSyles";

class CreateMapPanel extends Component {
  state = { mapNameInput: "", mapDateInput: "", mapSelectInput: "Canyon" };

  render() {
    const { t } = this.props;
    return (
      <div className="col-xl-12">
        <div className={getStyle("card border-secondary mb-3")}>
          <div className="card-header">{t("New Map")}</div>
          <div className="card-body text-succes">
            <form
              onSubmit={(evt) =>
                this.props.onCreateMap(
                  evt,
                  this.state.mapNameInput,
                  this.state.mapDateInput,
                  this.state.mapSelectInput
                )
              }
            >
              <div className="row">
                <div className="col-xl-6 col-sm-12 form-group">
                  <label htmlFor="map_name">{t("Map Name")}</label>
                  <input
                    type="text"
                    className={getStyle("form-control")}
                    id="map_name"
                    name="map_name"
                    maxLength="30"
                    value={this.state.mapNameInput}
                    onChange={(evt) =>
                      this.setState({
                        mapNameInput: evt.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="col-xl-6 col-sm-12 form-group">
                  <label htmlFor="map_date">{t("Date of burning")}</label>
                  <input
                    type="date"
                    className={getStyle("form-control")}
                    id="map_date"
                    name="map_date"
                    value={this.state.mapDateInput}
                    onChange={(evt) =>
                      this.setState({
                        mapDateInput: evt.target.value,
                      })
                    }
                    required
                  />
                </div>
              </div>
              <div className="col-xl-12 col-sm-12 form-group">
                <p className="text-center">{t("Map Type")}</p>
                <div name="mapselect" className="row">
                  <MapSelectList
                    maps={this.props.maps}
                    mapSelectInput={this.state.mapSelectInput}
                    onSelectMap={(m) => this.setState({ mapSelectInput: m })}
                  />
                </div>
              </div>
              <button
                className="btn btn-lg btn-outline-success btn-block"
                type="submit"
                value="Submit"
              >
                {t("Create new map")}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default withTranslation()(CreateMapPanel);
