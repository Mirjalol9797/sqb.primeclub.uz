<script setup>
import { computed, ref, watch } from "vue";

const props = defineProps({
  flowItem: {
    type: Object,
    default: null,
  },
});

const currentKey = ref("warn_establishment");
const showWhyText = ref(false);
const selectedComePlanOption = ref("");
const selectedWeekDay = ref("");
const selectedHour = ref("");
const selectedMinute = ref("");

const weekDays = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
const hourOptions = Array.from({ length: 24 }, (_, index) =>
  String(index).padStart(2, "0")
);
const minuteOptions = Array.from({ length: 60 }, (_, index) =>
  String(index).padStart(2, "0")
);

const flowData = computed(() => props.flowItem?.data || {});
const warnData = computed(() => flowData.value?.warn_establishment || null);
const alreadyHereData = computed(() => flowData.value?.already_here || null);
const comePlanData = computed(() => flowData.value?.come_plan || null);

function goToKey(key, fallback = "warn_establishment") {
  currentKey.value = key || fallback;
}

function goToAlreadyHere() {
  goToKey(warnData.value?.footer_link?.linked_key, "already_here");
}

function goToComePlan() {
  goToKey(warnData.value?.primary_button?.linked_key, "come_plan");
}

function backFromAlreadyHere() {
  goToKey(
    alreadyHereData.value?.secondary_button?.linked_key,
    "warn_establishment"
  );
}

function backFromComePlan() {
  goToKey(
    comePlanData.value?.secondary_button?.linked_key,
    "warn_establishment"
  );
}

watch(selectedComePlanOption, (value) => {
  if (value !== "week") {
    selectedWeekDay.value = "";
    selectedHour.value = "";
    selectedMinute.value = "";
  }
});

const canSubmitComePlan = computed(() => {
  if (!selectedComePlanOption.value) return false;
  if (selectedComePlanOption.value === "week") {
    return (
      !!selectedWeekDay.value && !!selectedHour.value && !!selectedMinute.value
    );
  }
  return true;
});

const showUnknownHint = computed(
  () => selectedComePlanOption.value === "unknown"
);
const showWeekInputs = computed(() => selectedComePlanOption.value === "week");
</script>

