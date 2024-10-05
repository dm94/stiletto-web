import React, { Component } from "react";
import { withTranslation } from "react-i18next";

class Pagination extends Component {
  state = {};
  render() {
    const { t } = this.props;
    return (
      <nav aria-label="pagination">
        <ul className="pagination justify-content-end">
          <li
            className={
              this.props?.currentPage > 1 ? "page-item" : "page-item disabled"
            }
          >
            <button
              type="button"
              className="page-link"
              onClick={() => this.props?.onPrev()}
              aria-disabled={!(this.props?.currentPage > 1)}
            >
              {t("Previous Page")}
            </button>
          </li>
          <li className="page-item active" aria-current="page">
            <button type="button" className="page-link" disabled>
              {this.props?.currentPage}
            </button>
          </li>
          <li
            className={this.props?.hasMore ? "page-item" : "page-item disabled"}
          >
            <button
              type="button"
              className="page-link"
              onClick={() => this.props?.onNext()}
              aria-disabled={this.props?.hasMore}
            >
              {t("Next Page")}
            </button>
          </li>
        </ul>
      </nav>
    );
  }
}

export default withTranslation()(Pagination);
