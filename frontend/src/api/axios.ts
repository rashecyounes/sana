import axios from "axios";

function clearAuthStorage() {
  localStorage.removeItem("user");
  localStorage.removeItem("role");
  localStorage.removeItem("username");
}

const api = axios.create({
  baseURL: "http://localhost:8000/api",
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const deviceId = localStorage.getItem("device_id");
  const deviceName = localStorage.getItem("device_name");

  if (deviceId) {
    config.headers["x-device-id"] = deviceId;
  }

  if (deviceName) {
    config.headers["x-device-name"] = deviceName;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        await axios.post(
          "http://localhost:8000/api/security/refresh/",
          {},
          {
            withCredentials: true,
          }
        );

        return api(originalRequest);

      } catch {
        clearAuthStorage();

        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;