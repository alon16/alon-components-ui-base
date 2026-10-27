<script setup lang="ts">
defineProps({
  as: {
    type: String,
    default: "p",
    validator: (value) => ["p", "span", "div", "small", "li"].includes(value),
  },
  variant: {
    type: String,
    default: "md",
    validator: (value) => ["md", "sm", "label", "xl"].includes(value),
  },
  color: {
    type: String,
    default: "body",
    validator: (value) =>
      [
        "body",
        "muted",
        "heading",
        "inverse",
        "inverse-muted",
        "brand",
        "danger",
        "warning",
        "inherit",
      ].includes(value),
  },
  weight: {
    type: String,
    default: "regular",
    validator: (value) =>
      ["regular", "medium", "semibold", "bold"].includes(value),
  },
});
</script>

<template>
  <component
    :is="as"
    class="base-text"
    :class="[
      `base-text--${variant}`,
      `base-text--${color}`,
      `base-text--${weight}`,
    ]"
  >
    <slot />
  </component>
</template>

<style scoped>
.base-text {
  margin: var(--space-0);
}

.base-text--md {
  font-size: var(--text-body-md-size);
  line-height: var(--text-body-md-leading);
}

.base-text--sm {
  font-size: var(--text-body-sm-size);
  line-height: var(--text-body-sm-leading);
}

.base-text--label {
  font-size: var(--text-label-size);
  line-height: var(--text-label-leading);
  letter-spacing: var(--letter-spacing-label);
  text-transform: uppercase;
}

.base-text--xl {
  font-size: var(--font-size-xl);
  line-height: var(--line-height-tight);
}

.base-text--body {
  color: var(--ui-color-text-body);
}

.base-text--muted {
  color: var(--ui-color-text-muted);
}

.base-text--heading {
  color: var(--ui-color-text-heading);
}

.base-text--inverse {
  color: var(--ui-color-text-inverse);
}

.base-text--inverse-muted {
  color: var(--ui-color-text-inverse-muted);
}

.base-text--brand {
  color: var(--ui-color-brand-primary);
}

.base-text--danger {
  color: var(--ui-color-state-error);
}

.base-text--warning {
  color: var(--ui-color-state-warning);
}

.base-text--inherit {
  color: inherit;
}

.base-text--regular {
  font-weight: var(--font-weight-regular);
}

.base-text--medium {
  font-weight: var(--font-weight-medium);
}

.base-text--semibold {
  font-weight: var(--font-weight-semibold);
}

.base-text--bold {
  font-weight: var(--font-weight-bold);
}
</style>
