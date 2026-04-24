<script setup>
import { defineProps } from "vue";

const props = defineProps({
  merchant: {
    type: Object,
    default: () => ({}),
  },
  merchantOffer: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits(["openDetailImages"]);
</script>

<template>
  <div
    v-if="merchant?.images?.length > 0"
    class="mx-[-10px] relative hidden 768:block mb-4"
  >
    <div class="h-[266px] mobile-image" @click="$emit('openDetailImages')">
      <img
        :src="`https://main.primeclub.uz/uploads/${merchant?.images[0]}`"
        alt=""
        class="h-full w-full object-cover"
      />
    </div>
    <button
      class="absolute top-0 left-0 w-10 h-10 flex items-center justify-center"
      @click="$router.back()"
    >
      <img src="/icons/p-offer/back.svg" alt="" class="w-5" />
    </button>
    <div
      class="absolute w-full bottom-5 left-0 flex items-center justify-between px-4 text-sm 480:text-xs"
      ref="searchRef"
    >
      <div class="flex items-center gap-2">
        <div
          class="bg-ffd531 px-2 py-1 rounded-full text-white"
          v-for="(item, index) in merchantOffer"
          :key="index"
        >
          {{ item?.name }}
        </div>
      </div>
      <div class="text-white">1/4</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.mobile-image {
  &:after {
    content: "";
    position: absolute;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.5);
  }
}
</style>
