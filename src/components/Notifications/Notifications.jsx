import { Component } from "react";
import { withTranslation } from "react-i18next";

class Notifications extends Component {
  showNotifications() {
    const { t } = this.props;
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
            <div className="toast-header">
              <strong className="mr-auto">{t(data.type)}</strong>
              <button
                type="button"
                className="ml-2 mb-1 close"
                aria-label="Close"
                onClick={() => this.props.close(data.date)}
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="toast-body">{t(data.message)}</div>
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
