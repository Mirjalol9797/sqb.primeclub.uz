import axios from "axios";
import { getAccessToken } from "@/plugins/auth";
import i18n from "@/plugins/i18n";

const $axios = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
});

$axios.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
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
