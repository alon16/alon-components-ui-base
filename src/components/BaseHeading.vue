<script setup lang="ts">
defineProps({
  as: {
    type: String,
    default: "h2",
    validator: (value) => ["h1", "h2", "h3", "h4", "p", "span"].includes(value),
  },
  variant: {
    type: String,
    default: "md",
    validator: (value) => ["hero", "lg", "md", "sm", "xs"].includes(value),
  },
  color: {
    type: String,
    default: "heading",
    validator: (value) =>
      ["heading", "body", "inverse", "brand"].includes(value),
  },
  align: {
    type: String,
    default: "left",
    validator: (value) => ["left", "center", "right"].includes(value),
  },
});
</script>

<template>
  <component
    :is="as"
    class="base-heading"
    :class="[
      `base-heading--${variant}`,
      `base-heading--${color}`,
      `base-heading--align-${align}`,
    ]"
  >
    <slot />
  </component>
</template>

<style scoped>
.base-heading {
  margin: var(--space-0);
}

.base-heading--hero {
  font-size: var(--text-heading-hero-size);
  font-weight: var(--text-heading-hero-weight);
  line-height: var(--text-heading-hero-leading);
}

.base-heading--lg {
  font-size: var(--text-heading-lg-size);
  font-weight: var(--text-heading-lg-weight);
  line-height: var(--text-heading-lg-leading);
}

.base-heading--md {
  font-size: var(--text-heading-md-size);
  font-weight: var(--text-heading-md-weight);
  line-height: var(--text-heading-md-leading);
}

.base-heading--sm {
  font-size: var(--text-heading-sm-size);
  font-weight: var(--text-heading-sm-weight);
  line-height: var(--text-heading-sm-leading);
}

.base-heading--xs {
  font-size: var(--text-heading-xs-size);
  font-weight: var(--text-heading-xs-weight);
  line-height: var(--text-heading-xs-leading);
}

.base-heading--heading {
  color: var(--ui-color-text-heading);
}

.base-heading--body {
  color: var(--ui-color-text-body);
}

.base-heading--inverse {
  color: var(--ui-color-text-inverse);
}

.base-heading--brand {
  color: var(--ui-color-brand-primary);
}

.base-heading--align-left {
  text-align: left;
}

.base-heading--align-center {
  text-align: center;
}

.base-heading--align-right {
  text-align: right;
}
</style>
