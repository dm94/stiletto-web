import React, { Component } from "react";
import { withTranslation } from "react-i18next";

class TransactionListItem extends Component {
  render() {
    return (
      <tr>
        <td className="text-center">{this.props.transaction.balance}</td>
        <td
          className={
            this.props.transaction.quantity > 0
              ? "text-center text-success"
              : "text-center text-danger"
          }
        >
          {this.props.transaction.quantity}
        </td>
        <td className="text-center">{this.props.transaction.dateofentry}</td>
        <td className="text-center">{this.props.transaction.description}</td>
      </tr>
    );
  }
}

export default withTranslation()(TransactionListItem);
