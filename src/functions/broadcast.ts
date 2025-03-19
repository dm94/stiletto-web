const notificationsChannel = "notifications";

const sendNotification = (message: string, type = "Information") => {
  const channel = new BroadcastChannel(notificationsChannel);
  channel.postMessage({ date: Date.now(), type, message });
  channel.close();
};

export { sendNotification };
