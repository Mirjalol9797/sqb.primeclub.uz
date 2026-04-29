<script setup>
import { computed, onUnmounted } from "vue";
import RequiredBlock from "./RequiredBlock.vue";
import OptionalBlock from "./OptionalBlock.vue";

const emit = defineEmits(["close"]);
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
        class="min-w-10 h-10 rounded-full border border-[#e5e5ea] flex items-center justify-center text-3xl leading-none text-[#2f2f35]"
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
      />
      <OptionalBlock v-else :flow-item="optionalFlowItem" />
    </div>
  </div>
</template>
