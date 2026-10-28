<script setup lang="ts">
import { computed } from "vue";

import { BaseBadge } from "../../src/index";
import CodeBlock from "./CodeBlock.vue";
import RichText from "./RichText.vue";

const props = withDefaults(
  defineProps<{
    id: string;
    name: string;
    description: string;
    imports?: string[];
    status?: string;
  }>(),
  { imports: () => [], status: "" },
);

const importCode = computed(() => {
  const names = props.imports.length ? props.imports : [props.name];
  return names.length > 2
    ? `import {\n${names.map((name) => `  ${name},`).join("\n")}\n} from "@alon16/alon-components-ui-base";`
    : `import { ${names.join(", ")} } from "@alon16/alon-components-ui-base";`;
});
</script>

<template>
  <section :id="id" class="pg-component" :aria-labelledby="`${id}-title`">
    <header class="pg-component__header">
      <div class="pg-component__title-row">
        <h3 :id="`${id}-title`" class="pg-component__title">{{ name }}</h3>
        <BaseBadge v-if="status" :label="status" tone="violet" />
      </div>
      <p class="pg-component__description">
        <RichText :text="description" />
      </p>
      <CodeBlock :code="importCode" language="ts" filename="Importación" />
    </header>
    <div class="pg-component__demos">
      <slot />
    </div>
  </section>
</template>
