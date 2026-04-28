<template>
  <div class="fixed inset-0 z-50 flex items-end">
    <div class="absolute inset-0 bg-black/45"></div>

    <div class="relative w-full bg-white rounded-t-3xl px-5 pt-3 pb-6">
      <div class="w-[56px] h-[6px] rounded-full bg-[#e4e4e4] mx-auto mb-4"></div>

      <div class="flex items-start justify-between gap-3">
        <div>
          <div class="text-[36px] leading-[1.08] font-semibold text-[#2a2a2a]">
            Предупредить заведение
          </div>
          <div class="text-[#7b7b84] text-[24px] leading-[1.3] mt-1">
            Это не бронирование — мы просто предупредим персонал, чтобы скидку
            применили без задержек
          </div>
          <button
            type="button"
            class="underline text-[#63636f] text-[24px] leading-none mt-2"
          >
            Зачем предупреждать
          </button>
        </div>

        <button
          type="button"
          class="min-w-[52px] h-[52px] rounded-full border border-[#e5e5ea] flex items-center justify-center text-[44px] leading-none text-[#2f2f35]"
        >
          ×
        </button>
      </div>

      <button
        type="button"
        class="w-full mt-6 min-h-[78px] rounded-[24px] bg-[#11b097] text-white text-[34px] leading-none font-medium"
      >
        Предупредить заведение
      </button>

      <button
        type="button"
        class="w-full mt-4 underline text-[#63636f] text-[30px] leading-none"
      >
        Я уже здесь
      </button>
    </div>
  </div>
</template>
