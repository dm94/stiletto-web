import React, { Component } from "react";
import { withTranslation } from "react-i18next";

class SkillNodeBtn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      usersSavedData: [],
      loaded: false,
    };
  }

  render() {
    const { t } = this.props;
    if (this.state.loaded) {
      return <p>{t("Function not yet implemented")}</p>;
    } else {
      return (
        <button
          className="btn btn-primary btn-block"
          onClick={() => {
            this.setState({ loaded: true });
          }}
        >
          {t("See who has learned it")}
        </button>
      );
    }
  }
}

export default withTranslation()(SkillNodeBtn);
