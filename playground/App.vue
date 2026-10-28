<script setup lang="ts">
import {
  computed,
  nextTick,
  onMounted,
  onUnmounted,
  provide,
  ref,
  watch,
} from "vue";

import { BaseButton, BaseIcon, BaseInput, BaseSwitch } from "../src/index";
import packageJson from "../package.json";
import { catalog } from "./catalog";
import CodeBlock from "./components/CodeBlock.vue";
import ComponentSection from "./components/ComponentSection.vue";
import DemoBlock from "./components/DemoBlock.vue";
import RichText from "./components/RichText.vue";
import { localeKey, messages, translate, type Locale } from "./i18n";
import { themeKey, type Theme } from "./theme";

const searchParams = new URLSearchParams(window.location.search);
const requestedTheme = searchParams.get("theme");
const theme = ref<Theme>(
  requestedTheme === "dark" || requestedTheme === "light"
    ? requestedTheme
    : window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light",
);
provide(themeKey, theme);

watch(
  theme,
  (value) => {
    if (value === "dark") document.documentElement.dataset.theme = "dark";
    else delete document.documentElement.dataset.theme;
  },
  { immediate: true },
);

const requestedLocale = searchParams.get("lang");
const locale = ref<Locale>(
  requestedLocale === "es" || requestedLocale === "en"
    ? requestedLocale
    : navigator.language.toLowerCase().startsWith("en")
      ? "en"
      : "es",
);
provide(localeKey, locale);
const t = computed(() => messages[locale.value]);

watch(
  locale,
  (value) => {
    document.documentElement.lang = value;
  },
  { immediate: true },
);

const localizedCatalog = computed(() =>
  catalog.map((group) => ({
    ...group,
    label: translate(group.label, locale.value),
    items: group.items.map((item) => ({
      ...item,
      name: translate(item.name, locale.value),
      description: translate(item.description, locale.value),
      status: item.status && translate(item.status, locale.value),
      demos: item.demos.map((demo) => ({
        ...demo,
        title: translate(demo.title, locale.value),
        description:
          demo.description && translate(demo.description, locale.value),
      })),
    })),
  })),
);

const query = ref("");
const navOpen = ref(false);
const activeId = ref("getting-started");

const normalize = (value: string) =>
  value.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

const filteredCatalog = computed(() => {
  const term = normalize(query.value.trim());
  if (!term) return localizedCatalog.value;
  return localizedCatalog.value
    .map((group) => ({
      ...group,
      items: group.items.filter((item) =>
        normalize(
          `${item.name} ${item.description} ${group.label} ${(item.imports ?? []).join(" ")}`,
        ).includes(term),
      ),
    }))
    .filter((group) => group.items.length);
});

const componentCount = catalog.reduce(
  (total, group) => total + group.items.length,
  0,
);
const exampleCount = catalog.reduce(
  (total, group) =>
    total + group.items.reduce((sum, item) => sum + item.demos.length, 0),
  0,
);

const installCode = `pnpm add @alon16/alon-components-ui-base @vuepic/vue-datepicker`;
const setupCode = computed(
  () => `// main.ts
import { createApp } from "vue";
import "@alon16/alon-components-ui-base/styles.css";
import "@vuepic/vue-datepicker/dist/main.css";
// ${t.value.setupThemeComment}
import "./theme.css";

import App from "./App.vue";

createApp(App).mount("#app");`,
);
const usageCode = computed(
  () => `<script setup lang="ts">
import { ref } from "vue";
import { BaseButton, BaseInput } from "@alon16/alon-components-ui-base";

const name = ref("");
<\/script>

<template>
  <BaseInput v-model="name" label="${t.value.usageNameLabel}" />
  <BaseButton :disabled="!name">${t.value.usageSave}</BaseButton>
</template>`,
);

let observer: IntersectionObserver | undefined;

function observeSections() {
  observer?.disconnect();
  observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (visible[0]) activeId.value = visible[0].target.id;
    },
    { rootMargin: "-80px 0px -65% 0px" },
  );
  document
    .querySelectorAll<HTMLElement>(".pg-component, #getting-started")
    .forEach((section) => observer?.observe(section));
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === "Escape" && navOpen.value) navOpen.value = false;
}

onMounted(() => {
  observeSections();
  window.addEventListener("keydown", handleKeydown);
  // El navegador intenta saltar al ancla antes de que Vue monte las secciones.
  if (window.location.hash)
    document.getElementById(window.location.hash.slice(1))?.scrollIntoView();
});

onUnmounted(() => {
  observer?.disconnect();
  window.removeEventListener("keydown", handleKeydown);
  delete document.documentElement.dataset.theme;
  document.documentElement.lang = "es";
});

watch(filteredCatalog, () => nextTick(observeSections));
</script>

