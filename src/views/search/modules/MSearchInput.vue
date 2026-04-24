<script setup>
import { ref, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import { useMerchantsStore } from "@/stores/merchants";
import { localePath } from "@/plugins/i18n";

const emit = defineEmits(["update:modelValue"]);
const { t, locale } = useI18n();
const searchInput = ref(null);
const route = useRoute();
const merchantsStore = useMerchantsStore();

defineProps({
  modelValue: {
    type: String,
    default: "",
  },
});

const updateValue = (event) => {
  emit("update:modelValue", event.target.value);
};

onMounted(() => {
  searchInput.value.focus();
  merchantsStore.getMerchantCategories();
});
</script>

<template>
  <div class="flex items-center gap-4 mb-6">
    <button
      @click="$router.back()"
      class="min-w-9 h-9 bg-gray-200 rounded-xl flex items-center justify-center"
    >
      <img src="/icons/p-offer/back-black.svg" alt="" class="w-[18px]" />
    </button>
    <div class="relative rounded-lg flex items-center w-full">
      <img
        src="/icons/p-offer/search.svg"
        alt=""
        class="absolute left-3 640:left-2"
      />
      <input
        type="text"
        ref="searchInput"
        :value="modelValue"
        @input="updateValue"
        class="shadow-[0_0_0_1px_#d5d8df] pl-11 py-3 pr-3 w-full font-medium rounded-lg focus-visible:outline-none focus:shadow-[0_0_0_1px_#f4af00] text-sm 640:py-2 640:pl-9"
        :placeholder="$t('search')"
      />
    </div>
  </div>
  <div v-if="!modelValue">
    <router-link
      v-for="(category, index) in merchantsStore.merchantCategories"
      :key="index"
      :to="localePath('/offer/' + category?.slug)"
      class="flex items-center gap-4 mb-2 pb-2 border-b border-b-gray-200"
      @click="closeModal"
    >
      <img
        :src="`https://main.primeclub.uz/uploads/${category?.icon}`"
        :alt="category.name"
        class="w-8 rounded-lg"
      />
      <div class="font-medium">
        {{ category?.name }}
      </div>
    </router-link>
  </div>
</template>
