import Axios from "axios";

const timeCheck = 600000;

export const getUserProfile = async () => {
  const profile = localStorage.getItem("profile");
  const lastCheck = localStorage.getItem("profile-lastCheck");

  if (
    profile != null &&
    lastCheck != null &&
    lastCheck >= Date.now() - timeCheck
  ) {
    return { success: true, message: JSON.parse(profile) };
  } else {
    const options = {
      method: "get",
      url:
        process.env.REACT_APP_API_URL +
        "/users/" +
        localStorage.getItem("discordid"),
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    };

    const response = await apiRequest(options);
    if (response != null) {
      if (response.status === 202) {
        if (response.data != null) {
          localStorage.setItem("profile", JSON.stringify(response.data));
          localStorage.setItem("profile-lastCheck", Date.now());
        }
        return { success: true, message: response.data };
      } else if (response.status === 205 || response.status === 401) {
        localStorage.removeItem("discordid");
        localStorage.removeItem("token");
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
    } else {
      return {
        success: false,
        message: "Error when connecting to the API",
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
      const response = await apiRequest(options);
      if (response != null) {
        if (response.status === 202) {
          if (response.data != null) {
            localStorage.setItem("memberList", JSON.stringify(response.data));
            localStorage.setItem("memberList-lastCheck", Date.now());
          }
          return { success: true, message: response.data };
        } else if (response.status === 405 || response.status === 401) {
          localStorage.removeItem("discordid");
          localStorage.removeItem("token");
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

export const getItems = async () => {
  const items = localStorage.getItem("allItems");

  if (items != null) {
    return JSON.parse(items);
  } else {
    const options = {
      method: "get",
      url: "https://raw.githubusercontent.com/dm94/stiletto-web/master/public/json/items_min.json",
    };

    const response = await apiRequest(options);
    if (response != null && response.data != null) {
      localStorage.setItem("allItems", JSON.stringify(response.data));
      return response.data;
    } else {
      return null;
    }
  }
};

async function apiRequest(options) {
  return Axios.request(options)
    .then((response) => {
      return response;
    })
    .catch(() => {
      return null;
    });
}
