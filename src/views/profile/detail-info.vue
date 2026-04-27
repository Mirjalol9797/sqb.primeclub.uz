<script setup>
import { useRouter } from "vue-router";
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { localePath } from "@/plugins/i18n";
import { useLoginStore } from "@/stores/login";
const loginStore = useLoginStore();
const router = useRouter();
const { t } = useI18n();

// Создаем вычисляемые свойства для полей профиля
const lastName = computed(() => loginStore.user?.last_name || "");
const firstName = computed(() => loginStore.user?.first_name || "");
const middleName = computed(() => loginStore.user?.middle_name || "");
const organization = computed(() => loginStore.user?.organization || "");
const department = computed(() => loginStore.user?.department || "");
const position = computed(() => loginStore.user?.position || "");

function logOut() {
  loginStore.token = null;
  loginStore.user = null;
  localStorage.removeItem("telegramAuthCode");
  router.push(localePath("/offer"));
}
</script>

<template>
  <div class="page-profile py-10 768:pb-[100px] 480:py-6">
    <div class="site-container">
      <div class="site-title">{{ $t("personal_information") }}</div>

      <div class="max-w-[800px] mx-auto rounded-lg p-6 768:p-3">
        <div class="w-[150px] h-[150px] mx-auto mb-12 768:mb-8">
          <img
            :src="
              loginStore.user?.image
                ? `https://main.primeclub.uz/uploads/${loginStore.user?.image}`
                : '/icons/user-name.svg'
            "
            alt=""
            class="w-full h-full object-cover rounded-full"
          />
        </div>
        <div class="grid grid-cols-2 gap-6 768:grid-cols-1 768:gap-4">
          <tm-input
            disabled
            v-model="lastName"
            :label="$t('surname')"
          ></tm-input>
          <tm-input disabled v-model="firstName" :label="$t('name')"></tm-input>
          <tm-input
            disabled
            v-model="middleName"
            :label="$t('middle_name')"
          ></tm-input>
          <tm-input
            disabled
            v-model="organization"
            :label="$t('company')"
          ></tm-input>
          <tm-input
            disabled
            v-model="department"
            :label="$t('department')"
          ></tm-input>
          <tm-input
            disabled
            v-model="position"
            :label="$t('position')"
          ></tm-input>
        </div>
        <button @click="logOut" class="site-btn-grey mt-4 min-h-12 mx-auto">
          <span>{{ $t("exit") }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style></style>
