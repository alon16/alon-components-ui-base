<script setup lang="ts">
import BaseHeading from "./BaseHeading.vue";
import BaseText from "./BaseText.vue";

const props = defineProps({
  title: { type: String, default: "" },
  description: { type: String, default: "" },
  stretch: { type: Boolean, default: false },
  titleAs: {
    type: String,
    default: "h3",
    validator: (value) => ["h2", "h3", "h4"].includes(value),
  },
});
</script>

<template>
  <section
    class="base-form-section"
    :class="{
      'base-form-section--stretch': props.stretch && (title || description),
    }"
  >
    <header v-if="title || description" class="base-form-section__header">
      <BaseHeading v-if="title" :as="titleAs" variant="sm">
        {{ title }}
      </BaseHeading>
      <BaseText v-if="description" variant="sm" color="muted">
        {{ description }}
      </BaseText>
    </header>
    <div class="base-form-section__content">
      <slot />
    </div>
  </section>
</template>

<style scoped>
.base-form-section {
  display: grid;
  gap: var(--ui-form-section-gap);
  min-width: var(--space-0);
}

.base-form-section--stretch {
  grid-template-rows: auto 1fr;
}

.base-form-section__header,
.base-form-section__content {
  display: grid;
  gap: var(--ui-form-field-gap);
  min-width: var(--space-0);
}
</style>
