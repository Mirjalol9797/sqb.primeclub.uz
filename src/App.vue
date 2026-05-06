<script setup>
import { onMounted, computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import Header from "@/components/Header.vue";
import MobileFooter from "@/components/MobileFooter.vue";
import WelcomeSite from "@/components/WelcomeSite.vue";
import { useLoginStore } from "@/stores/login";

const route = useRoute();
const router = useRouter();
const isWelcomePassed = ref(false);

const loginStore = useLoginStore();
function siteScrollTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

const hideHeader = computed(() => {
  // Скрываем для конкретных путей
  const hidePaths = ["/search", "/login", "/uz/login"];
  if (hidePaths.some((path) => route.path.startsWith(path))) {
    return true;
  }

  // Скрываем для гостевых маршрутов (если нужно)
  if (route.meta.guest) {
    return true;
  }

  return false;
});

const isLoginPage = computed(
  () => route.path === "/login" || route.path === "/uz/login"
);

const showWelcomeSite = computed(
  () => isLoginPage.value && !isWelcomePassed.value
);

onMounted(() => {
  isWelcomePassed.value =
    localStorage.getItem("primeclub_welcome_passed") === "1";

  if (loginStore.token) {
    loginStore.checkAuthToken(router);
  }
  window.addEventListener("scroll", function () {
    const scrollElem = document.querySelector(".site-scroll-top");

    if (scrollElem) {
      if (document.documentElement.scrollTop > 400) {
        scrollElem.style.opacity = "1";
        scrollElem.style.zIndex = "10";
      } else {
        scrollElem.style.opacity = "0";
        scrollElem.style.zIndex = "-1";
      }
    }
  });
});

const handleWelcomeCompleted = () => {
  isWelcomePassed.value = true;
};
</script>

<template>
  <Header v-if="!hideHeader" />
  <RouterView />
  <MobileFooter v-if="!hideHeader" />
  <WelcomeSite
    v-if="showWelcomeSite"
    @completed="handleWelcomeCompleted"
  />

  <!-- <a
    href="https://t.me/primeuz_bot?start=support"
    class="site-support-telegram"
    target="_blank"
  >
    <img src="/icons/support.svg" alt="support" />
  </a> -->
  <div class="site-scroll-top" @click="siteScrollTop">
    <img src="./assets/images/wwww.svg" alt="scroll-top" />
  </div>
</template>

<style scoped></style>
