<script setup>
import { onUnmounted } from "vue";

const emit = defineEmits(["close"]);
const previousOverflow = document.body.style.overflow;
document.body.style.overflow = "hidden";

function closeModal() {
  emit("close");
}

onUnmounted(() => {
  document.body.style.overflow = previousOverflow;
});
</script>

<template>
  <div class="fixed inset-0 z-50 flex items-end">
    <div class="absolute inset-0 bg-black/45" @click="closeModal"></div>

    <div class="relative w-full bg-white rounded-t-3xl px-5 pt-3 pb-6">
      <div
        class="w-[56px] h-[6px] rounded-full bg-[#e4e4e4] mx-auto mb-4"
      ></div>

      <div class="flex items-start justify-between gap-3">
        <div>
          <div class="text-2xl leading-tight font-semibold text-[#2a2a2a]">
            Предупредить заведение
          </div>
          <div class="text-[#7b7b84] text-base leading-snug mt-1">
            Это не бронирование — мы просто предупредим персонал, чтобы скидку
            применили без задержек
          </div>
          <button
            type="button"
            class="underline text-[#63636f] text-base leading-none mt-2"
          >
            Зачем предупреждать
          </button>
        </div>

        <button
          type="button"
          @click="closeModal"
          class="min-w-10 h-10 rounded-full border border-[#e5e5ea] flex items-center justify-center text-3xl leading-none text-[#2f2f35]"
        >
          ×
        </button>
      </div>

      <button
        type="button"
        class="w-full mt-6 rounded-3xl bg-[#11b097] text-white py-2 leading-none font-medium"
      >
        Предупредить заведение
      </button>

      <button
        type="button"
        class="w-full mt-4 underline text-[#63636f] leading-none"
      >
        Я уже здесь
      </button>
    </div>
  </div>
</template>
