<script setup>
import { computed, onUnmounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "@/plugins/api";
import { useLoginStore } from "@/stores/login";

const router = useRouter();
const route = useRoute();
const loginStore = useLoginStore();

const step = ref("phone");
const phone = ref("+998 ");
const phoneError = ref("");
const codeError = ref("");
const isSendingPhone = ref(false);
const isSendingCode = ref(false);
const smsCode = ref(["", "", "", ""]);
const codeInputs = ref([]);
const retryAfter = ref(0);
let retryInterval = null;

const phoneDigits = computed(() => {
  let digits = phone.value.replace(/\D/g, "");
  if (digits.startsWith("998")) digits = digits.slice(3);
  return digits.slice(0, 9);
});

const isPhoneComplete = computed(() => phoneDigits.value.length === 9);
const isCodeComplete = computed(() =>
  smsCode.value.every((digit) => String(digit).length === 1)
);

const canSubmitPhone = computed(
  () => isPhoneComplete.value && !isSendingPhone.value
);
const canSubmitCode = computed(
  () => isCodeComplete.value && !isSendingCode.value
);
const canResend = computed(
  () => retryAfter.value <= 0 && !isSendingPhone.value
);

function formatPhoneMask(rawValue) {
  let digits = rawValue.replace(/\D/g, "");
  if (digits.startsWith("998")) digits = digits.slice(3);
  digits = digits.slice(0, 9);

  const p1 = digits.slice(0, 2);
  const p2 = digits.slice(2, 5);
  const p3 = digits.slice(5, 7);
  const p4 = digits.slice(7, 9);

  let masked = "+998";
  if (p1) masked += ` ${p1}`;
  if (p2) masked += ` ${p2}`;
  if (p3) masked += ` ${p3}`;
  if (p4) masked += ` ${p4}`;
  return masked;
}

function getBackendPhone() {
  const d = phoneDigits.value;
  return `+998 ${d.slice(0, 5)}-${d.slice(5, 7)}-${d.slice(7, 9)}`;
}

function onPhoneInput(event) {
  phone.value = formatPhoneMask(event.target.value);
  if (phoneError.value) phoneError.value = "";
}

function onPhoneKeydown(event) {
  const controlKeys = [
    "Backspace",
    "Delete",
    "ArrowLeft",
    "ArrowRight",
    "Tab",
    "Home",
    "End",
  ];

  if (controlKeys.includes(event.key)) return;

  if (!/^\d$/.test(event.key)) {
    event.preventDefault();
    return;
  }

  if (phoneDigits.value.length >= 9) {
    event.preventDefault();
  }
}

function startRetryTimer(seconds) {
  if (retryInterval) clearInterval(retryInterval);
  retryAfter.value = Number(seconds) || 0;

  if (retryAfter.value <= 0) return;
  retryInterval = setInterval(() => {
    retryAfter.value -= 1;
    if (retryAfter.value <= 0) {
      clearInterval(retryInterval);
      retryInterval = null;
    }
  }, 1000);
}

async function submitPhone() {
  phoneError.value = "";
  codeError.value = "";
  if (!isPhoneComplete.value) {
    phoneError.value = "Поле обязательно для заполнения";
    return;
  }

  try {
    isSendingPhone.value = true;
    const response = await axios.post("v1/auth/send-sms", {
      phone: getBackendPhone(),
    });

    if (response?.data?.data?.status === true) {
      step.value = "code";
      startRetryTimer(response?.data?.data?.retry_after || 60);
      return;
    }
    phoneError.value = response?.data?.data?.message || "Ошибка отправки SMS";
  } catch (error) {
    phoneError.value = error?.response?.data?.message || "Ошибка отправки SMS";
  } finally {
    isSendingPhone.value = false;
  }
}

function handleCodeInput(index, event) {
  const value = String(event.target.value || "")
    .replace(/\D/g, "")
    .slice(0, 1);
  smsCode.value[index] = value;
  if (codeError.value) codeError.value = "";

  if (value && index < 3) {
    codeInputs.value[index + 1]?.focus();
  }
}

function handleCodeKeydown(index, event) {
  if (event.key === "Backspace" && !smsCode.value[index] && index > 0) {
    codeInputs.value[index - 1]?.focus();
  }
}

function changePhone() {
  step.value = "phone";
  smsCode.value = ["", "", "", ""];
  codeError.value = "";
}

async function submitCode() {
  codeError.value = "";
  if (!isCodeComplete.value) {
    codeError.value = "Поле обязательно для заполнения";
    return;
  }

  try {
    isSendingCode.value = true;
    const response = await axios.post("v1/auth/verify-sms", {
      phone: getBackendPhone(),
      sms_code: smsCode.value.join(""),
    });

    if (response?.data?.data?.status === true && response?.data?.data?.token) {
      const authToken = response.data.data.token;
      const authUser = response.data.data.user || null;

      loginStore.$patch({
        token: authToken,
        user: authUser,
      });

      // Явно дублируем в localStorage, чтобы токен гарантированно был после refresh
      localStorage.setItem(
        "login",
        JSON.stringify({
          token: authToken,
          user: authUser,
        })
      );

      const redirectUrl = route.query.redirect;
      if (redirectUrl) {
        router.push(String(redirectUrl));
      } else if (route.meta.locale === "uz") {
        router.push("/uz/offer");
      } else {
        router.push("/offer");
      }
      return;
    }

    codeError.value = response?.data?.message || "Ошибка подтверждения";
  } catch (error) {
    codeError.value = error?.response?.data?.message || "Ошибка подтверждения";
  } finally {
    isSendingCode.value = false;
  }
}

onUnmounted(() => {
  if (retryInterval) clearInterval(retryInterval);
});
</script>

<template>
  <div class="min-h-screen text-white px-6 py-8">
    <div class="h-[90vh] flex flex-col justify-between">
      <div class="w-full" v-if="step === 'phone'">
        <h1 class="text-3xl font-bold mb-1 text-center">Добро пожаловать</h1>
        <p class="text-base text-[#aab3c4] mb-10 text-center">
          Введите номер телефона для входа
        </p>

        <div class="max-w-[380px] mx-auto">
          <div class="text-[#8d97aa] text-sm mb-3">Номер телефона</div>
          <input
            :value="phone"
            @input="onPhoneInput"
            @keydown="onPhoneKeydown"
            type="tel"
            maxlength="17"
            placeholder="+998 91 000 00 00"
            class="w-full h-16 rounded-2xl bg-[#0c0f15] border border-[#131926] px-6 font-semibold text-white mb-2 outline-none"
          />
          <div v-if="phoneError" class="text-[#ff5f5f] text-sm mb-4">
            {{ phoneError }}
          </div>

          <button
            type="button"
            class="w-full min-h-12 rounded-2xl text-base font-semibold transition mt-4"
            :class="
              canSubmitPhone
                ? 'bg-white text-black'
                : 'bg-[#8b8f99] text-[#1f2229] cursor-not-allowed'
            "
            :disabled="!canSubmitPhone"
            @click="submitPhone"
          >
            Войти
          </button>
        </div>
      </div>

      <div class="w-full" v-else>
        <button @click="changePhone">
          <img src="/icons/p-offer/back.svg" alt="" class="w-5" />
        </button>
        <h1 class="text-3xl font-bold mb-1 text-center">Подтверждение</h1>
        <p class="text-sm text-[#aab3c4] mb-4 text-center">
          Введите код из СМС, отправленный на номер
        </p>
        <div class="text-xl font-semibold mb-10 text-center">{{ phone }}</div>

        <div class="flex gap-2 mb-3 justify-center">
          <input
            v-for="(_, index) in smsCode"
            :key="index"
            :ref="(el) => (codeInputs[index] = el)"
            :value="smsCode[index]"
            type="tel"
            maxlength="1"
            class="w-16 h-16 rounded-2xl bg-[#0c0f15] border border-[#131926] text-center text-2xl font-semibold outline-none"
            @input="handleCodeInput(index, $event)"
            @keydown="handleCodeKeydown(index, $event)"
          />
        </div>
        <div v-if="codeError" class="text-[#ff5f5f] text-sm text-center">
          {{ codeError }}
        </div>

        <!-- <div class="text-[#d8dde8] text-lg">Не получили код?</div> -->
        <div class="text-center mt-6">
          <button
            class="text-sm font-semibold"
            :class="
              canResend ? 'text-white' : 'text-[#9aa2b3] cursor-not-allowed'
            "
            :disabled="!canResend"
            @click="submitPhone"
          >
            Отправить повторно
            <span v-if="retryAfter > 0"> через {{ retryAfter }} с</span>
          </button>
        </div>

        <div class="text-center">
          <button
            class="text-[#4A9EFF] text-base mt-2 underline"
            @click="changePhone"
          >
            Изменить номер телефона
          </button>
        </div>

        <div class="max-w-[380px] mx-auto">
          <button
            type="button"
            class="w-full min-h-12 rounded-2xl text-base font-semibold mt-12 transition"
            :class="
              canSubmitCode
                ? 'bg-white text-black'
                : 'bg-[#8b8f99] text-[#1f2229] cursor-not-allowed'
            "
            :disabled="!canSubmitCode"
            @click="submitCode"
          >
            Подтвердить
          </button>
        </div>
      </div>

      <div class="text-center" v-if="step === 'phone'">
        Нет аккаунта?
        <button class="text-[#4A9EFF] font-semibold">Зарегистрироваться</button>
      </div>
    </div>
  </div>
</template>
