<!-- src/components/modules/MCategory.vue -->
<script setup>
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import { useMerchantsStore } from "@/stores/merchants";
import { localePath } from "@/plugins/i18n";
import { buildCategoryIconDataUrl } from "@/utils/categoryIcons";

const route = useRoute();
const { t } = useI18n();
const merchantsStore = useMerchantsStore();

const props = defineProps({
  categoriesType: {
    type: String,
    default: "offer",
  },
});

const emit = defineEmits(["closeModal"]);
async function closeModal(id) {
  if (props.categoriesType === "filter-modal") {
    emit("closeModal");
  }
  merchantsStore.getSummaryMerchants(id || null);
}
</script>

<template>
  <div
    class="categories w-full bg-[#141416] p-4"
    :class="
      categoriesType == 'filter-modal'
        ? 'categories-filter-modal'
        : categoriesType == 'fixed-header'
        ? 'categories-fixed-header'
        : ''
    "
  >
    <div class="">
      <div class="grid grid-cols-4 gap-2">
        <!-- Категории -->
        <router-link
          v-for="(category, index) in merchantsStore.merchantCategories"
          :key="index"
          :to="localePath('/offer/' + category?.slug)"
          :class="[
            'categories__item flex items-center gap-2  text-xs 768:flex-col  768:text-center 768:min-w-[80px] text-[#8d94a6]',
          ]"
          @click="closeModal(category?.id)"
        >
          <div
            :class="route.params.slug === category?.slug ? 'bg-white' : ''"
            class="rounded-lg categories__item-icon transition-colors flex items-center justify-center"
          >
            <img
              :src="
                buildCategoryIconDataUrl(
                  category?.name,
                  route.params.slug === category?.slug
                )
              "
              :alt="category.name"
              class="w-10 h-10"
            />
          </div>
          <div
            :class="route.params.slug === category?.slug ? 'font-medium' : ''"
            class="categories__item-name"
          >
            {{ category?.name }}
          </div>
        </router-link>

        <!-- "Все" -->
        <router-link
          :to="localePath('/offer')"
          :class="[
            'categories__item flex items-center gap-2  text-xs 768:flex-col 768:text-center text-[#8d94a6]',
          ]"
          @click="closeModal('')"
        >
          <div
            :class="!route.params.slug ? 'bg-white' : ''"
            class="rounded-lg categories__item-icon transition-colors flex items-center justify-center"
          >
            <img
              :src="buildCategoryIconDataUrl('all', !route.params.slug)"
              alt="все"
              class="w-10 h-10"
            />
          </div>
          <div
            :class="!route.params.slug ? 'font-medium' : ''"
            class="categories__item-name"
          >
            {{ $t("all") }}
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.categories-filter-modal {
  .categories__wrap {
    flex-wrap: wrap;
    display: grid;
    grid-template-columns: repeat(6, minmax(0, 1fr));

    @media (max-width: 640px) {
      grid-template-columns: repeat(5, minmax(0, 1fr));
    }
    @media (max-width: 480px) {
      grid-template-columns: repeat(4, minmax(0, 1fr));
    }
    @media (max-width: 390px) {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
  }
}

.categories-fixed-header {
  .categories__title {
    display: none;
  }
  .categories__item-icon {
    display: none;
  }
  .categories__item {
    white-space: nowrap;
    min-width: auto;
    color: #333;
    background-color: #f7f7f7;
    border-radius: 8px;
  }
}
</style>
