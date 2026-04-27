<script setup>
import { ref } from "vue";

const emit = defineEmits(["completed"]);

const isTermsModalVisible = ref(false);

const openTermsModal = () => {
  isTermsModalVisible.value = true;
};

const closeTermsModal = () => {
  isTermsModalVisible.value = false;
};

const completeWelcome = () => {
  localStorage.setItem("primeclub_welcome_passed", "1");
  isTermsModalVisible.value = false;
  emit("completed");
};
</script>

<template>
  <div
    class="fixed inset-0 z-[100] text-white bg-[radial-gradient(circle_at_top,_#111827_0%,_#04060b_45%,_#000000_100%)]"
  >
    <div class="min-h-full flex flex-col justify-between px-7 pt-14 pb-10">
      <div class="mt-14">
        <div class="text-2xl font-bold leading-none text-center">PrimeClub</div>
        <div class="mt-2 tracking-[1.2px] text-sm text-center">
          ПРОГРАММА ПРИВИЛЕГИЙ
        </div>
      </div>

      <div class="text-center">
        <h1 class="text-2xl font-bold mb-4">Добро пожаловать в PrimeClub</h1>
        <p class="text-sm leading-[1.45] text-[#b7bfce] mb-6">
          Эксклюзивные привилегии, скидки и сертификаты для Premium-клиентов SQB
          банка.
        </p>
        <p class="text-sm leading-[1.5] text-[#d6dbe6] mb-5">
          Услуга предоставляется PrimeClub. Нажимая «Начать», вы принимаете
          <a href="/offer" class="text-white font-bold underline ml-1">
            Договор оферты
          </a>
        </p>

        <button
          @click="openTermsModal"
          class="w-full min-h-12 rounded-[14px] bg-white text-black text-lg leading-none font-semibold mb-3"
        >
          Начать
        </button>
        <button class="text-white text-lg leading-none font-semibold">
          Назад
        </button>
      </div>
    </div>

    <div
      v-if="isTermsModalVisible"
      @click.self="closeTermsModal"
      class="fixed inset-0 bg-black/45 flex items-end"
    >
      <div class="w-full bg-[#11141a] rounded-t-[24px] px-5 pt-3.5 pb-5">
        <div
          class="w-[52px] h-[5px] rounded-full bg-white/25 mx-auto mb-4"
        ></div>
        <div class="text-lg font-bold mb-2">Условия использования</div>
        <p class="text-sm text-[#c3c9d6] mb-5">
          Используя данный сервис, вы автоматически соглашаетесь с
          <a href="/offer" class="text-white font-bold underline ml-1">
            условиями публичной оферты
          </a>
          .
        </p>
        <button
          @click="completeWelcome"
          class="w-full min-h-12 rounded-[14px] bg-white text-black text-lg leading-none font-semibold"
        >
          Продолжить
        </button>
      </div>
    </div>
  </div>
</template>
