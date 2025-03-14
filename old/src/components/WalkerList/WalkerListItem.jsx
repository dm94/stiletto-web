import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Icon from "../Icon";

const WalkerListItem = ({
  walker,
  isLeader,
  nickname,
  memberList,
  walkerListTypes,
  onSave,
  onRemove,
}) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [walkerState, setWalkerState] = useState(walker);
  const canEdit =
    isLeader || walker.ownerUser === nickname || walker.lastUser === nickname;

  const handleWalkerUpdate = (field, value) => {
    setWalkerState((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const renderWalkerInfo = () => {
    if (!isOpen) {
      return false;
    }

    return (
      <tr>
        <td colSpan="5">
          <div className="row">
            <div className="col-12 col-lg-4">
              <div className="card">
                <div className="card-body">
                  <div className="input-group">
                    <div className="input-group-prepend">
                      <span className="input-group-text">{t("Walker ID")}</span>
                    </div>
                    <input
                      type="text"
                      className="form-control"
                      value={walker.walkerID}
                      readOnly
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-12 col-lg-4">
              <div className="card">
                <div className="card-body">
                  <div className="input-group">
                    <div className="input-group-prepend">
                      <span className="input-group-text">{t("Last User")}</span>
                    </div>
                    <input
                      type="text"
                      className="form-control"
                      value={walker.lastUser}
                      readOnly
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-12 col-lg-4">
              <div className="card">
                <div className="card-body">
                  <div className="input-group">
                    <div className="input-group-prepend">
                      <span className="input-group-text">{t("Last Use")}</span>
                    </div>
                    <input
                      type="text"
                      className="form-control"
                      value={walker.datelastuse}
                      readOnly
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-12 col-lg-3">
              <div className="card">
                <div className="card-body">
                  <div className="input-group">
                    <div className="input-group-prepend">
                      <span className="input-group-text">{t("Owner")}</span>
                    </div>
                    <select
                      className="form-control"
                      id="inputOwner"
                      value={walkerState.ownerUser || ""}
                      onChange={(e) =>
                        handleWalkerUpdate("ownerUser", e.target.value)
                      }
                      disabled={!canEdit}
                    >
                      <option value="clan">{t("Clan")}</option>
                      {memberList?.map((member) => (
                        <option key={member.discordid} value={member.nickname}>
                          {member.nickname || member.discordtag}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-12 col-lg-3">
              <div className="card">
                <div className="card-body">
                  <div className="input-group">
                    <div className="input-group-prepend">
                      <span className="input-group-text">{t("Use")}</span>
                    </div>
                    <select
                      className="form-control"
                      id="inputUse"
                      value={walkerState.walker_use || "None"}
                      onChange={(e) =>
                        handleWalkerUpdate("walker_use", e.target.value)
                      }
                      disabled={!canEdit}
                    >
                      {["None", "Personal", "PVP", "RAM", "Farming"].map(
                        (use) => (
                          <option key={use} value={use}>
                            {t(use)}
                          </option>
                        )
                      )}
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-12 col-lg-3">
              <div className="card">
                <div className="card-body">
                  <div className="input-group">
                    <div className="input-group-prepend">
                      <span className="input-group-text">{t("Type")}</span>
                    </div>
                    <select
                      className="form-control"
                      id="inputType"
                      value={walkerState.type || ""}
                      onChange={(e) =>
                        handleWalkerUpdate("type", e.target.value)
                      }
                      disabled={!canEdit}
                    >
                      <option value="" />
                      {walkerListTypes.map((name) => (
                        <option key={name} value={name}>
                          {name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-12 col-lg-3">
              <div className="card">
                <div className="card-body">
                  <div className="input-group">
                    <div className="input-group-prepend">
                      <span className="input-group-text">
                        {t("Description")}
                      </span>
                    </div>
                    <textarea
                      className="form-control"
                      value={walkerState.description || ""}
                      onChange={(e) =>
                        handleWalkerUpdate("description", e.target.value)
                      }
                      maxLength="200"
                      disabled={!canEdit}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-12">
              <div className="row mt-3">
                <div className="btn-group mx-auto">
                  <button
                    type="button"
                    className={`btn btn-success ${
                      walkerState.isReady ? "active" : ""
                    }`}
                    onClick={() => handleWalkerUpdate("isReady", true)}
                  >
                    <i className="fas fa-check" />
                  </button>
                  <button type="button" className="btn btn-secondary" disabled>
                    {t("Is ready?")}
                  </button>
                  <button
                    type="button"
                    className={`btn btn-danger ${
                      !walkerState.isReady ? "active" : ""
                    }`}
                    onClick={() => handleWalkerUpdate("isReady", false)}
                  >
                    <i className="fas fa-times" />
                  </button>
                </div>
              </div>
              <div className="row mt-3">
                <div className="col-12 col-lg-3 mx-auto">
                  <button
                    type="button"
                    className="btn btn-block btn-success"
                    onClick={() => {
                      onSave(walkerState);
                      setIsOpen(false);
                    }}
                  >
                    <i className="fas fa-save" /> {t("Save")}
                  </button>
                </div>
              </div>
              <div className="row mt-3">
                <div className="col-5 col-lg-2 mx-auto">
                  <button
                    type="button"
                    className="btn btn-block btn-danger"
                    onClick={() => onRemove(walker.walkerID)}
                    disabled={!canEdit}
                  >
                    <i className="fas fa-trash-alt" /> {t("Delete")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </td>
      </tr>
    );
  };

  if (!walker.walkerID) return "";

  return (
    <>
      <tr>
        <td className="text-center">
          {walker.type && (
            <Icon
              key={`${walker.type} Walker`}
              name={`${walker.type} Walker`}
              width="30"
            />
          )}
        </td>
        <td className="text-center">{walker.name}</td>
        <td className="d-none d-sm-table-cell text-center">
          {walker.walker_use || t("Not Defined")}
        </td>
        <td className="d-none d-sm-table-cell text-center">
          {walker.description}
        </td>
        <td className="text-center">
          <i
            className={`fas fa-${
              walker.isReady ? "check text-success" : "times text-danger"
            }`}
          />
        </td>
        <td
          className="text-center text-info"
          onClick={() => setIsOpen(!isOpen)}
          role="button"
          tabIndex={0}
          onKeyPress={(e) => {
            if (e.key === "Enter") setIsOpen(!isOpen);
          }}
        >
          <i className={`fas fa-eye${isOpen ? "-slash" : ""}`} />
        </td>
      </tr>
      {renderWalkerInfo()}
    </>
  );
};

export default WalkerListItem;
