<script setup>
import { onMounted, onUnmounted, ref } from "vue";
import { useI18n } from "vue-i18n";

const emit = defineEmits(["completed"]);
const { t } = useI18n();

const isTermsModalVisible = ref(false);

const openTermsModal = () => {
  isTermsModalVisible.value = true;
};

const closeTermsModal = () => {
  isTermsModalVisible.value = false;
};

const completeWelcome = () => {
  localStorage.setItem("primeclub_welcome_passed", "1");
  isTermsModalVisible.value = false;
  emit("completed");
};

const lockPageScroll = () => {
  document.body.style.overflow = "hidden";
  document.documentElement.style.overflow = "hidden";
};

const unlockPageScroll = () => {
  document.body.style.overflow = "";
  document.documentElement.style.overflow = "";
};

onMounted(() => {
  lockPageScroll();
});

onUnmounted(() => {
  unlockPageScroll();
});
</script>

<template>
  <div
    class="fixed inset-0 z-[100] text-white bg-[radial-gradient(circle_at_top,_#111827_0%,_#04060b_45%,_#000000_100%)]"
  >
    <div class="min-h-full flex flex-col justify-between px-6 pt-14 pb-10">
      <div class="mt-14">
        <div class="text-2xl font-bold leading-none text-center">
          SQB Premium
        </div>
        <div class="mt-2 tracking-[1.2px] text-sm text-center">
          {{ t("welcome_site.program") }}
        </div>
      </div>

      <div class="text-center">
        <h1 class="text-xl font-bold mb-4">{{ t("welcome_site.title") }}</h1>
        <p class="text-sm text-[#b7bfce] mb-4">
          {{ t("welcome_site.description") }}
        </p>
        <p class="text-sm text-[#d6dbe6] mb-4">
          {{ t("welcome_site.note") }}
          <a href="/offer" class="text-white font-bold underline ml-1">
            {{ t("welcome_site.offer_link") }}
          </a>
        </p>

        <button
          @click="openTermsModal"
          class="w-full min-h-12 rounded-2xl bg-white text-black text-base leading-none font-semibold mb-3"
        >
          {{ t("welcome_site.start") }}
        </button>
        <button class="text-white text-base leading-none font-semibold">
          {{ t("welcome_site.back") }}
        </button>
      </div>
    </div>

    <div
      v-if="isTermsModalVisible"
      @click.self="closeTermsModal"
      class="fixed inset-0 bg-black/45 flex items-end"
    >
      <div class="w-full bg-[#11141a] rounded-t-[24px] px-5 pt-3.5 pb-5">
        <div
          class="w-[52px] h-[5px] rounded-full bg-white/25 mx-auto mb-4"
        ></div>
        <div class="text-lg font-bold mb-2">
          {{ t("welcome_site.terms_title") }}
        </div>
        <p class="text-sm text-[#c3c9d6] mb-5">
          {{ t("welcome_site.terms_text") }}
          <a href="/offer" class="text-white font-bold underline ml-1">
            {{ t("welcome_site.offer_link") }}
          </a>
          .
        </p>
        <button
          @click="completeWelcome"
          class="w-full min-h-12 rounded-2xl bg-white text-black text-base leading-none font-semibold"
        >
          {{ t("welcome_site.continue") }}
        </button>
      </div>
    </div>
  </div>
</template>
