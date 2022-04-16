import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import Axios from "axios";

class SkillNodeBtn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      usersSavedData: [],
      loaded: false,
    };
  }

  getLearned() {
    if (localStorage.getItem("token") != null) {
      Axios.get(
        process.env.REACT_APP_API_URL + "/clans/" + this.props.clan + "/tech",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          params: {
            tree: this.props.tree,
            tech: this.props.item.name,
          },
        }
      )
        .then((response) => {
          if (response.data) {
            let all = [];
            response.data.forEach((user) => {
              all.push(user.discordtag);
            });
            this.setState({ loaded: true, usersSavedData: all });
          } else {
            this.setState({ loaded: true });
          }
        })
        .catch(() => {
          this.setState({
            loaded: true,
            error: "Error when connecting to the API",
          });
        });
    }
  }

  render() {
    const { t } = this.props;
    if (
      this.state.usersSavedData != null &&
      this.state.usersSavedData.length > 0
    ) {
      return (
        <ul className="list-group list-group-horizontal flex-wrap">
          {this.state.usersSavedData.map((user, i) => (
            <li
              key={user + this.props.item.name + i}
              className="list-group-item"
            >
              {user}
            </li>
          ))}
        </ul>
      );
    } else if (this.state.loaded) {
      return <p>{t("No one has learnt it")}</p>;
    } else {
      return (
        <button
          className="btn btn-primary btn-block"
          onClick={() => this.getLearned()}
        >
          {t("See who has learned it")}
        </button>
      );
    }
  }
}

export default withTranslation()(SkillNodeBtn);
