<script setup>
import { onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { localePath } from "@/plugins/i18n";

const { t } = useI18n();

const props = defineProps({
  merchant: {
    type: Object,
    required: true,
  },
});

// Анимация появления .step и .product-card
onMounted(() => {
  // Плавный скролл по якорям
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      if (this.getAttribute("href").length > 1) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute("href"));
        if (target) {
          target.scrollIntoView({ behavior: "smooth" });
        }
      }
    });
  });
});
</script>

<template>
  <div class="other-page">
    <header class="header">
      <nav class="nav container">
        <router-link
          class="header-logo max-w-[180px] cursor-pointer font-bold text-2xl text-ff8945 flex items-center uppercase 960:text-xl 960:mr-2"
          :to="localePath('/offer')"
        >
          PrimeClub
        </router-link>
        <ul class="nav-links">
          <li>
            <a href="#products">{{ $t("partners") }}</a>
          </li>
          <li>
            <a href="https://t.me/primeuz_bot?start=support" target="_blank">{{
              $t("support")
            }}</a>
          </li>
        </ul>
      </nav>
    </header>
    <section class="hero">
      <div class="container">
        <div class="hero-content">
          <h1>{{ merchant?.title }}</h1>
          <p class="hero-subtitle" v-html="merchant?.description"></p>
        </div>
      </div>
    </section>
    <section class="merchant-section" id="products">
      <div class="container">
        <div
          class="grid grid-cols-3 gap-6 960:grid-cols-2 960:w-full 640:!grid-cols-1"
        >
          <router-link
            v-for="(item, index) in merchant?.merchants"
            :key="index"
            :to="`/offer/${item.category.slug}/${item.slug}`"
            class="merchant-card"
          >
            <div class="w-full h-[200px] mb-6 768:h-[180px] 768:mb-4">
              <img
                :src="`https://main.primeclub.uz/uploads/${item.image}`"
                :alt="item.name"
                class="w-full h-full object-cover rounded-t-lg"
              />
            </div>
            <div class="px-6 pb-6 768:px-4">
              <div class="text-base font-semibold mb-4 flex items-center gap-2">
                <img
                  :src="`https://main.primeclub.uz/uploads/${item.logo}`"
                  :alt="item.name"
                  class="w-10 h-10 object-contain rounded-lg"
                />
                {{ item.name }}
              </div>
              <div class="text-gray-500 text-height2">
                {{ item.excerpt }}
              </div>
            </div>
            <div
              class="absolute top-6 left-6 text-white text-xs bg-ffd531 px-2 py-1 rounded-full"
            >
              {{ item.label }}
            </div>
          </router-link>
        </div>
      </div>
    </section>
    <section class="support" id="support">
      <div class="container">
        <h2>{{ $t("need_help") }}</h2>
        <p>{{ $t("support_description") }}</p>
        <a
          href="https://t.me/primeuz_bot?start=support"
          class="telegram-button"
          >{{ $t("write_to_telegram") }}</a
        >
      </div>
    </section>
    <footer class="footer">
      <div class="container">
        <p>
          © {{ new Date().getFullYear() }} Primeclub.
          {{ $t("all_rights_reserved") }}.
        </p>
      </div>
    </footer>
  </div>
</template>
<style lang="scss" scoped>
.other-page {
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
  }
  .header {
    background: #fff;
    backdrop-filter: blur(10px);
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    transition: all 0.3s ease;

    .logo {
      font-size: 1.8rem;
      font-weight: bold;
      color: #ff8945;
      text-decoration: none;
    }

    .nav {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 10px;

      &-links {
        display: flex;
        gap: 2rem;
        list-style: none;

        @media (max-width: 768px) {
          gap: 1rem;
        }

        a {
          color: #333;
          text-decoration: none;
          transition: color 0.3s ease;

          &:hover {
            color: #00b08c;
          }
        }
      }
    }
  }

  /* Hero Section */
  .hero {
    padding: 120px 0;
    text-align: center;
    position: relative;
    overflow: hidden;

    @media (max-width: 768px) {
      padding: 80px 0 60px;
    }

    &::before {
      content: "";
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: radial-gradient(
        circle,
        rgba(255, 137, 69, 0.1) 0%,
        transparent 70%
      );
      animation: rotate 20s linear infinite;
    }

    &-content {
      position: relative;
      z-index: 2;
    }
    h1 {
      font-size: 56px;
      font-weight: 900;
      margin-bottom: 20px;
      background: linear-gradient(135deg, #ff8945 0%, #00b08c 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      animation: fadeInUp 1s ease;

      @media (max-width: 768px) {
        font-size: 36px;
      }
    }

    &-subtitle {
      font-size: 20px;
      color: #666;
      max-width: 600px;
      margin: 0 auto;
      line-height: 1.8;
      animation: fadeInUp 1s ease 0.2s both;

      @media (max-width: 768px) {
        font-size: 16px;
        line-height: 1.5;
      }
    }
  }

  .merchant {
    &-section {
      padding: 60px 0 80px;
      background: linear-gradient(135deg, #f8f9ff 0%, #fff5f2 100%);
    }

    &-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 30px;
      margin-top: 40px;
    }
    &-card {
      background: white;
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;
      border: 1px solid rgba(255, 137, 69, 0.1);
      position: relative;
      animation: slideInUp 0.6s ease forwards;

      &:hover {
        box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
      }
    }
  }

  .support {
    padding: 40px 0;
    background: #333;
    color: white;
    text-align: center;
    h2 {
      font-size: 2.5rem;
      margin-bottom: 2rem;
    }
    p {
      font-size: 1.2rem;
      margin-bottom: 2rem;
      opacity: 0.9;
    }
    .telegram-button {
      display: inline-block;
      padding: 1rem 2rem;
      background: #0088cc;
      color: white;
      text-decoration: none;
      border-radius: 50px;
      font-weight: bold;
      transition: all 0.3s ease;

      &:hover {
        background: #0077bb;
        transform: translateY(-3px);
        box-shadow: 0 10px 30px rgba(0, 136, 204, 0.4);
      }
    }
  }

  .footer {
    background: #222;
    color: white;
    text-align: center;
    padding: 2rem 0;
  }
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  @keyframes slideInUp {
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
}
</style>
