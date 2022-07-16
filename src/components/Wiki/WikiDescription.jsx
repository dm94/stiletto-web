import React, { Component } from "react";
import Axios from "axios";
import { withTranslation } from "react-i18next";

class WikiDescription extends Component {
  constructor(props) {
    super(props);
    this.state = {
      description: "",
    };
  }

  componentDidMount() {
    const options = {
      method: "get",
      url: "https://lastoasis.fandom.com/api.php",
      params: {
        action: "query",
        prop: "extracts",
        titles: this.props.name,
        exsentences: 10,
        format: "json",
        origin: "*",
        formatversion: 2,
        exlimit: 1,
        explaintext: 1,
      },
    };
    Axios.request(options)
      .then((response) => {
        if (response.status === 200) {
          if (
            response.data != null &&
            response.data.query &&
            response.data.query.pages
          ) {
            if (
              response.data.query.pages[0] != null &&
              response.data.query.pages[0].extract != null
            ) {
              this.setState({
                description: response.data.query.pages[0].extract,
              });
            }
          }
        }
      })
      .catch(() => {});
  }

  render() {
    if (this.state.description) {
      const { t } = this.props;
      return (
        <div className="col-12">
          <div className="card border-secondary mb-3">
            <div className="card-header">{t("Description by Wiki")}</div>
            <div className="card-body">
              <pre>{this.state.description}</pre>
            </div>
            <div className="card-footer">
              <a
                type="button"
                className="btn btn-lg btn-info btn-block"
                target="_blank"
                rel="noopener noreferrer"
                href={
                  "https://lastoasis.fandom.com/wiki/Special:Search?query=" +
                  this.props.name +
                  "&scope=internal&navigationSearch=true"
                }
              >
                {t("Wiki")}
              </a>
            </div>
          </div>
        </div>
      );
    }
    return "";
  }
}

export default withTranslation()(WikiDescription);
