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
import { themeKey, type Theme } from "./theme";

const requestedTheme = new URLSearchParams(window.location.search).get("theme");
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

const query = ref("");
const navOpen = ref(false);
const activeId = ref("getting-started");

const normalize = (value: string) =>
  value.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

const filteredCatalog = computed(() => {
  const term = normalize(query.value.trim());
  if (!term) return catalog;
  return catalog
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
const setupCode = `// main.ts
import { createApp } from "vue";
import "@alon16/alon-components-ui-base/styles.css";
import "@vuepic/vue-datepicker/dist/main.css";
// Tu tema va al final para sobrescribir los tokens --ui-*.
import "./theme.css";

import App from "./App.vue";

createApp(App).mount("#app");`;
const usageCode = `<script setup lang="ts">
import { ref } from "vue";
import { BaseButton, BaseInput } from "@alon16/alon-components-ui-base";

const name = ref("");
<\/script>

<template>
  <BaseInput v-model="name" label="Nombre" />
  <BaseButton :disabled="!name">Guardar</BaseButton>
</template>`;

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
});

watch(filteredCatalog, () => nextTick(observeSections));
</script>

<template>
  <div class="pg-app">
    <a class="pg-skip-link" href="#pg-main">Saltar al contenido</a>

    <header class="pg-topbar">
      <span class="pg-topbar__menu">
        <BaseButton
          size="icon"
          variant="ghost"
          :aria-label="navOpen ? 'Cerrar navegación' : 'Abrir navegación'"
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
        <BaseSwitch
          id="pg-dark-theme"
          :model-value="theme === 'dark'"
          label="Tema oscuro"
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
            label="Buscar componente"
            placeholder="Ej.: tabla, fecha…"
            size="sm"
          />
        </div>

        <nav class="pg-nav" aria-label="Componentes">
          <a
            class="pg-nav__link"
            :class="{ 'pg-nav__link--active': activeId === 'getting-started' }"
            :aria-current="
              activeId === 'getting-started' ? 'location' : undefined
            "
            href="#getting-started"
            @click="navOpen = false"
          >
            Primeros pasos
          </a>
          <div
            v-for="group in filteredCatalog"
            :key="group.label"
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
            No hay componentes que coincidan con «{{ query }}».
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
          <p class="pg-hero__eyebrow">Biblioteca de componentes Vue 3</p>
          <h1 id="getting-started-title" class="pg-hero__title">
            Componentes tematizables para portales web
          </h1>
          <p class="pg-hero__lead">
            Cada ejemplo se renderiza en vivo desde el código fuente y muestra
            exactamente el código que necesitas para implementarlo. Alterna el
            tema oscuro para validar los tokens <code>--ui-*</code>.
          </p>
          <dl class="pg-stats">
            <div>
              <dt>Componentes</dt>
              <dd>{{ componentCount }}</dd>
            </div>
            <div>
              <dt>Ejemplos</dt>
              <dd>{{ exampleCount }}</dd>
            </div>
            <div>
              <dt>Temas</dt>
              <dd>2</dd>
            </div>
          </dl>

          <ol class="pg-steps">
            <li>
              <h2 class="pg-steps__title">Instala el paquete</h2>
              <CodeBlock :code="installCode" language="bash" />
            </li>
            <li>
              <h2 class="pg-steps__title">Importa los estilos y tu tema</h2>
              <CodeBlock :code="setupCode" language="ts" filename="main.ts" />
            </li>
            <li>
              <h2 class="pg-steps__title">Usa los componentes</h2>
              <CodeBlock :code="usageCode" filename="App.vue" />
            </li>
          </ol>
        </section>

        <template v-for="group in filteredCatalog" :key="group.label">
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
          <RichText
            text="Referencia completa de props, eventos y slots en `docs/components.md`; tokens de tema en `docs/theming.md`."
          />
        </footer>
      </main>
    </div>
  </div>
</template>
