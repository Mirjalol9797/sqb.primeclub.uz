<script setup>
import { computed } from "vue";

const props = defineProps({
  certificateData: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits(["download-pdf"]);

const certificate = computed(
  () => props.certificateData?.data || props.certificateData || {}
);

const offer = computed(() => certificate.value?.offer || {});
const merchant = computed(() => offer.value?.merchant || {});
const contactName = computed(() => certificate.value?.contact_name || "-");
const code = computed(() => certificate.value?.code || "-");
const qrCode = computed(() => certificate.value?.qr_code || "");
const phone = computed(() => certificate.value?.contact_phone || "");
const address = computed(() => merchant.value?.address || "-");

const logoUrl = computed(() => {
  if (!merchant.value?.logo) return "";
  return `https://main.primeclub.uz/uploads/${merchant.value.logo}`;
});

const mapPreviewUrl = computed(() => {
  const lat = merchant.value?.latitude;
  const lon = merchant.value?.longitude;
  if (!lat || !lon) return "";
  return `https://static-maps.yandex.ru/1.x/?lang=ru_RU&ll=${lon},${lat}&z=15&size=650,260&l=map&pt=${lon},${lat},pm2gnm`;
});

function callMerchant() {
  if (!phone.value) return;
  window.location.href = `tel:${phone.value.replace(/\s+/g, "")}`;
}

function downloadPdf() {
  emit("download-pdf", certificate.value?.id);
}
</script>

<template>
  <div class="w-full text-white bg-black">
    <button
      type="button"
      @click="closeModal"
      class="sticky top-1 ml-auto min-w-8 h-8 rounded-full border border-[#e5e5ea] flex items-center justify-center text-2xl leading-none text-[#2f2f35] z-10"
    >
      ×
    </button>
    <div class="text-xl font-semibold mb-2 text-center">Сертификат</div>

    <div class="border border-[#ececf0] rounded-2xl p-4">
      <div class="flex items-start justify-between gap-3">
        <div class="min-w-0">
          <div class="text-lg font-semibold leading-tight mb-1">
            {{ merchant.name || "-" }}
          </div>
          <div class="text-sm">{{ offer.name || "-" }}</div>
        </div>
      </div>

      <div class="flex items-center justify-between mt-4 text-sm">
        <div class="  ">Контактное лицо</div>
        <div class="font-semibold text-right">{{ contactName }}</div>
      </div>
    </div>

    <div class="border border-[#ececf0] rounded-2xl p-4 mt-4">
      <div class="flex items-center justify-between gap-4">
        <div>
          <div class="text-xs uppercase">Код сертификата</div>
          <div class="text-2xl font-bold mt-1 break-all">{{ code }}</div>
        </div>
        <div class="w-24 h-24 rounded-xl border border-[#ececf0] p-2 bg-[#eee]">
          <img v-if="qrCode" :src="qrCode" alt="" />
        </div>
      </div>

      <button type="button" class="mt-2 underline text-sm">
        Что делать с этим кодом?
      </button>
    </div>

    <div class="rounded-2xl bg-[#f4f6f6] text-[#5f646e] p-4 mt-4 text-base">
      {{ certificate.what_to_do_with_code?.text }}
    </div>

    <div class="mt-6">
      <div class="text-xl font-semibold mb-3">Действия</div>
      <button type="button" class="w-full site-btn-grey mb-3">
        Как получить скидку?
      </button>
      <button type="button" class="w-full site-btn-grey mb-3">Условия</button>
      <button
        type="button"
        class="w-full site-btn-grey mb-3"
        @click="downloadPdf"
      >
        Скачать PDF
      </button>
      <button type="button" class="w-full site-btn-grey" @click="callMerchant">
        Позвонить в заведение
      </button>
    </div>

    <div class="mt-6 border-t border-[#ececf0] pt-4">
      <div class="text-xl font-semibold mb-2">Адрес заведения</div>
      <div class="text-sm mb-3">{{ address }}</div>
      <img
        v-if="mapPreviewUrl"
        :src="mapPreviewUrl"
        alt=""
        class="w-full h-44 object-cover rounded-2xl border border-[#ececf0]"
      />
    </div>

    <div class="mt-4 rounded-3xl border border-[#ffffff1f] bg-[#eee] p-4">
      <img
        v-if="qrCode"
        :src="qrCode"
        alt=""
        class="w-56 h-56 mx-auto rounded-xl p-3"
      />
      <div class="text-center text-[#5f646e] text-sm mt-3">
        Покажите персоналу
      </div>
    </div>
  </div>
</template>
