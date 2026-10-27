<script setup lang="ts">
import { computed, inject, ref, useId } from "vue";

import { BaseButton, BaseIcon } from "../../src/index";
import { examples, toConsumerSource } from "../examples";
import { themeKey } from "../theme";
import CodeBlock from "./CodeBlock.vue";
import RichText from "./RichText.vue";

const props = withDefaults(
  defineProps<{
    example: string;
    title: string;
    description?: string;
    layout?: "row" | "stack" | "grid" | "block";
    // Los ejemplos de fecha reciben `dark` para sincronizar el selector.
    themed?: boolean;
  }>(),
  { description: "", layout: "row", themed: false },
);

const theme = inject(themeKey);
const codeVisible = ref(true);
const codeId = useId();

const entry = computed(() => examples[props.example]);
const source = computed(() =>
  entry.value ? toConsumerSource(entry.value.source) : "",
);
const filename = computed(
  () => `${props.example.split("/").at(-1) ?? "Example"}.vue`,
);
</script>

<template>
  <article class="pg-demo">
    <header class="pg-demo__header">
      <div>
        <h4 class="pg-demo__title">{{ title }}</h4>
        <p v-if="description" class="pg-demo__description">
          <RichText :text="description" />
        </p>
      </div>
      <BaseButton
        size="sm"
        variant="outline"
        :aria-expanded="codeVisible"
        :aria-controls="codeId"
        @click="codeVisible = !codeVisible"
      >
        <BaseIcon name="grid" size="sm" decorative />
        {{ codeVisible ? "Ocultar código" : "Ver código" }}
      </BaseButton>
    </header>

    <div class="pg-demo__preview" :class="`pg-demo__preview--${layout}`">
      <component
        :is="entry.component"
        v-if="entry"
        v-bind="themed ? { dark: theme === 'dark' } : {}"
      />
      <p v-else class="pg-demo__missing">
        No existe el ejemplo «{{ example }}».
      </p>
    </div>

    <div v-show="codeVisible" :id="codeId" class="pg-demo__code">
      <CodeBlock :code="source" :filename="filename" />
    </div>
  </article>
</template>
