<script setup>
import { computed, onUnmounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "@/plugins/api";
import { useLoginStore } from "@/stores/login";

const emit = defineEmits(["switch-to-enter"]);
const router = useRouter();
const route = useRoute();
const loginStore = useLoginStore();

const registerStep = ref(1);
const phone = ref("+998 ");
const invitationCode = ref("");
const phoneError = ref("");
const invitationError = ref("");
const isSubmittingStepOne = ref(false);
const smsCode = ref(["", "", "", ""]);
const codeInputs = ref([]);
const verifyCodeError = ref("");
const isVerifyingCode = ref(false);
const firstName = ref("");
const lastName = ref("");
const firstNameError = ref("");
const isSavingProfile = ref(false);
const retryAfter = ref(0);
let retryInterval = null;

const phoneDigits = computed(() => {
  let digits = phone.value.replace(/\D/g, "");
  if (digits.startsWith("998")) digits = digits.slice(3);
  return digits.slice(0, 9);
});

const isPhoneComplete = computed(() => phoneDigits.value.length === 9);
const isInvitationCodeFilled = computed(
  () => invitationCode.value.trim().length > 0
);
const canSubmitStepOne = computed(
  () =>
    isPhoneComplete.value &&
    isInvitationCodeFilled.value &&
    !isSubmittingStepOne.value
);
const isCodeComplete = computed(() =>
  smsCode.value.every((digit) => String(digit).length === 1)
);
const canSubmitStepTwo = computed(
  () => isCodeComplete.value && !isVerifyingCode.value
);
const isFirstNameFilled = computed(() => firstName.value.trim().length > 0);
const canSubmitStepThree = computed(
  () => isFirstNameFilled.value && !isSavingProfile.value
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
  return `+998${d}`;
}

function getVerifyPhone() {
  return `998${phoneDigits.value}`;
}

function onPhoneInput(event) {
  phone.value = formatPhoneMask(event.target.value);
  if (phoneError.value) phoneError.value = "";
}

function onInvitationInput(event) {
  invitationCode.value = String(event.target.value || "");
  if (invitationError.value) invitationError.value = "";
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

async function submitRegisterStepOne() {
  phoneError.value = "";
  invitationError.value = "";
  verifyCodeError.value = "";

  if (!isPhoneComplete.value) {
    phoneError.value = "Поле обязательно для заполнения";
  }

  if (!isInvitationCodeFilled.value) {
    invitationError.value = "Поле обязательно для заполнения";
  }

  if (!isPhoneComplete.value || !isInvitationCodeFilled.value) return;

  try {
    isSubmittingStepOne.value = true;
    const registerResponse = await axios.post("v1/register-with-invitation", {
      invitation_code: invitationCode.value.trim(),
      phone_number: getBackendPhone(),
    });

    if (registerResponse?.data?.success === true) {
      registerStep.value = 2;
      startRetryTimer(registerResponse?.data?.otp?.retry_after || 60);
      return;
    }

    invitationError.value =
      registerResponse?.data?.message || "Неверный код приглашения";
  } catch (error) {
    const errorData = error?.response?.data;
    invitationError.value =
      errorData?.errors?.invitation_code?.[0] ||
      errorData?.message ||
      "Неверный код приглашения";
  } finally {
    isSubmittingStepOne.value = false;
  }
}

function handleCodeInput(index, event) {
  const value = String(event.target.value || "")
    .replace(/\D/g, "")
    .slice(0, 1);
  smsCode.value[index] = value;
  if (verifyCodeError.value) verifyCodeError.value = "";

  if (value && index < 3) {
    codeInputs.value[index + 1]?.focus();
  }
}

function handleCodeKeydown(index, event) {
  if (event.key === "Backspace" && !smsCode.value[index] && index > 0) {
    codeInputs.value[index - 1]?.focus();
  }
}

async function submitRegisterStepTwo() {
  verifyCodeError.value = "";
  if (!isCodeComplete.value) {
    verifyCodeError.value = "Поле обязательно для заполнения";
    return;
  }

  try {
    isVerifyingCode.value = true;
    const response = await axios.post("v1/auth/verify-sms", {
      phone: getVerifyPhone(),
      sms_code: smsCode.value.join(""),
    });

    if (response?.data?.data?.status === true && response?.data?.data?.token) {
      const authToken = response.data.data.token;
      const authUser = response.data.data.user || null;

      loginStore.$patch({
        token: authToken,
        user: authUser,
      });

      localStorage.setItem(
        "login",
        JSON.stringify({
          token: authToken,
          user: authUser,
        })
      );

      registerStep.value = 3;
      return;
    }

    verifyCodeError.value = response?.data?.message || "СМС код не верный";
  } catch (error) {
    verifyCodeError.value =
      error?.response?.data?.message || "СМС код не верный";
  } finally {
    isVerifyingCode.value = false;
  }
}

async function submitRegisterStepThree() {
  firstNameError.value = "";
  if (!isFirstNameFilled.value) {
    firstNameError.value = "Поле обязательно для заполнения";
    return;
  }

  try {
    isSavingProfile.value = true;
    const response = await axios.post("v1/my/profile", {
      first_name: firstName.value.trim(),
      last_name: lastName.value.trim(),
    });

    if (response?.status === 200) {
      if (route.meta.locale === "uz") {
        router.push("/uz/offer");
      } else {
        router.push("/offer");
      }
    }
  } catch (error) {
    firstNameError.value =
      error?.response?.data?.message || "Ошибка сохранения профиля";
  } finally {
    isSavingProfile.value = false;
  }
}

onUnmounted(() => {
  if (retryInterval) clearInterval(retryInterval);
});
</script>

<template>
  <div class="h-[90vh] flex flex-col justify-between">
    <div class="w-full" v-if="registerStep === 1">
      <h1 class="text-3xl font-bold mb-1 text-center">Добро пожаловать</h1>
      <p class="text-base text-[#aab3c4] mb-10 text-center">
        Введите данные для регистрации
      </p>

      <div class="max-w-[380px] mx-auto">
        <div class="text-[#8d97aa] text-sm mb-3">Номер телефона</div>
        <input
          type="tel"
          :value="phone"
          @input="onPhoneInput"
          @keydown="onPhoneKeydown"
          maxlength="17"
          class="w-full h-16 rounded-2xl bg-[#0c0f15] border border-[#131926] px-6 font-semibold text-white mb-4 outline-none"
        />
        <div v-if="phoneError" class="text-[#ff5f5f] text-sm mb-3">
          {{ phoneError }}
        </div>

        <div class="text-[#8d97aa] text-sm mb-3">Пригласительный код</div>
        <input
          type="text"
          :value="invitationCode"
          @input="onInvitationInput"
          placeholder="Введите код"
          class="w-full h-16 rounded-2xl bg-[#0c0f15] border border-[#131926] px-6 text-[#9aa2b3] mb-6 outline-none"
        />
        <div v-if="invitationError" class="text-[#ff5f5f] text-sm mb-3">
          {{ invitationError }}
        </div>

        <button
          type="button"
          class="w-full min-h-12 rounded-2xl text-base font-semibold transition"
          :class="
            canSubmitStepOne
              ? 'bg-white text-black'
              : 'bg-[#8b8f99] text-[#1f2229] cursor-not-allowed'
          "
          :disabled="!canSubmitStepOne"
          @click="submitRegisterStepOne"
        >
          Зарегистрироваться
        </button>
      </div>
    </div>

    <div class="w-full" v-else-if="registerStep === 2">
      <button @click="registerStep = 1">
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
          maxlength="1"
          type="tel"
          class="w-16 h-16 rounded-2xl bg-[#0c0f15] border border-[#131926] text-center text-2xl font-semibold outline-none"
          @input="handleCodeInput(index, $event)"
          @keydown="handleCodeKeydown(index, $event)"
        />
      </div>
      <div v-if="verifyCodeError" class="text-[#ff5f5f] text-sm text-center">
        {{ verifyCodeError }}
      </div>

      <div class="text-center mt-6">
        <button class="text-sm font-semibold text-white">
          Отправить повторно
          <span v-if="retryAfter > 0"> через {{ retryAfter }} с</span>
        </button>
      </div>

      <div class="max-w-[380px] mx-auto">
        <button
          type="button"
          class="w-full min-h-12 rounded-2xl text-base font-semibold mt-12 transition"
          :class="
            canSubmitStepTwo
              ? 'bg-white text-black'
              : 'bg-[#8b8f99] text-[#1f2229] cursor-not-allowed'
          "
          :disabled="!canSubmitStepTwo"
          @click="submitRegisterStepTwo"
        >
          Подтвердить
        </button>
      </div>
    </div>

    <div class="w-full" v-else>
      <button @click="registerStep = 2">
        <img src="/icons/p-offer/back.svg" alt="" class="w-5" />
      </button>
      <h1 class="text-3xl font-bold mb-1 text-center">Ваш профиль</h1>
      <p class="text-base text-[#aab3c4] mb-10 text-center">
        Заполните данные для завершения регистрации
      </p>

      <div class="max-w-[380px] mx-auto">
        <div class="text-[#8d97aa] text-sm mb-3">Имя *</div>
        <input
          type="text"
          v-model="firstName"
          placeholder="Введите имя"
          class="w-full h-16 rounded-2xl bg-[#0c0f15] border border-[#131926] px-6 text-[#9aa2b3] mb-4 outline-none"
        />
        <div v-if="firstNameError" class="text-[#ff5f5f] text-sm mb-3">
          {{ firstNameError }}
        </div>

        <div class="text-[#8d97aa] text-sm mb-3">Фамилия</div>
        <input
          type="text"
          v-model="lastName"
          placeholder="Введите фамилию"
          class="w-full h-16 rounded-2xl bg-[#0c0f15] border border-[#131926] px-6 text-[#9aa2b3] mb-6 outline-none"
        />

        <button
          type="button"
          class="w-full min-h-12 rounded-2xl text-base font-semibold transition"
          :class="
            canSubmitStepThree
              ? 'bg-white text-black'
              : 'bg-[#8b8f99] text-[#1f2229] cursor-not-allowed'
          "
          :disabled="!canSubmitStepThree"
          @click="submitRegisterStepThree"
        >
          Сохранить
        </button>
      </div>
    </div>

    <div class="text-center" v-if="registerStep === 1">
      Уже есть аккаунт?
      <button
        class="text-[#4A9EFF] font-semibold"
        @click="emit('switch-to-enter')"
      >
        Войти
      </button>
    </div>
  </div>
</template>
