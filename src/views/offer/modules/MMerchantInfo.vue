<script setup>
import { defineProps } from "vue";
import TmButton from "@/components/ui/TmButton.vue";
import { useFavoritesStore } from "@/stores/favorites.js";
import { useSettingsStore } from "@/stores/settings";

const favoritesStore = useFavoritesStore();
const settingsStore = useSettingsStore();

const props = defineProps({
  merchant: {
    type: Object,
    default: () => ({}),
  },
  onScrollToCertificate: {
    type: Function,
  },
});

const handleToggleFavorite = () => {
  if (props.merchant?.is_favorite) {
    favoritesStore.deleteFavorite(props.merchant.id);
  } else {
    favoritesStore.addFavorite(props.merchant.id);
  }
  // Обновляем состояние локально для мгновенной обратной связи
  props.merchant.is_favorite = !props.merchant.is_favorite;
};
</script>

<template>
  <div
    class="mb-4 bg-white w-full p-4 rounded-2xl relative border-2 border-ffdf8f 768:p-3 768:mb-5"
  >
    <div class="w-16 mb-4 rounded-lg">
      <img
        :src="`https://main.primeclub.uz/uploads/${merchant?.logo}`"
        alt=""
        class="rounded-lg"
      />
    </div>
    <div class="768:mb-2">
      <div class="font-semibold text-base 768:text-xl">
        {{ merchant?.name }}
      </div>
      <div class="text-gray-500 text-sm">
        {{ merchant?.category?.name }}
      </div>
    </div>
    <tm-button
      class="!max-w-full !h-11 !rounded-lg !hidden 768:!block"
      @click="settingsStore.isDownloadAppModal = true"
      :title="$t('get_certificate')"
    >
    </tm-button>

    <!-- <button
      class="absolute top-4 right-4"
      @click="handleToggleFavorite"
      v-if="merchant?.is_favorite"
    >
      <img src="/icons/p-offer/favorite-like.svg" alt="" class="w-5" />
    </button>
    <button class="absolute top-4 right-4" @click="handleToggleFavorite" v-else>
      <img src="/icons/p-offer/favorite.svg" alt="" class="w-5" />
    </button> -->
  </div>
</template>
