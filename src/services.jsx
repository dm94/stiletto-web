import Axios from "axios";

const timeCheck = 300000;
const smallCacheTimeCheck = 60000;

export const getUserProfile = async () => {
  const profile = localStorage.getItem("profile");
  const lastCheck = localStorage.getItem("profile-lastCheck");

  if (
    profile != null &&
    lastCheck != null &&
    lastCheck >= Date.now() - timeCheck
  ) {
    return { success: true, message: JSON.parse(profile) };
  } else if (localStorage.getItem("token")) {
    const options = {
      method: "get",
      url: process.env.REACT_APP_API_URL + "/users",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    };

    const response = await request(options);
    if (response != null) {
      if (response.status === 200) {
        if (response.data != null) {
          localStorage.setItem("discordid", response.data.discordid);
          if (localStorage.getItem("acceptscookies")) {
            localStorage.setItem("profile", JSON.stringify(response.data));
            localStorage.setItem("profile-lastCheck", Date.now());
          }
          return { success: true, message: response.data };
        }
        return { success: true, message: "" };
      } else if (response.status === 205 || response.status === 401) {
        closeSession();
        return {
          success: false,
          message: "Log in again",
        };
      } else if (response.status === 503) {
        return {
          success: false,
          message: "Error connecting to database",
        };
      }
    }
    closeSession();
    return {
      success: false,
      message: "Log in again",
    };
  }
  return {
    success: false,
    message: "You need to be logged in to view this section",
  };
};

export const getHasPermissions = async (type) => {
  let response = await getOurPermssions();

  if (response.success && response.message) {
    return response.message[type] === "1";
  }

  return false;
};

export const getOurPermssions = async () => {
  const permissions = localStorage.getItem("permissions");
  const lastCheck = localStorage.getItem("permissions-lastCheck");

  if (
    permissions != null &&
    lastCheck != null &&
    lastCheck >= Date.now() - timeCheck
  ) {
    return { success: true, message: JSON.parse(permissions) };
  } else {
    const profile = localStorage.getItem("profile");
    let clanid = null;
    let discordid = null;
    if (profile != null) {
      let data = JSON.parse(profile);
      clanid = data.clanid;
      discordid = data.discordid;
    } else {
      let data = await getUserProfile();
      clanid = data.message.clanid;
      discordid = data.message.discordid;
    }

    if (clanid != null && discordid != null) {
      let response = await getUserPermssions(clanid, discordid);
      if (response != null && response.success) {
        if (
          response.message != null &&
          localStorage.getItem("acceptscookies")
        ) {
          localStorage.setItem("permissions", JSON.stringify(response.message));
          localStorage.setItem("permissions-lastCheck", Date.now());
        }
        return {
          success: true,
          message: response.message,
        };
      }
      return {
        success: false,
        message: "You don't have access here, try to log in again",
      };
    } else {
      return {
        success: false,
        message: "You need a clan to enter here",
      };
    }
  }
};

export const getUserPermssions = async (clanid, discordid) => {
  if (clanid != null && discordid != null) {
    const options = {
      method: "get",
      url:
        process.env.REACT_APP_API_URL +
        "/clans/" +
        clanid +
        "/members/" +
        discordid +
        "/permissions",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    };
    const response = await request(options);
    if (response != null) {
      if (response.status === 200) {
        return { success: true, message: response.data };
      } else if (response.status === 405 || response.status === 401) {
        closeSession();
        return {
          success: false,
          message: "You don't have access here, try to log in again",
        };
      } else if (response.status === 503) {
        return {
          success: false,
          message: "Error connecting to database",
        };
      }
    } else {
      return {
        success: false,
        message: "Error when connecting to the API",
      };
    }
  } else {
    return {
      success: false,
      message: "You need a clan to enter here",
    };
  }
};

export const getClanInfo = async () => {
  const clanData = localStorage.getItem("clanInfo");
  const lastCheck = localStorage.getItem("clanInfo-lastCheck");

  if (
    clanData != null &&
    lastCheck != null &&
    lastCheck >= Date.now() - smallCacheTimeCheck
  ) {
    return { success: true, message: JSON.parse(clanData) };
  } else {
    const profile = localStorage.getItem("profile");
    let clanid = null;
    if (profile != null) {
      let data = JSON.parse(profile);
      clanid = data.clanid;
    } else {
      let data = this.getUserProfile();
      clanid = data.message.clanid;
    }

    if (clanid != null) {
      const options = {
        method: "get",
        url: process.env.REACT_APP_API_URL + "/clans/" + clanid,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      };
      const response = await request(options);
      if (response != null) {
        if (response.status === 200) {
          if (response.data != null && localStorage.getItem("acceptscookies")) {
            localStorage.setItem("clanInfo", JSON.stringify(response.data));
            localStorage.setItem("clanInfo-lastCheck", Date.now());
          }
          return { success: true, message: response.data };
        } else if (response.status === 405 || response.status === 401) {
          closeSession();
          return {
            success: false,
            message: "You don't have access here, try to log in again",
          };
        } else if (response.status === 503) {
          return {
            success: false,
            message: "Error connecting to database",
          };
        }
      } else {
        return {
          success: false,
          message: "Error when connecting to the API",
        };
      }
    } else {
      return {
        success: false,
        message: "You need a clan to enter here",
      };
    }
  }
};

