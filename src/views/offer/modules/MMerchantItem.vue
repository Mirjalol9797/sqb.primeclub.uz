<script setup>
import { ref, watch } from "vue";
import { useMerchantsStore } from "@/stores/merchants";

defineProps({
  merchants: {
    type: Array,
    required: true,
  },
  getMerchantUrl: {
    type: Function,
    required: true,
  },
});

const merchantsStore = useMerchantsStore();
const currentPage = ref(merchantsStore.pagination.current_page);

const changePagePagination = (page) => {
  currentPage.value = page;
  merchantsStore.getMerchants(null, null, page).then(() => {
    // плавный скролл к началу страницы
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
};

// следим за сменой категории → сбрасываем currentPage
watch(
  () => merchantsStore.filters.category_id,
  () => {
    currentPage.value = 1;
  }
);

watch(
  () => merchantsStore.filters.district_ids,
  () => {
    currentPage.value = 1;
  }
);
</script>

<template>
  <div v-if="merchants?.length > 0" class="w-full">
    <div class="grid grid-cols-1 gap-4">
      <router-link
        v-for="(item, index) in merchants"
        :key="index"
        :to="getMerchantUrl(item)"
        class="transition-all duration-300 rounded-2xl relative border border-[#ffffff1f] hover:border-[#f5f7fb]"
      >
        <div class="w-full h-[160px]">
          <img
            :src="`https://main.primeclub.uz/uploads/${item.image}`"
            :alt="item.name"
            class="w-full h-full object-cover rounded-t-lg"
          />
        </div>
        <div class="p-4 bg-[#141416]">
          <div class="text-sm font-semibold mb-1 flex items-center gap-1.5">
            <!-- <img
            :src="`https://main.primeclub.uz/uploads/${item.logo}`"
            :alt="item.name"
            class="w-8 h-8 object-contain rounded-lg"
          /> -->
            {{ item.name }}
          </div>
          <div class="text-sm text-gray-500">
            {{ item.excerpt }}
          </div>
        </div>
      </router-link>
    </div>

    <!-- pagination -->
    <!-- <div
      class="mt-10 flex justify-end"
      v-if="
        merchantsStore.pagination.total > merchantsStore.pagination.per_page
      "
    >
      <vue-awesome-paginate
        :total-items="merchantsStore.pagination.total"
        :items-per-page="merchantsStore.pagination.per_page"
        :max-pages-shown="5"
        v-model="currentPage"
        @click="changePagePagination"
      />
    </div> -->
  </div>
  <div v-else class="w-full pt-10">
    <div class="text-center text-gray-500">Ничего не найдено</div>
  </div>
</template>
