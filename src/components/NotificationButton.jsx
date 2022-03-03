import React, { Component } from "react";
import { withTranslation } from "react-i18next";

class NotificationButton extends Component {
  constructor(props) {
    super(props);

    this.state = {
      browserNotification: false,
    };
  }

  addResourceToNotification = async () => {
    if (this.state.browserNotification) {
      let { state } = await navigator.permissions.query({
        name: "notifications",
      });
      if (state === "prompt") {
        await Notification.requestPermission();
      }
      if (Notification.permission === "granted") {
        navigator.serviceWorker
          .register("/service-worker.js")
          .then((registration) => {
            registration.showNotification(
              `You can farm the resource ${this.props.resource.resourcetype} with Q${this.props.resource.quality}`,
              {
                tag: this.props.resource.resourceid,
                // eslint-disable-next-line no-undef
                showTrigger: new TimestampTrigger(this.props.fullDate),
                data: {
                  url: window.location.href,
                },
              }
            );
          });
      }
    }
  };

  render() {
    const { t } = this.props;
    return (
      <button
        className={
          this.state.browserNotification
            ? "float-right btn btn-success btn-sm"
            : "float-right btn btn-danger btn-sm"
        }
        onClick={() => {
          this.setState({
            browserNotification: !this.state.browserNotification,
          });
          this.addResourceToNotification();
        }}
        aria-label={t("Schedule a notification")}
        title={t("Schedule a notification")}
      >
        <i
          className={
            this.state.browserNotification ? "fa fa-bell" : "fa fa-bell-slash"
          }
        ></i>
      </button>
    );
  }
}

export default withTranslation()(NotificationButton);
