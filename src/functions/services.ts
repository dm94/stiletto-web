const timeCheck = 300000;

const hasStorage = () => {
  try {
    return (
      typeof localStorage !== "undefined" && typeof sessionStorage !== "undefined"
    );
  } catch {
    return false;
  }
};

export const getStoredItem = (name: string) => {
  if (name == null) {
    return null;
  }

  if (!hasStorage()) {
    return null;
  }

  let data: string | null = null;
  try {
    data = localStorage.getItem(name);
  } catch {
    data = null;
  }

  if (data == null) {
    try {
      data = sessionStorage.getItem(name);
      if (data != null && localStorage.getItem("acceptscookies")) {
        storeItem(name, data);
      }
    } catch {
      data = null;
    }
  }

  return data;
};

export const storeItem = (name: string, data: string) => {
  if (name == null || data == null) {
    return;
  }

  if (!hasStorage()) {
    return;
  }

  try {
    if (localStorage.getItem("acceptscookies")) {
      localStorage.setItem(name, data);
    } else {
      sessionStorage.setItem(name, data);
    }
  } catch {
    return;
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
    try {
      return JSON.parse(data);
    } catch {
      return null;
    }
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
  if (hasStorage()) {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch {
      return;
    }
  }

  if ("location" in globalThis && globalThis.location) {
    globalThis.location.reload();
  }
};
