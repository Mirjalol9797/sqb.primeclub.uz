<script setup>
import {
  defineProps,
  defineExpose,
  ref,
  onMounted,
  onUnmounted,
  watch,
} from "vue";
import { useRoute } from "vue-router";
import { useLoginStore } from "@/stores/login";
import { useSettingsStore } from "@/stores/settings";
import TmButton from "@/components/ui/TmButton.vue";
import ModalAboniment from "@/components/modals/ModalAboniment.vue";

const loginStore = useLoginStore();
const settingsStore = useSettingsStore();
const route = useRoute();
const bottomButton = ref(null);
const showCodes = ref({});
const certificateContainer = ref(null);

const scrollToButton = () => {
  if (certificateContainer.value) {
    certificateContainer.value.scrollIntoView({
      behavior: "smooth",
      top: 90,
    });
  }
};

defineExpose({
  scrollToButton,
});

const props = defineProps({
  merchantOffer: {
    type: Object,
    required: true,
  },
  merchant: {
    type: Object,
    required: true,
  },
  offerCode: {
    type: String,
    default: "",
  },
  showOfferCodeBtn: {
    type: Boolean,
    required: true,
  },
  codeError: {
    type: Object,
    default: () => {},
  },
});

const emit = defineEmits([
  "getOfferCode",
  "copyOfferCode",
  "createCertificate",
  "openMerchantBranches",
]);

function showCode(item) {
  emit("getOfferCode", item);
  showCodes.value[item.id] = true;
}

// Копировать код для конкретного предложения
function copyCode(item) {
  emit("copyOfferCode", item._code);
}

function openDownloadAppModal() {
  settingsStore.isDownloadAppModal = true;
}
watch(
  () => route.path,
  () => {
    // Закрываем модалку при изменении маршрута
    settingsStore.isAboniment = false;
  }
);

onUnmounted(() => {
  settingsStore.isAboniment = false;
});
</script>

<template>
  <div class="text-sm font-medium mb-3 768:mb-2" ref="certificateContainer">
    {{ $t("all_discounts") }}
  </div>
  <div
    class="gap-5 mb-6 768:flex 768:mb-0 768:overflow-x-auto 768:items-start 768:gap-2"
  >
    <div
      v-if="
        (loginStore.user?.id == 13 ||
          loginStore.user?.id == 15 ||
          loginStore.user?.id == 16) &&
        (route.params.slug == 'fitnes-klub-legenda' ||
          route.params.slug == 'fitnes-klub-befit-eco')
      "
      class="discount-card shadow-[0_0_2px_0_rgba(0,0,0,.06),0_2px_8px_0_rgba(242,242,242,1)] bg-white p-4 max-w-[400px] rounded-2xl 768:max-w-full 480:p-3"
    >
      <div class="text-sm mb-1 font-semibold">
        {{ $t("evening_subscription_title") }}
      </div>
      <div class="font-medium text-lg mb-2">3 600 000 {{ $t("sum") }}</div>
      <button class="site-btn" @click="settingsStore.isAboniment = true">
        {{ $t("buy") }}
      </button>
    </div>
    <div
      v-else
      class="discount-card shadow-[0_0_2px_0_rgba(0,0,0,.06),0_2px_8px_0_rgba(242,242,242,1)] bg-white p-4 max-w-[400px] rounded-2xl mb-4 last:mb-0 768:max-w-full 768:mb-0 480:p-3"
      v-for="(item, index) in merchantOffer"
      :key="index"
    >
      <div class="text-sm mb-1 font-semibold">
        {{ item?.name }}
      </div>
      <div
        class="text-6B7280 text-sm 768:min-h-10"
        v-html="item?.description"
      ></div>
      <div class="mt-5 hidden 768:block" >
        <template v-if="item?.skip_certificate == true">
          <button
            class="site-btn-grey gap-2"
            @click="openDownloadAppModal()"
            v-if="
              !showCodes[item.id] ||
              (codeError && Object.keys(codeError).length > 0)
            "
          >
            <img src="/icons/p-offer/show1.svg" alt="" class="w-5" />
            {{ $t("show_code") }}
          </button>
          <button
            class="site-btn-grey"
            v-else
            @click="openDownloadAppModal()"
          >
            <img src="/icons/p-offer/copy.svg" alt="" class="w-4" />
            {{ item._code }}
          </button>
        </template>
        <template v-else>
          <button
            class="site-btn-grey"
            @click="openDownloadAppModal()"
            v-if="merchant?.type == 'single'"
          >
            {{ $t("get_certificate") }}
          </button>
          <button
            class="site-btn-grey"
            @click="openDownloadAppModal()"
            v-else
          >
            {{ $t("get_certificate") }}
          </button>
        </template>
      </div>
    </div>
  </div>

  <ModalAboniment v-if="settingsStore.isAboniment" />
</template>

<style lang="scss" scoped>
.discount-card {
  background: linear-gradient(
    50deg,
    #ffffff 0%,
    #ffffff 50%,
    #ffffff 65%,
    rgba(46, 250, 199, 0.6) 120%
  );
  border: 1px solid rgba(243, 244, 246, 1);
  background-color: rgba(249, 250, 251, 1);

  @media (max-width: 768px) {
    min-width: 320px;
  }
}
</style>
