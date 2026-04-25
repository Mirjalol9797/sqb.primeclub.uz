<script setup>
const props = defineProps({
  description: {
    type: Object,
    default: {},
  },
});
</script>

<template>
  <div
    class="mb-6 480:mb-3 480:text-sm"
    v-html="description?.description"
  ></div>
</template>

<style></style>
