import { defineStore } from "pinia";
import axios from "@/plugins/api";
import router from "@/router";

export const useLoginStore = defineStore("login", {
  state: () => ({
    token: null,
    user: null,
    phone: null,
    phoneErrorText: null,
    codeErrorText: null,
    isPhoneLogin: true,
    isLoadingGetCode: false,
    isLoadingSendCode: false,
    retryAfter: 0,
    balance: 10000000, // Добавляем баланс по умолчанию
  }),
  getters: {
    // Геттер для получения пользователя
    getUser() {
      return this.user;
    },
    // Геттер для проверки авторизации
    isAuthenticated() {
      return !!this.token && !!this.user;
    },
    // Геттер для форматированного баланса
    formattedBalance() {
      return this.balance.toLocaleString("ru-RU");
    },
  },
  actions: {
    // Функция для списания средств
    deductBalance(amount) {
      if (this.balance >= amount) {
        this.balance -= amount;
        return true;
      }
      return false;
    },

    // Функция для проверки достаточности средств
    hasEnoughBalance(amount) {
      return this.balance >= amount;
    },

    telegramLogin(data) {
      try {
        axios.post(`v1/auth/telegram/login`, data).then((res) => {
          if (res.status === 200) {
            this.token = res.data.data.token;
            // Получаем redirect URL из query параметров
            const urlParams = new URLSearchParams(window.location.search);
            const redirectUrl = urlParams.get("redirect");

            if (redirectUrl) {
              // Перенаправляем на сохраненный URL
              window.location.href = redirectUrl;
            } else {
              // Если нет redirect URL, перезагружаем страницу
              window.location.reload();
            }
            // this.user = res.data.data.user;
          } else {
            console.error("Ошибка api `v1/auth/telegram/login`");
          }
        });
      } catch (error) {
        console.error(error);
      }
    },
    getUserProfile() {
      try {
        axios.get(`v1/my/profile`).then((res) => {
          if (res.status === 200) {
            this.user = res.data.data;
          } else {
            console.error("Ошибка api `v1/my/profile`");
          }
        });
      } catch (error) {
        console.error(error);
      }
    },
    checkAuthToken(router) {
      try {
        axios
          .get(`v1/auth/check`)
          .then((res) => {
            if (res.status === 200) {
              // console.log("Authenticated.");
            } else {
              this.handleLogout(router);
            }
          })
          .catch((error) => {
            console.error("Authentication error:", error);
            this.handleLogout(router);
          });
      } catch (error) {
        console.error("Unexpected error during authentication check:", error);
        this.handleLogout(router);
      }
    },
    handleLogout(router) {
      this.token = null;
      this.user = null;
      localStorage.clear();
      router.push("/offer");
    },
    // phone login
    async getCode(data) {
      try {
        this.isLoadingGetCode = true;
        console.log("Loading started:", this.isLoadingGetCode); // теперь будет видно

        const response = await axios.post(`v1/auth/send-sms`, data);
        console.log("Response:", response);

        if (response.data.data.phone) {
          this.phone = response.data.data.phone;
          this.isPhoneLogin = false;
          this.retryAfter = response.data.data.retry_after;
        }
      } catch (error) {
        console.error("error", error);
        this.phoneErrorText =
          error.response?.data?.message || error.response?.data?.data?.message;
      } finally {
        this.isLoadingGetCode = false;
        console.log("Loading ended:", this.isLoadingGetCode); // теперь будет видно
      }
    },

    async sendCode(data, route) {
      console.log("route", route);

      try {
        this.isLoadingSendCode = true;

        const response = await axios.post(`v1/auth/verify-sms`, data);

        if (response.data.data.token) {
          this.token = response.data.data.token;
          await this.getUserProfile();

          // Получаем redirect URL из query параметров
          const redirectUrl = router.currentRoute.value.query.redirect;

          setTimeout(() => {
            if (redirectUrl) {
              // Перенаправляем на сохраненный URL
              router.push(redirectUrl);
            } else {
              // Если нет redirect URL, переходим на главную
              if (route.meta.locale === "uz") {
                router.push("/uz/offer");
              } else {
                router.push("/offer");
              }
              // router.push({ name: "OfferAll" });
            }
          }, 1000);
        }
      } catch (error) {
        console.error("error send code", error);
        this.codeErrorText =
          error.response?.data?.message || error.response?.data?.data?.message;
      } finally {
        this.isLoadingSendCode = false;
        console.log("Send code loading ended:", this.isLoadingSendCode);
      }
    },
    resetPhoneErrors() {
      this.phoneErrorText = null;
      this.codeErrorText = null;
      this.isPhoneLogin = true;
      this.phone = null;
    },

    logout() {
      // Очищаем состояние store
      this.token = null;
      this.user = null;
      this.phone = null;
      this.phoneErrorText = "";
      this.codeErrorText = "";
      this.isPhoneLogin = true;
      this.isLoadingGetCode = false;
      this.isLoadingSendCode = false;

      // Полностью очищаем localStorage
      localStorage.clear();
    },
  },
  persist: {
    enabled: true,
  },
});
