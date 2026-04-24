<!-- src/components/modules/MCategory.vue -->
<script setup>
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import { useMerchantsStore } from "@/stores/merchants";
import { localePath } from "@/plugins/i18n";

const route = useRoute();
const { t } = useI18n();
const merchantsStore = useMerchantsStore();
const generatedIcons = new Map();

const CATEGORY_ICON_RULES = [
  { test: /(ресторан|кафе|еда|food|restaurant|cafe)/i, icon: "cutlery" },
  { test: /(магаз|shop|goods|товар)/i, icon: "bag" },
  { test: /(красот|spa|beauty)/i, icon: "sparkles" },
  { test: /(здоров|медиц|врач|health|medical)/i, icon: "heart" },
  { test: /(развлеч|игр|entertain|game)/i, icon: "gamepad" },
  { test: /(азс|заправ|fuel|gas)/i, icon: "fuel" },
  { test: /(отел|hotel)/i, icon: "hotel" },
  { test: /(сервис|услуг|service)/i, icon: "service" },
  { test: /(дет|kids|children|child)/i, icon: "kids" },
  { test: /(образован|учеб|education)/i, icon: "education" },
  { test: /(спорт|фитнес|sport|fitness)/i, icon: "sport" },
  { test: /(отдых|путешеств|travel|trip|tour)/i, icon: "travel" },
];

function resolveCategoryIconType(name = "") {
  const normalized = String(name).trim().toLowerCase();
  const matchedRule = CATEGORY_ICON_RULES.find((rule) =>
    rule.test.test(normalized)
  );
  return matchedRule?.icon || "grid";
}

function getIconMarkup(iconType) {
  const icons = {
    // Fork (3 prongs + stem) + Knife (curved blade)
    cutlery:
      '<path d="M11 8v6M13 8v6M15 8v6M11 14q0 3.5 2 3.5V28M22 8c5 1 5 9 0 9v11"/>',
    // Shopping bag with handle loop
    bag: '<path d="M10 16h16l-2 12H12L10 16z"/><path d="M14 16v-2a4 4 0 0 1 8 0v2"/>',
    // Scissors (two ring handles + crossing blades)
    sparkles:
      '<circle cx="12" cy="14" r="3.5"/><circle cx="12" cy="24" r="3.5"/><line x1="15" y1="12.2" x2="29" y2="8"/><line x1="15" y1="25.8" x2="29" y2="30"/><line x1="22" y1="18" x2="29" y2="8"/><line x1="22" y1="18" x2="29" y2="30"/>',
    // Heart (health)
    heart:
      '<path d="M18 28C18 28 8 21.5 8 14.5A6.5 6.5 0 0 1 18 10.8a6.5 6.5 0 0 1 10 3.7C28 21.5 18 28 18 28z"/>',
    // Game controller with D-pad + 2 buttons
    gamepad:
      '<rect x="9" y="15" width="18" height="12" rx="4"/><line x1="13" y1="21" x2="17" y2="21"/><line x1="15" y1="19" x2="15" y2="23"/><circle cx="22" cy="20" r="1"/><circle cx="24" cy="22" r="1"/>',
    // Gas pump with nozzle hose
    fuel:
      '<path d="M11 28V12a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16M7 28h24"/><path d="M23 14h2a2 2 0 0 1 2 2v4a2 2 0 0 0 2 2"/><line x1="11" y1="18" x2="23" y2="18"/>',
    // Building with windows + rooftop triangle
    hotel:
      '<rect x="10" y="14" width="16" height="14" rx="1"/><path d="M14 28v-5h8v5"/><rect x="13" y="17" width="3" height="3"/><rect x="20" y="17" width="3" height="3"/><rect x="13" y="22" width="3" height="3"/><rect x="20" y="22" width="3" height="3"/><path d="M18 9v5M13 12l5-3 5 3"/>',
    // Wrench
    service:
      '<path d="M23 9c-3.5 0-6.5 3-6.5 6.5 0 1.1.3 2.1.8 3L8.5 27.3a2 2 0 0 0 2.8 2.8l8.8-8.8c.9.5 1.9.8 3 .8 3.5 0 6.5-3 6.5-6.5 0-1.3-.4-2.5-1-3.5l-3.5 3.5-2.5-2.5 3.5-3.5A6.4 6.4 0 0 0 23 9z"/>',
    // Child figure: circle head + body + legs
    kids: '<circle cx="18" cy="11" r="3.5"/><path d="M12 20c0-3.3 2.7-6 6-6s6 2.7 6 6v4H12v-4z"/><line x1="15" y1="24" x2="14" y2="29"/><line x1="21" y1="24" x2="22" y2="29"/>',
    // Graduation cap
    education:
      '<path d="M8 16.5l10-4.5 10 4.5-10 4.5z"/><path d="M13 21v4c0 2.2 2.2 4 5 4s5-1.8 5-4v-4"/><line x1="28" y1="16.5" x2="28" y2="23"/><path d="M26.5 23l1.5 2.5 1.5-2.5z"/>',
    // Dumbbell
    sport:
      '<line x1="13" y1="18" x2="23" y2="18"/><rect x="8" y="15" width="5" height="6" rx="1"/><rect x="23" y="15" width="5" height="6" rx="1"/><line x1="5" y1="18" x2="9" y2="18"/><line x1="27" y1="18" x2="31" y2="18"/>',
    // Suitcase with divider line + vertical handles
    travel:
      '<rect x="10" y="15" width="16" height="13" rx="2"/><path d="M14 15v-2a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="21" x2="26" y2="21"/><line x1="14" y1="21" x2="14" y2="28"/><line x1="22" y1="21" x2="22" y2="28"/>',
    // 2×2 grid (all categories)
    grid: '<rect x="10" y="10" width="7" height="7" rx="1"/><rect x="19" y="10" width="7" height="7" rx="1"/><rect x="10" y="19" width="7" height="7" rx="1"/><rect x="19" y="19" width="7" height="7" rx="1"/>',
  };
  return icons[iconType] || icons.grid;
}

function buildCategoryIconDataUrl(name = "", isActive = false) {
  const cacheKey = `${String(name).trim().toLowerCase()}|${isActive ? 1 : 0}`;
  if (generatedIcons.has(cacheKey)) {
    return generatedIcons.get(cacheKey);
  }

  const iconType = resolveCategoryIconType(name);
  const strokeColor = isActive ? "#0F172A" : "#FFFFFF";
  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 36 36">
  <g fill="none" stroke="${strokeColor}" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.9">
    ${getIconMarkup(iconType)}
  </g>
</svg>`;

  const url = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  generatedIcons.set(cacheKey, url);
  return url;
}

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
  // districtsStore.setSelectedDistricts([]);
  merchantsStore.getSummaryMerchants(id);
  merchantsStore.filters.category_id = null;
  merchantsStore.filters.district_ids = null;
  // await merchantsStore.getMerchants(id, null, 1);
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
