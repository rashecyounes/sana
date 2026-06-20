export function getOrCreateDeviceId(): string {
  const existingDeviceId = localStorage.getItem("device_id");

  if (existingDeviceId) {
    return existingDeviceId;
  }

  const newDeviceId =
    crypto.randomUUID?.() ??
    `device-${Date.now()}-${Math.random().toString(36).substring(2)}`;

  localStorage.setItem("device_id", newDeviceId);

  return newDeviceId;
}

export function getDeviceName(): string {
  const existingDeviceName = localStorage.getItem("device_name");

  if (existingDeviceName) {
    return existingDeviceName;
  }

  const deviceName = `${navigator.platform} - ${navigator.userAgent.slice(
    0,
    60
  )}`;

  localStorage.setItem("device_name", deviceName);

  return deviceName;
}