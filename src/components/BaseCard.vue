<script setup lang="ts">
import BaseIcon from "./BaseIcon.vue";

defineOptions({ inheritAttrs: false });

defineProps({
  as: {
    type: String,
    default: "div",
    validator: (value) =>
      ["div", "section", "article", "aside", "details"].includes(value),
  },
  surface: {
    type: String,
    default: "page",
    validator: (value) => ["page", "inverse", "primary"].includes(value),
  },
  padding: {
    type: String,
    default: "comfortable",
    validator: (value) => ["comfortable", "compact", "none"].includes(value),
  },
  radius: {
    type: String,
    default: "md",
    validator: (value) => ["md", "lg"].includes(value),
  },
  elevation: {
    type: String,
    default: "sm",
    validator: (value) => ["none", "sm", "md"].includes(value),
  },
  outlined: {
    type: Boolean,
    default: true,
  },
  title: {
    type: String,
    default: "",
  },
  titlePosition: {
    type: String,
    default: "inside",
    validator: (value) => ["inside", "outside"].includes(value),
  },
  titleIcon: {
    type: String,
    default: "",
  },
  titleAs: {
    type: String,
    default: "h3",
    validator: (value) => ["h2", "h3", "h4"].includes(value),
  },
});
</script>

<template>
  <div
    v-if="title && titlePosition === 'outside'"
    class="base-card-frame base-card-frame--title-outside"
  >
    <div class="base-card__outside-title">
      <BaseIcon v-if="titleIcon" :name="titleIcon" size="sm" decorative />
      <component :is="titleAs" class="base-card__title">{{ title }}</component>
    </div>
    <component
      :is="as"
      v-bind="$attrs"
      class="base-card"
      :class="[
        `base-card--surface-${surface}`,
        `base-card--padding-${padding}`,
        `base-card--radius-${radius}`,
        `base-card--elevation-${elevation}`,
        { 'base-card--outlined': outlined },
      ]"
    >
      <slot />
    </component>
  </div>
  <component
    v-else
    :is="as"
    v-bind="$attrs"
    class="base-card"
    :class="[
      `base-card--surface-${surface}`,
      `base-card--padding-${padding}`,
      `base-card--radius-${radius}`,
      `base-card--elevation-${elevation}`,
      { 'base-card--outlined': outlined },
    ]"
  >
    <div v-if="title" class="base-card__inside-title">
      <BaseIcon v-if="titleIcon" :name="titleIcon" size="sm" decorative />
      <component :is="titleAs" class="base-card__title">{{ title }}</component>
    </div>
    <slot />
  </component>
</template>

<style scoped>
.base-card-frame {
  min-width: var(--space-0);
}

.base-card-frame--title-outside {
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  gap: var(--ui-form-section-gap);
}

.base-card {
  min-width: var(--space-0);
}

.base-card-frame--title-outside > .base-card {
  height: 100%;
  box-sizing: border-box;
}

.base-card__outside-title,
.base-card__inside-title {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  color: inherit;
}

.base-card__outside-title {
  padding-inline: var(--space-0);
}

.base-card__inside-title {
  margin-bottom: calc(var(--ui-form-section-gap, 12px) + 4px);
}

.base-card__title {
  margin: var(--space-0);
  color: inherit;
  font-size: var(--text-heading-sm-size);
  font-weight: var(--text-heading-sm-weight);
  line-height: var(--text-heading-sm-leading);
}

.base-card__outside-title :deep(.base-icon),
.base-card__inside-title :deep(.base-icon) {
  color: var(--ui-color-brand-primary);
}

.base-card--surface-page {
  color: var(--ui-color-text-body);
  background: var(--ui-card-background);
}

.base-card--surface-inverse {
  color: var(--ui-color-text-inverse);
  background: var(--ui-color-surface-inverse);
}

.base-card--surface-primary {
  color: var(--ui-color-text-on-primary);
  background: var(--ui-color-brand-primary);
}

.base-card--surface-page.base-card--outlined {
  border: var(--border-width-thin) solid var(--ui-color-border-default);
}

.base-card--surface-inverse.base-card--outlined {
  border: var(--border-width-thin) solid var(--ui-color-border-inverse);
}

.base-card--surface-primary.base-card--outlined {
  border: var(--border-width-thin) solid var(--ui-color-brand-primary);
}

.base-card--padding-comfortable {
  padding: var(--card-padding);
}

.base-card--padding-compact {
  padding: var(--ui-card-padding-compact);
}

.base-card--padding-none {
  padding: var(--space-0);
}

.base-card--radius-md {
  border-radius: var(--radius-md);
}

.base-card--radius-lg {
  border-radius: var(--radius-lg);
}

.base-card--elevation-none {
  box-shadow: none;
}

.base-card--elevation-sm {
  box-shadow: var(--shadow-sm);
}

.base-card--elevation-md {
  box-shadow: var(--shadow-md);
}

@media (max-width: 29.9375rem) {
  .base-card--padding-compact {
    padding: var(--space-5);
  }
}
</style>
