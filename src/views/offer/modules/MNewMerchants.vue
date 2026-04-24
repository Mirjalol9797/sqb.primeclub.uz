<script setup>
defineProps({
  merchants: {
    type: Array,
    default: () => [],
  },
  getMerchantUrl: {
    type: Function,
    required: true,
  },
});
</script>

<template>
  <div v-if="merchants?.length" class="w-full px-4 mb-6">
    <div class="text-lg font-semibold mb-4">Новые заведения</div>

    <div class="flex gap-4 overflow-x-auto pb-2">
      <router-link
        v-for="(item, index) in merchants"
        :key="index"
        :to="getMerchantUrl(item)"
        class="bg-[#141416] min-w-[280px] max-w-[280px] transition-all duration-300 rounded-2xl relative border border-[#ffffff1f] hover:border-[#f5f7fb]"
      >
        <div class="w-full h-[160px]">
          <img
            :src="`https://main.primeclub.uz/uploads/${item.image}`"
            :alt="item.name"
            class="w-full h-full object-cover rounded-t-2xl"
          />
        </div>
        <div
          class="p-4 bg-[#141416] flex justify-between items-center rounded-b-2xl"
        >
          <div>
            <div
              class="text-sm font-semibold mb-1 flex items-center gap-1.5 line-clamp-2"
            >
              {{ item.name }}
            </div>
            <div class="text-sm text-[#8d94a6] line-clamp-2">
              {{ item.excerpt }}
            </div>
          </div>
          <div>
            <img src="/icons/p-offer/left-white.svg" alt="" class="w-5 h-5" />
          </div>
        </div>
      </router-link>
    </div>
  </div>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  line-clamp: 2;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
