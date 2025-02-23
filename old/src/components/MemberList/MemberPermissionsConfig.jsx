import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { updateMemberPermissions } from "../../functions/requests/clans/members";
import { closeSession, getUserPermssions } from "../../functions/services";

const MemberPermissionsConfig = ({ clanid, memberid, onClose, onError }) => {
  const { t } = useTranslation();
  const [permissions, setPermissions] = useState({
    bot: false,
    diplomacy: false,
    kickmembers: false,
    request: false,
    walkers: false,
  });

  useEffect(() => {
    const fetchPermissions = async () => {
      if (!clanid || !memberid) {
        return false;
      }

      const request = await getUserPermssions(clanid, memberid);
      if (request?.success) {
        const allPermissions = request.message;
        setPermissions({
          bot: allPermissions.bot === "1",
          diplomacy: allPermissions.diplomacy === "1",
          kickmembers: allPermissions.kickmembers === "1",
          request: allPermissions.request === "1",
          walkers: allPermissions.walkers === "1",
        });
      } else if (request) {
        onError?.(request.message);
      }
    };

    fetchPermissions();
  }, [clanid, memberid, onError]);

  const handleUpdateMemberPermissions = async () => {
    if (!clanid || !memberid) {
      return false;
    }

    try {
      const response = await updateMemberPermissions(
        clanid,
        memberid,
        permissions
      );

      if (response.status === 200) {
        onClose?.();
      } else if (response.status === 401) {
        closeSession();
        onError?.("You don't have access here, try to log in again");
        onClose?.();
      } else if (response.status === 503) {
        onError?.("Error connecting to database");
        onClose?.();
      }
    } catch {
      onError?.("Error when connecting to the API");
    }
  };

  const togglePermission = (key) => {
    setPermissions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="modal d-block" tabIndex="-1" aria-hidden="true">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{t("Change Permissions")}</h5>
            <button
              type="button"
              className="close"
              data-dismiss="modal"
              aria-label="Close"
              onClick={onClose}
            >
              <span aria-hidden="true">X</span>
            </button>
          </div>
          <div className="modal-body">
            <div className="form-group">
              <div
                className="custom-control custom-switch my-1"
                title={t("Allow to change bot settings")}
              >
                <input
                  type="checkbox"
                  className="custom-control-input"
                  id="botInput"
                  checked={permissions.bot}
                  onChange={() => togglePermission("bot")}
                />
                <label className="custom-control-label" htmlFor="botInput">
                  {t("Discord Bot settings")}
                </label>
              </div>
              <div
                className="custom-control custom-switch my-1"
                title={t("Allow editing walkers")}
              >
                <input
                  type="checkbox"
                  className="custom-control-input"
                  id="walkersInput"
                  checked={permissions.walkers}
                  onChange={() => togglePermission("walkers")}
                />
                <label className="custom-control-label" htmlFor="walkersInput">
                  {t("Allow editing walkers")}
                </label>
              </div>
              <div
                className="custom-control custom-switch my-1"
                title={t("Allow editing diplomacy")}
              >
                <input
                  type="checkbox"
                  className="custom-control-input"
                  id="diplomacyInput"
                  checked={permissions.diplomacy}
                  onChange={() => togglePermission("diplomacy")}
                />
                <label
                  className="custom-control-label"
                  htmlFor="diplomacyInput"
                >
                  {t("Allow editing diplomacy")}
                </label>
              </div>
              <div
                className="custom-control custom-switch my-1"
                title={t("Allow management of request")}
              >
                <input
                  type="checkbox"
                  className="custom-control-input"
                  id="requestInput"
                  checked={permissions.request}
                  onChange={() => togglePermission("request")}
                />
                <label className="custom-control-label" htmlFor="requestInput">
                  {t("Allow management of request")}
                </label>
              </div>
              <div
                className="custom-control custom-switch my-1"
                title={t("Allow kick members")}
              >
                <input
                  type="checkbox"
                  className="custom-control-input"
                  id="kickmembersInput"
                  checked={permissions.kickmembers}
                  onChange={() => togglePermission("kickmembers")}
                />
                <label
                  className="custom-control-label"
                  htmlFor="kickmembersInput"
                >
                  {t("Allow kick members")}
                </label>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              {t("Close")}
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleUpdateMemberPermissions}
            >
              {t("Save")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberPermissionsConfig;
