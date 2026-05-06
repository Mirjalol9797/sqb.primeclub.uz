<script setup>
const emit = defineEmits(["switch-to-enter"]);
</script>

<template>
  <div class="h-[90vh] flex flex-col justify-between">
    <div class="w-full">
      <h1 class="text-3xl font-bold mb-1 text-center">Добро пожаловать</h1>
      <p class="text-base text-[#aab3c4] mb-10 text-center">
        Введите данные для регистрации
      </p>

      <div class="max-w-[380px] mx-auto">
        <div class="text-[#8d97aa] text-sm mb-3">Номер телефона</div>
        <input
          type="tel"
          value="+998 "
          class="w-full h-16 rounded-2xl bg-[#0c0f15] border border-[#131926] px-6 font-semibold text-white mb-4 outline-none"
        />

        <div class="text-[#8d97aa] text-sm mb-3">Пригласительный код</div>
        <input
          type="text"
          placeholder="Введите код"
          class="w-full h-16 rounded-2xl bg-[#0c0f15] border border-[#131926] px-6 text-[#9aa2b3] mb-6 outline-none"
        />

        <button
          type="button"
          class="w-full min-h-12 rounded-2xl text-base font-semibold bg-white text-black"
        >
          Зарегистрироваться
        </button>
      </div>
    </div>

    <div class="text-center">
      Уже есть аккаунт?
      <button
        class="text-[#4A9EFF] font-semibold"
        @click="emit('switch-to-enter')"
      >
        Войти
      </button>
    </div>
  </div>
</template>