<template>
  <div class="pg-app">
    <a class="pg-skip-link" href="#pg-main">{{ t.skipLink }}</a>

    <header class="pg-topbar">
      <span class="pg-topbar__menu">
        <BaseButton
          size="icon"
          variant="ghost"
          :aria-label="navOpen ? t.closeNav : t.openNav"
          :aria-expanded="navOpen"
          aria-controls="pg-sidebar"
          @click="navOpen = !navOpen"
        >
          <BaseIcon :name="navOpen ? 'close' : 'menu'" size="md" decorative />
        </BaseButton>
      </span>

      <a class="pg-brand" href="#getting-started">
        <span class="pg-brand__mark">
          <BaseIcon name="logo" size="md" decorative />
        </span>
        <span class="pg-brand__name">UI Components</span>
        <span class="pg-brand__version">v{{ packageJson.version }}</span>
      </a>

      <div class="pg-topbar__actions">
        <span class="pg-locale">
          <span class="pg-locale__option" aria-hidden="true">ES</span>
          <BaseSwitch
            id="pg-english"
            :model-value="locale === 'en'"
            label="EN"
            :aria-label="t.english"
            size="sm"
            @update:model-value="locale = $event ? 'en' : 'es'"
          />
        </span>
        <BaseSwitch
          id="pg-dark-theme"
          :model-value="theme === 'dark'"
          :label="t.darkTheme"
          size="sm"
          @update:model-value="theme = $event ? 'dark' : 'light'"
        />
      </div>
    </header>

    <div class="pg-layout">
      <aside
        id="pg-sidebar"
        class="pg-sidebar"
        :class="{ 'pg-sidebar--open': navOpen }"
      >
        <div class="pg-sidebar__search">
          <BaseInput
            v-model="query"
            :label="t.searchLabel"
            :placeholder="t.searchPlaceholder"
            size="sm"
          />
        </div>

        <nav class="pg-nav" :aria-label="t.navLabel">
          <a
            class="pg-nav__link"
            :class="{ 'pg-nav__link--active': activeId === 'getting-started' }"
            :aria-current="
              activeId === 'getting-started' ? 'location' : undefined
            "
            href="#getting-started"
            @click="navOpen = false"
          >
            {{ t.gettingStarted }}
          </a>
          <div
            v-for="group in filteredCatalog"
            :key="group.id"
            class="pg-nav__group"
          >
            <p class="pg-nav__group-label">
              <BaseIcon :name="group.icon" size="sm" decorative />
              {{ group.label }}
            </p>
            <a
              v-for="item in group.items"
              :key="item.id"
              class="pg-nav__link"
              :class="{ 'pg-nav__link--active': activeId === item.id }"
              :aria-current="activeId === item.id ? 'location' : undefined"
              :href="`#${item.id}`"
              @click="navOpen = false"
            >
              {{ item.name }}
            </a>
          </div>
          <p v-if="!filteredCatalog.length" class="pg-nav__empty">
            {{ t.noMatches(query) }}
          </p>
        </nav>
      </aside>

      <div
        v-if="navOpen"
        class="pg-backdrop"
        aria-hidden="true"
        @click="navOpen = false"
      />

      <main id="pg-main" class="pg-main" tabindex="-1">
        <section
          id="getting-started"
          class="pg-hero"
          aria-labelledby="getting-started-title"
        >
          <p class="pg-hero__eyebrow">{{ t.heroEyebrow }}</p>
          <h1 id="getting-started-title" class="pg-hero__title">
            {{ t.heroTitle }}
          </h1>
          <p class="pg-hero__lead">
            <RichText :text="t.heroLead" />
          </p>
          <dl class="pg-stats">
            <div>
              <dt>{{ t.statComponents }}</dt>
              <dd>{{ componentCount }}</dd>
            </div>
            <div>
              <dt>{{ t.statExamples }}</dt>
              <dd>{{ exampleCount }}</dd>
            </div>
            <div>
              <dt>{{ t.statThemes }}</dt>
              <dd>2</dd>
            </div>
          </dl>

          <ol class="pg-steps">
            <li>
              <h2 class="pg-steps__title">{{ t.stepInstall }}</h2>
              <CodeBlock :code="installCode" language="bash" />
            </li>
            <li>
              <h2 class="pg-steps__title">{{ t.stepSetup }}</h2>
              <CodeBlock :code="setupCode" language="ts" filename="main.ts" />
            </li>
            <li>
              <h2 class="pg-steps__title">{{ t.stepUse }}</h2>
              <CodeBlock :code="usageCode" filename="App.vue" />
            </li>
          </ol>
        </section>

        <template v-for="group in filteredCatalog" :key="group.id">
          <h2 class="pg-group-title">
            <BaseIcon :name="group.icon" size="md" decorative />
            {{ group.label }}
          </h2>
          <ComponentSection
            v-for="item in group.items"
            :id="item.id"
            :key="item.id"
            :name="item.name"
            :description="item.description"
            :imports="item.imports"
            :status="item.status"
          >
            <DemoBlock
              v-for="demo in item.demos"
              :key="demo.example"
              v-bind="demo"
            />
          </ComponentSection>
        </template>

        <footer class="pg-footer">
          <RichText :text="t.footer" />
        </footer>
      </main>
    </div>
  </div>
</template>
