import { Component } from "react";
import { withTranslation } from "react-i18next";

class Notifications extends Component {
  showNotifications() {
    console.log("data", this.props.notifications);
    if (this.props.notifications) {
      return this.props.notifications.map((data) => {
        return (
          <div
            className="toast"
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
            key={`notification-${data.date}`}
          >
            <div className="toast-header">{data.type}</div>
            <div className="toast-body">{data.message}</div>
          </div>
        );
      });
    }
    return "";
  }

  render() {
    return <div className="notifications">{this.showNotifications()}</div>;
  }
}

export default withTranslation()(Notifications);
