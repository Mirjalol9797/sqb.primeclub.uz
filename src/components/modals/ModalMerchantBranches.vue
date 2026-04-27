<script setup>
import { useSettingsStore } from "@/stores/settings";
import { ref, computed, nextTick } from "vue";

const settingsStore = useSettingsStore();
const props = defineProps({
  branches: {
    type: Array,
    default: () => [],
  },
});
const emit = defineEmits(["closeModal", "confirmSelection"]);

const searchQuery = ref("");
const selectedBranch = ref(null);
const showResults = ref(false);
const resultsRef = ref(null);

const filteredBranches = computed(() => {
  if (!searchQuery.value) return props.branches;
  return props.branches.filter((branch) =>
    branch.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

function closeModal() {
  emit("closeModal");
}

function handleFocus() {
  showResults.value = true;
  nextTick(() => {
    if (resultsRef.value) {
      resultsRef.value.scrollTop = 0;
    }
  });
}

function handleClick() {
  showResults.value = true;
  nextTick(() => {
    if (resultsRef.value) {
      resultsRef.value.scrollTop = 0;
    }
  });
}

function handleBlur() {
  // Небольшая задержка, чтобы можно было кликнуть по результатам
  setTimeout(() => {
    showResults.value = false;
  }, 200);
}

function selectBranch(branch) {
  selectedBranch.value = branch;
  searchQuery.value = branch.name;
  showResults.value = false;
}

function confirmSelection() {
  if (selectedBranch.value) {
    emit("confirmSelection", selectedBranch.value.id);
    closeModal();
    settingsStore.isCreateCertificate = true;
  }
}

function clearSelection(event) {
  event.stopPropagation();
  selectedBranch.value = null;
  searchQuery.value = "";
}
</script>

<template>
  <tm-modal
    :title="$t('choose_branch')"
    width="768"
    :closeBtn="true"
    titleClass="text-center"
    @closeModal="closeModal"
    class="create-certificate-modal"
    classWrap="modal-wrap"
  >
    <template #modal_content>
      <div class="relative">
        <div class="relative">
          <input
            v-model="searchQuery"
            @focus="handleFocus"
            @click="handleClick"
            @blur="handleBlur"
            type="text"
            :placeholder="$t('choose_branch_placeholder')"
            class="w-full text-black px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ffffff1f] pr-10 cursor-pointer"
          />
          <button
            v-if="searchQuery"
            @click="clearSelection"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        </div>
        <div
          v-if="showResults"
          ref="resultsRef"
          class="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-[200px] overflow-y-auto z-10"
        >
          <div
            v-for="branch in filteredBranches"
            :key="branch.id"
            @mousedown.prevent="selectBranch(branch)"
            class="px-4 py-3 text-black hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
          >
            <div class="text-sm font-semibold">{{ branch.name }}</div>
            <div class="text-xs">{{ branch.address }}</div>
          </div>
          <div v-if="filteredBranches.length === 0" class="px-4 py-3 text-sm">
            Ничего не найдено
          </div>
        </div>
      </div>

      <div v-if="selectedBranch" class="mt-6">
        <button @click="confirmSelection" class="site-btn-grey w-full min-h-12">
          {{ $t("confirm") }}
        </button>
      </div>
    </template>
  </tm-modal>
</template>
<style lang="scss">
@media (max-width: 768px) {
  .create-certificate-modal {
    z-index: 20;
    align-items: start;
    .modal-wrap {
      max-width: 100% !important;
      border-radius: 0;
      height: 100%;
    }
  }
}
</style>
