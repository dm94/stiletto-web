import React, { Component } from "react";
import { withTranslation } from "react-i18next";

class CreateResourceTab extends Component {
  state = {
    resourceTypeInput: "Aloe",
    qualityInput: 0,
    toolQualityInput: 0,
    resourceHarvestedQualityInput: 0,
    descriptionInput: null,
  };

  resourcesList(t) {
    if (this.props.items != null) {
      return this.props.items.map((item) => (
        <option key={item.name} value={item.name}>
          {t(item.name)}
        </option>
      ));
    }
  }

  calculateQuality = (tool, harvested) => {
    let quality = 0;
    tool = parseInt(tool);
    harvested = parseInt(harvested);

    if (harvested >= tool) {
      quality = harvested * 2 - tool;
    } else {
      quality = harvested;
    }
    this.setState({ qualityInput: Math.floor(quality) });
  };

  render() {
    const { t } = this.props;
    return (
      <div className="card-body">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            this.props.onCreateResource(
              this.state.resourceTypeInput,
              this.state.qualityInput,
              this.state.descriptionInput
            );
            this.setState({
              resourceTypeInput: "Aloe",
              qualityInput: 0,
              descriptionInput: null,
            });
          }}
        >
          <div className="form-group">
            <label htmlFor="resourcetype">{t("Type")}</label>
            <select
              id="resourcetype"
              className="custom-select"
              value={this.state.resourceTypeInput}
              onChange={(evt) =>
                this.setState({
                  resourceTypeInput: evt.target.value,
                })
              }
            >
              {this.resourcesList(t)}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="coordinateXInput">
              {t("Coordinate")} X ({t("Not the same as in the game")})
            </label>
            <input
              type="text"
              className="form-control"
              name="coordinateXInput"
              value={this.props.coordinateXInput}
              onChange={(evt) => this.props.onChangeX(evt.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="coordinateYInput">
              {t("Coordinate")} Y ({t("Not the same as in the game")})
            </label>
            <input
              type="text"
              className="form-control"
              name="coordinateYInput"
              value={this.props.coordinateYInput}
              onChange={(evt) => this.props.onChangeY(evt.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="toolQuality">
              {t("Quality of your tool")} ({t("Not necessary")}):{" "}
              {this.state.toolQualityInput}
            </label>
            <input
              type="range"
              className="form-control-range"
              id="toolQuality"
              value={this.state.toolQualityInput}
              max="100"
              onChange={(evt) => {
                this.setState({
                  toolQualityInput: evt.target.value,
                });
                this.calculateQuality(
                  evt.target.value,
                  this.state.resourceHarvestedQualityInput
                );
              }}
            />
          </div>
          <div className="form-group">
            <label htmlFor="resourceHarvestedQuality">
              {t("Quality of Harvested Resource")} ({t("Not necessary")}):{" "}
              {this.state.resourceHarvestedQualityInput}
            </label>
            <input
              type="range"
              className="form-control-range"
              id="resourceHarvestedQuality"
              value={this.state.resourceHarvestedQualityInput}
              max="100"
              onChange={(evt) => {
                this.setState({
                  resourceHarvestedQualityInput: evt.target.value,
                });
                this.calculateQuality(
                  this.state.toolQualityInput,
                  evt.target.value
                );
              }}
            />
          </div>
          <div className="form-group">
            <label htmlFor="quality">
              {t("Quality")}: {this.state.qualityInput}
            </label>
            <input
              type="range"
              className="form-control-range"
              id="quality"
              value={this.state.qualityInput}
              max="200"
              onChange={(evt) =>
                this.setState({
                  qualityInput: evt.target.value,
                })
              }
            />
          </div>
          <div className="form-group">
            <label htmlFor="descriptionInput">{t("Description")}</label>
            <input
              type="text"
              className="form-control"
              name="descriptionInput"
              value={this.props.descriptionInput}
              onChange={(evt) =>
                this.setState({
                  descriptionInput: evt.target.value,
                })
              }
              maxLength="100"
            />
          </div>
          <button
            className="btn btn-lg btn-outline-success btn-block"
            type="submit"
            value="Submit"
          >
            {t("Create resource")}
          </button>
        </form>
      </div>
    );
  }
}

export default withTranslation()(CreateResourceTab);
