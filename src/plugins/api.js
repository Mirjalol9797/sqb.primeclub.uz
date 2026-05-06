import axios from "axios";
import i18n from "@/plugins/i18n";

function getPersistedLoginToken() {
  try {
    const raw = localStorage.getItem("login");
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.token || null;
  } catch (error) {
    return null;
  }
}

const $axios = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
});

$axios.interceptors.request.use(
  (config) => {
    const isAuthRequest = String(config.url || "").startsWith("v1/auth/");
    const token = getPersistedLoginToken();
    if (!isAuthRequest && token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      delete config.headers.Authorization;
    }

    // Получаем текущий язык из i18n при каждом запросе
    const currentLocale = i18n.global.locale.value;
    config.headers["Accept-Language"] = currentLocale;
    config.headers["Content-Type"] = "application/json";

    // Отладочная информация
    console.log(
      `🌐 API Request: ${config.method?.toUpperCase()} ${
        config.url
      } - Language: ${currentLocale}`
    );

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default $axios;