<template>
  <div class="text-[#202127]">
    <div v-if="currentKey === 'warn_establishment' && warnData">
      <div class="text-base font-semibold mb-1">{{ warnData.title }}</div>
      <div class="text-sm text-[#5e6068]">
        {{ warnData.description }}
      </div>
      <button
        class="text-sm underline text-[#5e6068] mt-2"
        @click="showWhyText = !showWhyText"
      >
        Зачем предупреждать
      </button>
      <div
        v-if="showWhyText"
        class="text-sm border border-[#d2d3d8] rounded-2xl p-3 mt-3"
      >
        {{ warnData.extra_text }}
      </div>
      <button
        class="w-full mt-4 py-3 rounded-2xl bg-[#11b097] text-white text-sm font-medium"
        @click="goToComePlan"
      >
        {{ warnData.primary_button?.text }}
      </button>
      <button
        class="w-full mt-3 text-sm underline text-[#5e6068]"
        @click="goToAlreadyHere"
      >
        {{ warnData.footer_link?.text }}
      </button>
    </div>

    <div v-else-if="currentKey === 'already_here' && alreadyHereData">
      <div class="text-base font-semibold mb-1">
        {{ alreadyHereData.title }}
      </div>
      <div class="text-sm text-[#5e6068] mb-3">
        {{ alreadyHereData.description }}
      </div>
      <div class="text-sm border border-[#d2d3d8] rounded-2xl p-3">
        {{ alreadyHereData.extra_text }}
      </div>
      <button
        class="w-full mt-4 py-3 rounded-2xl bg-[#11b097] text-white text-sm font-medium"
      >
        {{ alreadyHereData.primary_button?.text }}
      </button>
      <button
        class="w-full mt-3 text-sm underline text-[#5e6068]"
        @click="backFromAlreadyHere"
      >
        {{ alreadyHereData.secondary_button?.text }}
      </button>
    </div>

    <div v-else-if="currentKey === 'come_plan' && comePlanData">
      <div class="text-base font-semibold mb-1">{{ comePlanData.title }}</div>
      <div class="text-sm text-[#5e6068] mb-2">
        {{ comePlanData.description }}
      </div>
      <div class="text-base font-semibold mb-2">{{ comePlanData.bold }}</div>

      <div class="flex flex-wrap gap-2 mb-3">
        <button
          v-for="option in comePlanData.options || []"
          :key="option.value"
          @click="selectedComePlanOption = option.value"
          class="px-4 py-2 rounded-full border text-sm"
          :class="
            selectedComePlanOption === option.value
              ? 'bg-[#11b097] text-white border-[#11b097]'
              : 'bg-[#f3f4f6] text-[#202127] border-[#e2e4e8]'
          "
        >
          {{ option.text }}
        </button>
      </div>

      <div class="text-sm text-[#5e6068] mb-3">{{ comePlanData.hint }}</div>

      <div
        v-if="showUnknownHint"
        class="text-sm border border-[#d2d3d8] rounded-2xl p-3 mb-3"
      >
        {{ comePlanData.post_select?.unknown_hint }}
      </div>

      <div v-if="showWeekInputs" class="mb-3">
        <div class="text-sm text-[#5e6068] mb-2">
          {{
            comePlanData.post_select?.week_label ||
            "Выберите день и примерное время:"
          }}
        </div>
        <div class="flex flex-wrap gap-2 mb-3">
          <button
            v-for="day in weekDays"
            :key="day"
            class="px-3 py-1.5 rounded-full border text-sm"
            :class="
              selectedWeekDay === day
                ? 'bg-[#11b097] text-white border-[#11b097]'
                : 'bg-[#f3f4f6] text-[#202127] border-[#e2e4e8]'
            "
            @click="selectedWeekDay = day"
          >
            {{ day }}
          </button>
        </div>

        <div class="text-sm text-[#5e6068] mb-2">
          {{ comePlanData.post_select?.time_label || "Время:" }}
        </div>
        <div class="flex items-center gap-2 mb-2">
          <select
            v-model="selectedHour"
            class="flex-1 border border-[#d2d3d8] rounded-xl px-3 py-1 text-sm bg-white"
          >
            <option value="">Часы</option>
            <option v-for="hour in hourOptions" :key="hour" :value="hour">
              {{ hour }}
            </option>
          </select>
          <span class="text-sm text-[#5e6068]">:</span>
          <select
            v-model="selectedMinute"
            class="flex-1 border border-[#d2d3d8] rounded-xl px-3 py-1 text-sm bg-white"
          >
            <option value="">Мин</option>
            <option
              v-for="minute in minuteOptions"
              :key="minute"
              :value="minute"
            >
              {{ minute }}
            </option>
          </select>
        </div>
        <div class="text-sm text-[#5e6068]">
          {{
            comePlanData.post_select?.week_cta_hint ||
            "Кнопка станет активной после выбора дня."
          }}
        </div>
      </div>

      <button
        class="w-full py-3 rounded-2xl border border-[#d2d3d8] text-sm font-medium mb-2"
        @click="backFromComePlan"
      >
        {{ comePlanData.secondary_button?.text }}
      </button>
      <button
        class="w-full py-3 rounded-2xl text-sm font-medium"
        :class="
          canSubmitComePlan
            ? 'bg-[#11b097] text-white'
            : 'bg-[#e6e7eb] text-[#9b9ea8]'
        "
        :disabled="!canSubmitComePlan"
      >
        {{ comePlanData.primary_button?.text }}
      </button>
    </div>
  </div>
</template>
