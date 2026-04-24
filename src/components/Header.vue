<script setup>
import { computed, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import BurgerMenu from "@/components/BurgerMenu.vue";
import CMLanguage from "@/components/ui/CMLanguage.vue";
import { useSettingsStore } from "@/stores/settings";
import { useLoginStore } from "@/stores/login";
import { localePath } from "@/plugins/i18n";

const loginStore = useLoginStore();
const settingsStore = useSettingsStore();
const router = useRouter();
const route = useRoute();

const menuItems = computed(() => [
  {
    to: localePath("/offer"),
    icon: "/icons/menu/menu-1.svg",
    text: "discounts",
    role: "all",
  },
]);

const filteredMenuItems = computed(() => {
  return menuItems.value.filter(
    (item) => item.role === "all" || loginStore.user?.role === item.role
  );
});

const isActiveRoute = (path) => {
  return route.path === localePath(path);
};

function openBurgerMenu() {
  settingsStore.isBurgerMenu = true;
}
function closeBurgerMenu() {
  settingsStore.isBurgerMenu = false;
}

function logOut() {
  loginStore.logout();
  localStorage.removeItem("telegramAuthCode"); // опционально: если хранишь
  router.push(localePath("/offer"));
}
</script>

<template>
  <header class="header shadow-header relative z-1 bg-white 768:hidden">
    <!---->
  </header>
  <!-- burger left menu -->
  <BurgerMenu
    @closeBurgerMenu="closeBurgerMenu"
    :burderClass="settingsStore.isBurgerMenu ? 'translate-x-[0px] ' : ''"
  />
  <div
    class="inset-0 fixed bg-[#000] z-10 opacity-50"
    v-if="settingsStore.isBurgerMenu"
    @click="closeBurgerMenu"
  ></div>
</template>

<style lang="scss">
.user-wrap {
  &:hover {
    .user-info {
      display: block;
    }
  }
}

.header-logo {
  font-family: "Outfit", sans-serif;
}
</style>
