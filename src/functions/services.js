import { getDomain } from "./utils";
import { config } from "../config/config";
import { getMembers, getMemberPermissions } from "./requests/clans/members";

const timeCheck = 300000;
const smallCacheTimeCheck = 60000;
const resourceCacheTimeCheck = 86400000;

export const getStoredItem = (name) => {
  if (name == null) {
    return null;
  }

  let data = localStorage.getItem(name);

  if (data == null) {
    data = sessionStorage.getItem(name);
    if (data != null) {
      if (localStorage.getItem("acceptscookies")) {
        storeItem(name, data);
      }
    }
  }

  return data;
};

export const storeItem = (name, data) => {
  if (name == null || data == null) {
    return;
  }

  if (localStorage.getItem("acceptscookies")) {
    localStorage.setItem(name, data);
  } else {
    sessionStorage.setItem(name, data);
  }
};

export const getCachedData = (name, time = timeCheck) => {
  if (name == null) {
    return null;
  }

  const data = getStoredItem(name);
  const lastDataCheck = getStoredItem(`${name}-lastCheck`);

  if (
    data != null &&
    lastDataCheck != null &&
    lastDataCheck >= Date.now() - time
  ) {
    return JSON.parse(data);
  }
  return null;
};

export const addCachedData = (name, data) => {
  if (name == null || data == null) {
    return;
  }

  storeItem(name, JSON.stringify(data));
  storeItem(`${name}-lastCheck`, Date.now());
};

export const getUserProfile = async () => {
  const cachedData = getCachedData("profile");

  if (cachedData != null) {
    return { success: true, message: cachedData };
  }

  if (getStoredItem("token")) {
    const options = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${getStoredItem("token")}`,
      }
    };

    const response = await request(`${config.REACT_APP_API_URL}/users`, options);
    if (response != null) {
      if (response.status === 200) {
        if (response.data != null) {
          storeItem("discordid", response.data.discordid);
          addCachedData("profile", response.data);
          return { success: true, message: response.data };
        }
        return { success: true, message: "" };
      }

      if (response.status === 205 || response.status === 401) {
        closeSession();
        return {
          success: false,
          message: "Log in again",
        };
      }

      if (response.status === 503) {
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
  const response = await getOurPermssions();

  if (response.success && response.message) {
    return response.message[type] === "1";
  }

  return false;
};

export const getOurPermssions = async () => {
  const cachedData = getCachedData("permissions", smallCacheTimeCheck);

  if (cachedData != null) {
    return { success: true, message: cachedData };
  }
  const profile = getStoredItem("profile");
  let clanid = null;
  let discordid = null;
  if (profile != null) {
    const data = JSON.parse(profile);
    clanid = data.clanid;
    discordid = data.discordid;
  } else {
    const data = await getUserProfile();
    clanid = data.message.clanid;
    discordid = data.message.discordid;
  }

  if (clanid != null && discordid != null) {
    const response = await getUserPermssions(clanid, discordid);
    if (response?.success) {
      addCachedData("permissions", response.message);
      return {
        success: true,
        message: response.message,
      };
    }
    return {
      success: false,
      message: "You don't have access here, try to log in again",
    };
  }
  return {
    success: false,
    message: "You need a clan to enter here",
  };
};

export const getUserPermssions = async (clanid, discordid) => {
  if (clanid != null && discordid != null) {
    const response = await getMemberPermissions(clanid, discordid);
    if (response != null) {
      if (response.status === 200) {
        return { success: true, message: response.data };
      }

      if (response.status === 405 || response.status === 401) {
        closeSession();
        return {
          success: false,
          message: "You don't have access here, try to log in again",
        };
      }

      if (response.status === 503) {
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
  const cachedData = getCachedData("clanInfo", smallCacheTimeCheck);

  if (cachedData != null) {
    return { success: true, message: cachedData };
  }
  const profile = getStoredItem("profile");
  let clanid = null;
  if (profile != null) {
    const data = JSON.parse(profile);
    clanid = data.clanid;
  } else {
    const data = await getUserProfile();
    clanid = data.message.clanid;
  }

  if (clanid != null) {
    const options = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${getStoredItem("token")}`,
      }
    };
    const response = await request(`${config.REACT_APP_API_URL}/clans/${clanid}`, options);
    if (response != null) {
      if (response.status === 200) {
        addCachedData("clanInfo", response.data);
        return { success: true, message: response.data };
      }

      if (response.status === 405 || response.status === 401) {
        closeSession();
        return {
          success: false,
          message: "You don't have access here, try to log in again",
        };
      }

      if (response.status === 503) {
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

export const getCachedMembers = async () => {
  const cachedData = getCachedData("memberList");
  if (cachedData != null) {
    return { success: true, message: cachedData };
  }

  const profile = getStoredItem("profile");
  let clanid = null;
  if (profile != null) {
    const data = JSON.parse(profile);
    clanid = data.clanid;
  } else {
    const data = await getUserProfile();
    clanid = data.message.clanid;
  }

  if (clanid != null) {
    try {
      const response = await getMembers(clanid);
      if (response != null) {
        if (response.status === 200 || response.status === 202) {
          const data = await response.json();
          addCachedData("memberList", data);
          return { success: true, message: data };
        }

        if (response.status === 405 || response.status === 401) {
          closeSession();
          return {
            success: false,
            message: "You don't have access here, try to log in again",
          };
        }

        if (response.status === 503) {
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
    } catch {
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

export const getItems = async () => {
  const cachedData = getCachedData("allItems", resourceCacheTimeCheck);

  if (cachedData != null) {
    return cachedData;
  }
  const options = {
    method: "GET"
  };

  const response = await request(`${getDomain()}/json/items_min.json`, options);
  if (response?.data != null) {
    addCachedData("allItems", response.data);
    return response.data;
  }
  return null;
};

export const getMarkers = async () => {
  const cachedData = getCachedData("markers", resourceCacheTimeCheck);

  if (cachedData != null) {
    return cachedData;
  }
  const options = {
    method: "GET"
  };

  const response = await request("https://raw.githubusercontent.com/dm94/stiletto-web/master/public/json/markers.min.json", options);
  if (response?.data != null) {
    addCachedData("markers", response.data);
    return response.data;
  }
  return null;
};

export const getClusters = async () => {
  const cachedData = getCachedData("clusters", resourceCacheTimeCheck);
  if (cachedData != null) {
    return cachedData;
  }
  const options = {
    method: "GET"
  };

  const response = await request(`${config.REACT_APP_API_URL}/clusters`, options);
  if (response?.data != null) {
    addCachedData("clusters", response.data);
    return response.data;
  }
  return null;
};

export const getMapNames = async () => {
  const cachedData = getCachedData("maps", resourceCacheTimeCheck);

  if (cachedData != null) {
    return cachedData;
  }
  const options = {
    method: "GET"
  };

  const response = await request("https://raw.githubusercontent.com/dm94/stiletto-web/master/public/json/maps.min.json", options);
  if (response?.data != null) {
    addCachedData("maps", response.data);
    return response.data;
  }
  return null;
};

export const closeSession = () => {
  localStorage.clear();
  sessionStorage.clear();
  window.location.reload();
};

export const apiRequest = async (url, options) => {
  const response = await request(url, options);

  if (response != null) {
    switch (response.status) {
      case 200:
      case 201:
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
      case 405:
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

export const request = async (url, options) => {
  try {
    const response = await fetch(url, options);
    const data = await response.json();
    return {
      status: response.status,
      data: data
    };
  } catch {
    return null;
  }
};
