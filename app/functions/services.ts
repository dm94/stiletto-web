const timeCheck = 300000;

export const getStoredItem = (name: string) => {
  if (name == null) {
    return null;
  }

  let data = localStorage.getItem(name);

  if (data == null) {
    data = sessionStorage.getItem(name);
    if (data != null && localStorage.getItem("acceptscookies")) {
      storeItem(name, data);
    }
  }

  return data;
};

export const storeItem = (name: string, data: string) => {
  if (name == null || data == null) {
    return;
  }

  if (localStorage.getItem("acceptscookies")) {
    localStorage.setItem(name, data);
  } else {
    sessionStorage.setItem(name, data);
  }
};

export const getCachedData = (name: string, time = timeCheck) => {
  if (name == null) {
    return null;
  }

  const data = getStoredItem(name);
  const lastDataCheck = getStoredItem(`${name}-lastCheck`);

  if (
    data != null &&
    lastDataCheck != null &&
    Number(lastDataCheck) >= Date.now() - time
  ) {
    return JSON.parse(data);
  }
  return null;
};

export const addCachedData = (name: string, data: unknown) => {
  if (name == null || data == null) {
    return;
  }

  storeItem(name, JSON.stringify(data));
  storeItem(`${name}-lastCheck`, String(Date.now()));
};

export const closeSession = () => {
  localStorage.clear();
  sessionStorage.clear();
  window.location.reload();
};