export const getMembers = async () => {
  const members = localStorage.getItem("memberList");
  const lastCheck = localStorage.getItem("memberList-lastCheck");

  if (
    members != null &&
    lastCheck != null &&
    lastCheck >= Date.now() - timeCheck
  ) {
    return { success: true, message: JSON.parse(members) };
  } else {
    const profile = localStorage.getItem("profile");
    let clanid = null;
    if (profile != null) {
      let data = JSON.parse(profile);
      clanid = data.clanid;
    } else {
      let data = this.getUserProfile();
      clanid = data.message.clanid;
    }

    if (clanid != null) {
      const options = {
        method: "get",
        url: process.env.REACT_APP_API_URL + "/clans/" + clanid + "/members",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      };
      const response = await request(options);
      if (response != null) {
        if (response.status === 202) {
          if (response.data != null && localStorage.getItem("acceptscookies")) {
            localStorage.setItem("memberList", JSON.stringify(response.data));
            localStorage.setItem("memberList-lastCheck", Date.now());
          }
          return { success: true, message: response.data };
        } else if (response.status === 405 || response.status === 401) {
          closeSession();
          return {
            success: false,
            message: "You don't have access here, try to log in again",
          };
        } else if (response.status === 503) {
          return {
            success: false,
            message: "Error connecting to database",
          };
        }
      } else {
        return {
          success: false,
          message: "Error when connecting to the API",
        };
      }
    } else {
      return {
        success: false,
        message: "You need a clan to enter here",
      };
    }
  }
};

export const updateResourceTime = (mapId, resoruceId, token, date) => {
  const options = {
    method: "put",
    url:
      process.env.REACT_APP_API_URL +
      "/maps/" +
      mapId +
      "/resources/" +
      resoruceId,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    params: {
      token: token,
      harvested: date,
    },
  };
  request(options);
};

export const getItems = async () => {
  const items = localStorage.getItem("allItems");
  const lastCheck = localStorage.getItem("items-lastCheck");

  if (
    items != null &&
    lastCheck != null &&
    lastCheck >= Date.now() - 86400000
  ) {
    return JSON.parse(items);
  } else {
    const options = {
      method: "get",
      url: "https://raw.githubusercontent.com/dm94/stiletto-web/master/public/json/items_min.json",
    };

    const response = await request(options);
    if (response != null && response.data != null) {
      if (localStorage.getItem("acceptscookies")) {
        localStorage.setItem("allItems", JSON.stringify(response.data));
      }
      return response.data;
    } else {
      return null;
    }
  }
};

export const getMarkers = async () => {
  const options = {
    method: "get",
    url: "https://raw.githubusercontent.com/dm94/stiletto-web/master/public/json/markers.min.json",
  };

  const response = await request(options);
  if (response != null && response.data != null) {
    if (localStorage.getItem("acceptscookies")) {
      localStorage.setItem("allItems", JSON.stringify(response.data));
    }
    return response.data;
  } else {
    return null;
  }
};

export const getMaps = async () => {
  const options = {
    method: "get",
    url: "https://raw.githubusercontent.com/dm94/stiletto-web/master/public/json/maps.min.json",
  };

  const response = await request(options);
  if (response != null && response.data != null) {
    if (localStorage.getItem("acceptscookies")) {
      localStorage.setItem("allItems", JSON.stringify(response.data));
    }
    return response.data;
  } else {
    return null;
  }
};

export const getResources = async (mapId, mapPass) => {
  const options = {
    method: "get",
    url: process.env.REACT_APP_API_URL + "/maps/" + mapId + "/resources",
    params: {
      mappass: mapPass,
    },
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };

  return await apiRequest(options);
};

export const deleteResource = async (mapId, resourceId, resourceToken) => {
  const options = {
    method: "delete",
    url:
      process.env.REACT_APP_API_URL +
      "/maps/" +
      mapId +
      "/resources/" +
      resourceId,
    params: {
      token: resourceToken,
    },
  };

  return await apiRequest(options);
};

export const createResource = async (
  mapId,
  coordinateXInput,
  coordinateYInput,
  mapPass,
  resourceTypeInput,
  qualityInput,
  descriptionInput,
  lastHarvested
) => {
  const options = {
    method: "post",
    url: process.env.REACT_APP_API_URL + "/maps/" + mapId + "/resources",
    params: {
      mapid: mapId,
      resourcetype: resourceTypeInput,
      quality: qualityInput,
      x: coordinateXInput,
      y: coordinateYInput,
      description: descriptionInput,
      mappass: mapPass,
      harvested: lastHarvested,
    },
  };

  return await apiRequest(options);
};

export const closeSession = () => {
  localStorage.removeItem("discordid");
  localStorage.removeItem("token");
  localStorage.removeItem("profile-lastCheck");
  localStorage.removeItem("profile");
  localStorage.removeItem("memberList");
  localStorage.removeItem("clanInfo");
  localStorage.removeItem("clanInfo-lastCheck");
};

export const apiRequest = async (options) => {
  const response = await request(options);

  if (response != null) {
    switch (response.status) {
      case 200:
        return {
          success: true,
          message: response.data,
        };
      case 202:
        return {
          success: true,
          message: response.data,
        };
      case 204:
        return {
          success: true,
          message: "",
        };
      case 401:
        return {
          success: false,
          message: "You do not have permissions",
        };
      case 503:
        return {
          success: false,
          message: "Error connecting to database",
        };
      default:
        return {
          success: false,
          message: "Error when connecting to the API",
        };
    }
  }
  return {
    success: false,
    message: "Error when connecting to the API",
  };
};

export const request = async (options) => {
  return Axios.request(options)
    .then((response) => {
      return response;
    })
    .catch(() => {
      return null;
    });
};
