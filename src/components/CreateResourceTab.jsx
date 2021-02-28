import React, { Component } from "react";
import { withTranslation } from "react-i18next";

class CreateResourceTab extends Component {
  state = {
    resourceTypeInput: "Aloe",
    qualityInput: 0,
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
            <label htmlFor="quality">
              {t("Quality")}: {this.state.qualityInput}
            </label>
            <input
              type="range"
              className="form-control-range"
              id="quality"
              value={this.state.qualityInput}
              max="100"
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
