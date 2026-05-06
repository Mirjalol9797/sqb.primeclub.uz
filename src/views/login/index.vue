<script setup>
import { ref } from "vue";
import MLoginEnter from "./modules/MLoginEnter.vue";
import MLoginAuth from "./modules/MLoginAuth.vue";
import CMLanguage from "@/components/ui/CMLanguage.vue";

const authMode = ref("enter");
</script>

<template>
  <div class="min-h-screen text-white px-6 py-8">
    <CMLanguage class="absolute top-4 right-4" />
    <MLoginEnter
      v-if="authMode === 'enter'"
      @switch-to-register="authMode = 'register'"
    />
    <MLoginAuth v-else @switch-to-enter="authMode = 'enter'" />
  </div>
</template>
