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
    <div
      class="site-container flex items-center justify-between px-2 h-[68px] 768:px-4"
    >
      <div class="flex items-center">
        <div
          class="mr-4 p-2 bg-ffd531 rounded-lg cursor-pointer hidden"
          @click="openBurgerMenu"
        >
          <img src="@/assets/images/burger-white.svg" alt="" />
        </div>
        <router-link
          class="header-logo max-w-[320px] cursor-pointer font-bold text-2xl text-ff8945 flex items-center uppercase 960:text-xl 960:mr-2"
          :to="localePath('/offer')"
        >
          <img
            src="/icons/kapital-primeclub-logo.png"
            alt="logo"
            class="w-full h-full"
          />
        </router-link>
      </div>
      <ul class="text-sm flex items-center gap-1 1024:text-xs">
        <li v-for="item in filteredMenuItems" :key="item.to + item.text">
          <router-link
            :to="item.to"
            class="menu-item px-2 py-2 rounded-lg relative mb-1 group transition-all duration-200 960:px-2 960:py-1.5"
            :class="
              isActiveRoute(item.to)
                ? 'bg-ffd531 font-medium text-111D28'
                : 'hover:bg-ffd531 hover:text-111D28'
            "
          >
            <span>{{ $t(item.text) }}</span>
          </router-link>
        </li>
        <li>
          <router-link
            :to="localePath('/certificates')"
            class="menu-item px-2 py-2 rounded-lg relative mb-1 group transition-all duration-200 960:px-2 960:py-1.5"
            :class="
              isActiveRoute('/certificates')
                ? 'bg-ffd531 font-medium text-111D28'
                : 'hover:bg-ffd531 hover:text-111D28'
            "
          >
            <span>{{ $t("certificates") }}</span>
          </router-link>
        </li>
      </ul>
      <div class="flex items-center 768:hidden">
        <div class="flex items-center gap-4">
          <div
            v-if="
              loginStore.user?.id == 13 ||
              loginStore.user?.id == 15 ||
              loginStore.user?.id == 16 ||
              loginStore.user?.id == 88
            "
            class="flex items-center gap-1 text-xs font-medium bg-ffd531 rounded-lg text-111D28 px-2 py-1.5"
          >
            <span>{{ $t("balance") }}: </span>
            <span>{{ loginStore.formattedBalance }} {{ $t("sum") }}</span>
          </div>
          <div class="items-center justify-end ml-4 flex">
            <CMLanguage />
          </div>
          <!-- <div
            class="text-sm name font-bold max-w-[160px] text-right 960:text-xs 960:max-w-[120px]"
          >
            {{ loginStore.user?.first_name }} {{ loginStore.user?.last_name }}
            {{ loginStore.user?.middle_name }}
          </div> -->
          <div class="header-right user-wrap flex items-center relative z-10">
            <div class="w-11 h-11 mr-2 960:w-8 960:h-8">
              <img
                :src="
                  loginStore.user?.image
                    ? `https://main.primeclub.uz/uploads/${loginStore.user?.image}`
                    : '/icons/user-name.svg'
                "
                alt="user-name"
                class="user-icon cursor-pointer w-full h-full object-cover rounded-full"
              />
            </div>
            <img
              src="@/assets/images/small-arrow-down.svg"
              class="cursor-pointer"
              alt=""
            />
            <div
              class="user-info hidden absolute rounded-lg shadow-[0_2px_16px_1px_rgba(0,0,0,0.12)] bg-white w-[180px] left-[-165%] top-[130%] p-4 after:content-[''] after:absolute after:top-[-20px] after:left-0 after:w-full after:h-5 after:bg-transparent"
            >
              <router-link
                :to="localePath('/profile')"
                class="w-full text-left flex items-center text-sm font-medium mb-4 last:mb-0"
              >
                <img src="/icons/menu/profile.svg" alt="" class="mr-2" />
                <span>{{ $t("profile") }}</span>
              </router-link>
              <button
                class="w-full text-left flex items-center text-sm font-medium mb-4 last:mb-0"
                @click="logOut"
              >
                <img src="/icons/menu/exit.svg" alt="" class="mr-2" />
                <span>{{ $t("exit") }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
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
