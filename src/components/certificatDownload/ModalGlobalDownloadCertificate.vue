<script setup>
import { computed, onUnmounted, ref } from "vue";
import { useRouter } from "vue-router";
import RequiredBlock from "./RequiredBlock.vue";
import OptionalBlock from "./OptionalBlock.vue";
import AlreadyReceived from "./AlreadyReceived.vue";

const emit = defineEmits(["close"]);
const router = useRouter();
const props = defineProps({
  selectedOfferId: {
    type: [Number, String],
    default: null,
  },
  selectedMerchantBranchId: {
    type: [Number, String],
    default: null,
  },
  merchantBranches: {
    type: Array,
    default: () => [],
  },
  merchantOffer: {
    type: Array,
    default: () => [],
  },
  bookingFlowData: {
    type: Array,
    default: () => [],
  },
});

const requiredItem = computed(() =>
  props.merchantOffer.some((item) => item?.booking_requirement === "required")
);

const requiredFlowItem = computed(
  () =>
    props.bookingFlowData.find(
      (item) => item?.booking_requirement === "required"
    ) || null
);

const optionalFlowItem = computed(
  () =>
    props.bookingFlowData.find(
      (item) => item?.booking_requirement === "optional"
    ) || null
);

const showAlreadyReceivedModal = ref(false);
const alreadyReceivedContent = ref({
  title: "Сертификат уже получен",
  description:
    "Вы уже получали сертификат в этом заведении сегодня. Найти его можно в разделе Сертификаты",
});

const previousBodyOverflow = document.body.style.overflow;
const previousHtmlOverflow = document.documentElement.style.overflow;

document.body.style.overflow = "hidden";
document.documentElement.style.overflow = "hidden";

function closeModal() {
  // Возвращаем скролл сразу при закрытии (до размонтирования компонента)
  document.body.style.overflow = previousBodyOverflow || "";
  document.documentElement.style.overflow = previousHtmlOverflow || "";
  emit("close");
}

function handleAlreadyReceived(flowResult) {
  const apiMessage = flowResult?.response?.message;
  const retryAfter = flowResult?.response?.retry_after;
  const apiDescription =
    flowResult?.response?.data?.message ||
    flowResult?.response?.error ||
    (retryAfter
      ? `Попробуйте снова через ${retryAfter} секунд или откройте раздел Сертификаты.`
      : "");

  alreadyReceivedContent.value = {
    title: apiMessage || "Сертификат уже получен",
    description:
      apiDescription ||
      "Вы уже получали сертификат в этом заведении сегодня. Найти его можно в разделе Сертификаты",
  };
  showAlreadyReceivedModal.value = true;
}

function closeAlreadyReceivedModal() {
  showAlreadyReceivedModal.value = false;
}

async function goToCertificates() {
  showAlreadyReceivedModal.value = false;
  closeModal();
  await router.push("/certificates");
}

onUnmounted(() => {
  document.body.style.overflow = previousBodyOverflow || "";
  document.documentElement.style.overflow = previousHtmlOverflow || "";
});
</script>

<template>
  <div class="fixed inset-0 z-50 flex items-end text-black text-sm">
    <div class="absolute inset-0 bg-black/45" @click="closeModal"></div>

    <div class="relative w-full bg-white rounded-t-3xl px-5 pt-3 pb-6">
      <div
        class="w-[56px] h-[6px] rounded-full bg-[#e4e4e4] mx-auto mb-4"
      ></div>
      <!-- кнопка закрытия модалки -->
      <button
        type="button"
        @click="closeModal"
        class="absolute right-4 top-7 min-w-8 h-8 rounded-full border border-[#e5e5ea] flex items-center justify-center text-2xl leading-none text-[#2f2f35]"
      >
        ×
      </button>
      <!-- контент модалки -->

      <RequiredBlock
        v-if="requiredItem"
        :flow-item="requiredFlowItem"
        :selected-offer-id="selectedOfferId"
        :selected-merchant-branch-id="selectedMerchantBranchId"
        :merchant-branches="merchantBranches"
        @close="closeModal"
        @already-received="handleAlreadyReceived"
      />
      <OptionalBlock v-else :flow-item="optionalFlowItem" />
    </div>

    <AlreadyReceived
      v-if="showAlreadyReceivedModal"
      :title="alreadyReceivedContent.title"
      :description="alreadyReceivedContent.description"
      @close="closeAlreadyReceivedModal"
      @go-certificates="goToCertificates"
    />
  </div>
</template>
