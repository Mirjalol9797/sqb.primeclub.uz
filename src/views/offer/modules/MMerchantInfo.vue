<script setup>
import { defineProps, ref } from "vue";
import TmButton from "@/components/ui/TmButton.vue";
import { useFavoritesStore } from "@/stores/favorites.js";
import { useSettingsStore } from "@/stores/settings";

const favoritesStore = useFavoritesStore();
const settingsStore = useSettingsStore();
const isDetailsVisible = ref(false);

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
  <div class="mb-4 w-full p-3 rounded-2xl relative border border-[#ffffff1f]">
    <div class="w-16 mb-4 rounded-lg">
      <img
        :src="`https://main.primeclub.uz/uploads/${merchant?.logo}`"
        alt=""
        class="rounded-lg"
      />
    </div>
    <div>
      <div class="font-semibold text-base 768:text-xl">
        {{ merchant?.name }}
      </div>
      <div class="text-gray-500 text-sm">
        {{ merchant?.category?.name }}
      </div>
    </div>
    <div class="mt-3 border border-[#ffffff1f] rounded-2xl p-3">
      <div class="font-medium mb-1">Внимание!</div>
      <div class="text-sm mb-2">
        Чтобы гарантировать скидку в данном заведении, необходимо предупредить
        администрацию перед посещением.
      </div>
      <button
        class="bg-white text-black text-sm px-3 py-1.5 rounded-lg"
        @click="isDetailsVisible = !isDetailsVisible"
      >
        {{ isDetailsVisible ? "Скрыть" : "Подробнее" }}
      </button>
      <div
        v-if="isDetailsVisible"
        class="text-sm border border-[#ffffff1f] p-3 rounded-2xl mt-2"
      >
        Желательно получить сертификат за несколько часов до посещения. Если вы
        планируете посетить заведение рано утром, то важно получить сертификат
        за день до этого.
      </div>
    </div>
    <!-- <button class="site-btn-grey w-full" @click="onScrollToCertificate">
      {{ $t("get_certificate") }}
    </button> -->

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
