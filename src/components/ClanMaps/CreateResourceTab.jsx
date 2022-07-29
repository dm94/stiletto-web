import React, { Component } from "react";
import { withTranslation } from "react-i18next";

class CreateResourceTab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      resourceTypeInput:
        this.props.items != null ? this.props.items[0].name : "Aloe Vera",
      qualityInput: 0,
      toolQualityInput: 0,
      resourceHarvestedQualityInput: 0,
      descriptionInput: "",
      lastHarvestedInput: "",
    };
  }

  resourcesList(t) {
    if (this.props.items != null) {
      return this.props.items.map((item) => (
        <option key={item.name} value={item.name}>
          {t(item.name)}
        </option>
      ));
    }
  }

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
              this.state.descriptionInput,
              this.state.lastHarvestedInput
            );
            this.setState({
              resourceTypeInput: "Aloe Vera",
              qualityInput: 0,
              descriptionInput: "",
              toolQualityInput: 0,
              resourceHarvestedQualityInput: 0,
              lastHarvestedInput: "",
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
            <label htmlFor="descriptionInput">{t("Description")}</label>
            <input
              type="text"
              className="form-control"
              name="descriptionInput"
              value={this.state.descriptionInput}
              onChange={(evt) =>
                this.setState({
                  descriptionInput: evt.target.value,
                })
              }
              maxLength="100"
            />
          </div>
          <div className="form-group">
            <label htmlFor="Last Harvested">{t("Last Harvested")}</label>
            <input
              type="datetime-local"
              className="form-control"
              name="Last Harvested"
              value={this.state.lastHarvestedInput}
              onChange={(evt) =>
                this.setState({
                  lastHarvestedInput: evt.target.value,
                })
              }
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
