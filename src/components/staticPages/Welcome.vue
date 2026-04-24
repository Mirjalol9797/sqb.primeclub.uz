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
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };
  const observer = new window.IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  }, observerOptions);

  const animateElements = document.querySelectorAll(".step, .product-card");
  animateElements.forEach((el, index) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(20px)";
    el.style.transition = `opacity 0.6s ease ${
      index * 0.1
    }s, transform 0.6s ease ${index * 0.1}s`;
    observer.observe(el);
  });

  // Параллакс для hero
  window.addEventListener("scroll", function () {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector(".hero");
    if (hero) {
      hero.style.transform = `translateY(${scrolled * 0.3}px)`;
    }
  });

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
  <div class="welcome-page">
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
          <h1>{{ $t("welcome_to_primeclub") }}</h1>
          <p class="hero-subtitle">
            {{ $t("welcome_description") }}
          </p>
          <router-link :to="localePath('/offer')" class="cta-button">{{
            $t("login_to_account")
          }}</router-link>
        </div>
      </div>
    </section>
    <section class="how-it-works" id="features">
      <div class="container">
        <h2 class="section-title">{{ $t("how_it_works") }}</h2>
        <div class="steps">
          <div class="step">
            <div class="step-number">1</div>
            <h3>{{ $t("step1_title") }}</h3>
            <p>{{ $t("step1_description") }}</p>
          </div>
          <div class="step">
            <div class="step-number">2</div>
            <h3>{{ $t("step2_title") }}</h3>
            <p>{{ $t("step2_description") }}</p>
          </div>
          <div class="step">
            <div class="step-number">3</div>
            <h3>{{ $t("step3_title") }}</h3>
            <p>
              {{ $t("step3_description") }}
            </p>
          </div>
          <div class="step">
            <div class="step-number">4</div>
            <h3>{{ $t("step4_title") }}</h3>
            <p>
              {{ $t("step4_description_part1") }}
              <a
                href="https://t.me/primeuz_bot?start=support"
                target="_blank"
                class="text-[#0088cc]"
                >{{ $t("telegram") }}</a
              >
              {{ $t("step4_description_part2") }}
            </p>
          </div>
        </div>
      </div>
    </section>
    <section class="products-section" id="products">
      <div class="container">
        <h2 class="section-title">{{ $t("popular_offers") }}</h2>

        <div
          class="grid grid-cols-3 gap-6 960:grid-cols-2 960:w-full 640:!grid-cols-1"
        >
          <router-link
            v-for="(item, index) in merchant"
            :key="index"
            :to="localePath(`/offer/${item.category.slug}/${item.slug}`)"
            class="hover:shadow-[0_0_2px_0_rgba(0,0,0,.04),0_2px_20px_0_rgba(0,0,0,.08)] transition-all duration-300 rounded-lg bg-white p-6 relative border border-f7f7f7"
          >
            <div class="w-full h-[180px] mb-6">
              <img
                :src="`https://main.primeclub.uz/uploads/${item.image}`"
                :alt="item.name"
                class="w-full h-full object-cover rounded-lg"
              />
            </div>
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
            <div
              class="absolute top-6 left-6 text-white text-xs bg-ffd531 px-2 py-1 rounded-full"
            >
              {{ item.label }}
            </div>
          </router-link>
        </div>

        <div class="flex justify-center mt-10">
          <router-link :to="localePath('/offer')" class="cta-button">{{
            $t("login_to_account")
          }}</router-link>
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
.welcome-page {
  body {
    line-height: 1.6;
    color: #333;
    background: linear-gradient(135deg, #f8f9ff 0%, #fff5f2 100%);
    min-height: 100vh;
    overflow-x: hidden;
  }
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
  }
  .nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 10px;
  }
  .logo {
    font-size: 1.8rem;
    font-weight: bold;
    color: #ff8945;
    text-decoration: none;
  }
  .nav-links {
    display: flex;
    gap: 2rem;
    list-style: none;

    @media (max-width: 768px) {
      gap: 1rem;
    }
  }
  .nav-links a {
    color: #333;
    text-decoration: none;
    transition: color 0.3s ease;
  }
  .nav-links a:hover {
    color: #00b08c;
  }
  /* Hero Section */
  .hero {
    padding: 120px 0;
    text-align: center;
    position: relative;
    overflow: hidden;
  }

  .hero::before {
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

  @keyframes rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  .hero-content {
    position: relative;
    z-index: 2;
  }

  .hero h1 {
    font-size: 3.5rem;
    font-weight: 900;
    margin-bottom: 20px;
    background: linear-gradient(135deg, #ff8945 0%, #00b08c 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: fadeInUp 1s ease;
  }

  .hero-subtitle {
    font-size: 1.3rem;
    color: #666;
    max-width: 600px;
    margin: 0 auto 40px;
    line-height: 1.8;
    animation: fadeInUp 1s ease 0.2s both;
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

  .cta-button {
    display: inline-block;
    background: linear-gradient(135deg, #ff8945 0%, #ff7a35 100%);
    color: white;
    padding: 18px 40px;
    font-size: 1.1rem;
    font-weight: 700;
    text-decoration: none;
    border-radius: 50px;
    transition: all 0.3s ease;
    box-shadow: 0 8px 30px rgba(255, 137, 69, 0.4);
    animation: fadeInUp 1s ease 0.4s both;
  }
  .cta-button:hover {
    transform: translateY(-3px);
    box-shadow: 0 15px 40px rgba(255, 137, 69, 0.5);
  }
  .how-it-works {
    padding: 40px 0;
    background: white;
    position: relative;
  }
  .section-title {
    text-align: center;
    font-size: 2.5rem;
    font-weight: 800;
    color: #333;
    margin-bottom: 30px;
  }
  .steps {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 20px;
  }

  .step {
    text-align: center;
    padding: 20px 15px;
    border-radius: 20px;
    background: linear-gradient(135deg, #fff 0%, #f8f9ff 100%);
    border: 1px solid rgba(255, 137, 69, 0.1);
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
  }

  .step::before {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 2px;
    background: linear-gradient(90deg, #ff8945, #00b08c);
    transition: left 0.5s ease;
  }

  .step:hover::before {
    left: 0;
  }

  .step:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 40px rgba(255, 137, 69, 0.15);
  }

  .step-number {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: linear-gradient(135deg, #ff8945 0%, #00b08c 100%);
    color: white;
    font-size: 1.5rem;
    font-weight: 800;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 20px;
  }

  .step h3 {
    font-size: 1.3rem;
    font-weight: 700;
    margin-bottom: 15px;
    color: #333;
  }

  .step p {
    color: #666;
    line-height: 1.6;
  }
  .products-section {
    padding: 40px 0;
    background: linear-gradient(135deg, #f8f9ff 0%, #fff5f2 100%);
  }
  .products-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 30px;
    margin-top: 60px;
  }
  .product-card {
    background: white;
    border-radius: 20px;
    padding: 30px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    border: 1px solid rgba(255, 137, 69, 0.1);
    position: relative;
    overflow: hidden;
    opacity: 0;
    transform: translateY(20px);
  }
  .product-card .product-placeholder {
    height: 200px;
    background: linear-gradient(
      135deg,
      rgba(255, 137, 69, 0.1) 0%,
      rgba(0, 176, 140, 0.1) 100%
    );
    border-radius: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;
    font-size: 3rem;
    color: #ff8945;
  }
  .product-title {
    font-size: 1.3rem;
    font-weight: 700;
    margin-bottom: 10px;
    color: #333;
  }
  .product-description {
    color: #666;
    line-height: 1.6;
    margin-bottom: 20px;
  }
  .product-price {
    font-size: 1.5rem;
    font-weight: 800;
    color: #00b08c;
    margin-bottom: 20px;
  }
  .product-btn {
    width: 100%;
    background: linear-gradient(135deg, #ff8945 0%, #ff7a35 100%);
    color: white;
    padding: 12px 24px;
    border: none;
    border-radius: 10px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  .product-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(255, 137, 69, 0.3);
  }
  .support {
    padding: 40px 0;
    background: #333;
    color: white;
    text-align: center;
  }
  .support h2 {
    font-size: 2.5rem;
    margin-bottom: 2rem;
  }
  .support p {
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
  }
  .telegram-button:hover {
    background: #0077bb;
    transform: translateY(-3px);
    box-shadow: 0 10px 30px rgba(0, 136, 204, 0.4);
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
  @media (max-width: 768px) {
    .hero h1 {
      font-size: 2.5rem;
    }
    .hero-subtitle {
      font-size: 1.1rem;
    }
    .section-title {
      font-size: 2rem;
    }
    .steps {
      grid-template-columns: 1fr;
    }
    .header-content {
      flex-direction: column;
      gap: 20px;
    }
    .products-grid {
      grid-template-columns: 1fr;
    }
  }
}
</style>
