<script setup>
const props = defineProps({
  filials: {
    type: Object,
    default: {},
  },
});
</script>

<template>
  <div class="bg-white mb-6 480:mb-4 480:text-sm">
    <div
      v-for="(item, index) in filials?.branches"
      :key="index"
      class="flex justify-between p-3 bg-F3F4F6 rounded-xl mb-3 last:mb-0"
    >
      <div>
        <div class="text-1F2A37 font-medium text-sm">
          {{ item.name }}, {{ item.address }}
        </div>
        <div class="text-6B7280 text-xs">{{ $t("filial") }}</div>
      </div>
      <div class="w-8 h-8">
        <img src="/icons/p-offer/filial.png" alt="" />
      </div>
    </div>
  </div>
</template>

<style></style>
