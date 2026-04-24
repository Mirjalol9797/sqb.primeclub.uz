<script setup>
import { useLoginStore } from "@/stores/login";
import { useRoute } from "vue-router";
import { computed } from "vue";

const loginStore = useLoginStore();
const route = useRoute();
const props = defineProps({
  burderClass: {
    type: String,
  },
});

const emit = defineEmits(["closeBurgerMenu"]);

function closeBurgerMenu(e) {
  emit("closeBurgerMenu", e);
}

const menuItems = [
  {
    to: "/offer",
    icon: "/icons/menu/menu-1.svg",
    text: "Заведения",
    role: "all",
  },
  {
    to: "/certificates",
    icon: "/icons/menu/menu-2.svg",
    text: "certificates",
    role: "all",
  },
  {
    to: "/",
    icon: "/icons/menu/menu-5.svg",
    text: "Настройки",
    role: "hr",
  },
];

const filteredMenuItems = computed(() => {
  return menuItems.filter(
    (item) => item.role === "all" || loginStore.user?.role === item.role
  );
});

const isActiveRoute = (path) => {
  return route.path === path;
};
</script>

<template>
  <div
    class="bg-white w-[280px] h-full fixed top-0 left-0 z-50 py-4 px-5 shadow-[0_0_6px_rgba(0,0,0,0.3)] translate-x-[-300px] transition-all duration-500"
    :class="burderClass"
  >
    <div class="mb-4">
      <div class="font-medium text-xl">Меню</div>
      <button class="absolute top-2 right-2" @click="closeBurgerMenu">
        <img src="@/assets/images/modal-close.svg" alt="" />
      </button>
    </div>
    <ul class="text-sm">
      <li
        v-for="item in filteredMenuItems"
        :key="item.to + item.text"
        @click="closeBurgerMenu"
      >
        <router-link
          :to="item.to"
          class="menu-item flex items-center gap-3 px-4 py-2 hover:bg-[#f4f4f4] rounded-lg relative mb-1 group transition-all duration-200"
          :class="
            isActiveRoute(item.to)
              ? 'bg-[#f4f4f4] font-medium'
              : 'hover:bg-[#f4f4f4]'
          "
        >
          <img :src="item.icon" alt="" class="w-[18px]" />
          <span>{{ item.text }}</span>
          <span
            class="absolute left-0 top-0 w-1.5 h-full rounded-l-xl transition-all duration-200"
            :class="[
              isActiveRoute(item.to) ? 'bg-ffd531' : 'bg-transparent',
              'group-hover:bg-ffd531',
            ]"
          ></span>
        </router-link>
      </li>
    </ul>
  </div>
</template>

<style lang="scss"></style>
