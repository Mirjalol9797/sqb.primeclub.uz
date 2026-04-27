import axios from "axios";
// import { getAccessToken } from "@/plugins/auth";
import i18n from "@/plugins/i18n";

export const HARD_AUTH_TOKEN =
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiMTI2MzRhMzk2ZDc1YmI4NGU5NDE3NzlmNmQ3YjNjNDdjMWYyNDdjYjRhODJiOTc1MzgxOGM5MTVlMmEyMmUzODQxNmZlYjI5ODZiMDRkOTQiLCJpYXQiOjE3NzcyNjkwNzYuMDAyNzM4LCJuYmYiOjE3NzcyNjkwNzYuMDAyNzQyLCJleHAiOjE3Nzk4NjEwNzYuMDAwNDcsInN1YiI6IjEwNDMiLCJzY29wZXMiOltdfQ.o6s-qOXV4YTCPs8CRvFa7h3BcSho3Ry42b_KR1IuS7hni8gLJ6xQ1kTB8rx81exkyP_v-oJUMmtedU1h5BfSQ7spYOnyMWhFFQ3RyaMgxoEbO_vTka4YVr66abfMY4BnBPlG8arCezt19rFN-QOSk4NaWNMRTKBCohHx81-0LLPVMDOWGmyeJWsShTXilEO1oYY5Vluhk4vEj07XpooZUjJqgFli1lDjpobvs1iJSGux4SHFzz0gq0q8NgnBf0AwDACjoegi-YUJhiXWgiao8rVS1chOvJCCxpHqdwh8j2ZugCK_4_LQcOF76CzJT1kfKJbxJwznSVuqeleAbiu7pRVfbDGUryfEG04chhkDbI1TsUhdCtXxWbJNCPmJPmH_rgSc1QAjX25_eh_CIfb4YrZwPsz2zAiwOdYQ01JrexFHdfYplyqxIt0ueN4RJsaW3VDAFyevOsbt6L1bMtK6d5bngr8ymMj2lGN4rKwW4H1gcoG72mkomxHj6UaG62ajsM9DRuTjUqrdmVbqU1sAPnvMnWL_69_AIED5W9lLU9vSxuYc3LuQtmTtIW1Ti5I0fehy7yq9Kx9QDEHLvge9mezSyO_GyRM4iQ6l9YgUAArQBKnQerVAWumOUPk0rPIhA5afgGiOBjNccJpMCTQMzQ67B_EMhyTjmPBdlKP9_rU";

const $axios = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
});

$axios.interceptors.request.use(
  (config) => {
    config.headers.Authorization = `Bearer ${HARD_AUTH_TOKEN}`;

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
