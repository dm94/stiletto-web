import React from "react";
import { useTranslation } from "react-i18next";
import { getStoredItem } from "../../functions/services";
import { getDomain } from "../../functions/utils";
import { config } from "../../config/config";

const ClanMapItem = ({ map, value, onOpen, onDelete }) => {
  const { t } = useTranslation();

  const showButton = () => (
    <div className="btn-group-vertical w-100 m-0 p-0 h-100">
      <button
        type="button"
        className="btn btn-primary btn-block"
        onClick={() => onOpen(map)}
      >
        <i className="fas fa-eye" /> {t("Show map")}
      </button>
      {deleteMapButton()}
      {shareMapButton()}
    </div>
  );

  const deleteMapButton = () => {
    if (map?.discordid === getStoredItem("discordid")) {
      return (
        <button
          type="button"
          className="btn btn-danger btn-block"
          onClick={() => onDelete(map.mapid)}
        >
          <i className="fas fa-trash-alt" /> {t("Delete map")}
        </button>
      );
    }
    return false;
  };

  const shareMapButton = () => {
    if (map?.discordid === getStoredItem("discordid")) {
      return (
        <button
          type="button"
          className="btn btn-success btn-block"
          onClick={() =>
            window.open(`${getDomain()}/map/${map.mapid}?pass=${map.pass}`)
          }
        >
          <i className="fas fa-share-alt" /> {t("Share map")}
        </button>
      );
    }
    return false;
  };

  const date = new Date();
  const dateBurning = new Date(map?.dateofburning);

  return (
    <div
      className="p-2 col-sm-12 col-xl-4 text-center"
      key={`clanmap${map?.mapid}`}
    >
      <div className="row">
        <button
          type="button"
          className="col-6 pr-0"
          onClick={() => onOpen(map)}
        >
          <img
            src={`${config.REACT_APP_RESOURCES_URL}/maps/${value?.replace(
              "_new",
              ""
            )}.jpg`}
            className="img-fluid"
            alt={map?.name}
          />
        </button>
        <div className="col-6 pl-0">{showButton()}</div>
      </div>
      <h5 className="mb-0">
        {map?.name}{" "}
        <small className={dateBurning <= date ? "text-danger" : "text-success"}>
          {dateBurning.toISOString().split("T")[0]}
        </small>
      </h5>
      <p className="m-0 fw-lighter">{map?.discordTag ?? ""}</p>
    </div>
  );
};

export default ClanMapItem;
