<script setup lang="ts">
import { computed } from "vue";

defineOptions({ inheritAttrs: false });

const props = defineProps({
  href: {
    type: String,
    required: true,
  },
  target: {
    type: String,
    default: "",
  },
  rel: {
    type: String,
    default: "",
  },
  variant: {
    type: String,
    default: "brand",
    validator: (value) => ["brand", "body", "muted", "inverse"].includes(value),
  },
  size: {
    type: String,
    default: "md",
    validator: (value) => ["sm", "md", "lg"].includes(value),
  },
  underline: {
    type: String,
    default: "hover",
    validator: (value) => ["always", "hover", "none"].includes(value),
  },
});

const resolvedRel = computed(() => {
  if (props.rel) return props.rel;
  return props.target === "_blank" ? "noopener noreferrer" : undefined;
});
</script>

<template>
  <a
    v-bind="$attrs"
    class="base-link"
    :class="[
      `base-link--${variant}`,
      `base-link--${size}`,
      `base-link--underline-${underline}`,
    ]"
    :href="href"
    :target="target || undefined"
    :rel="resolvedRel"
  >
    <slot />
  </a>
</template>

<style scoped>
.base-link {
  display: inline;
  border-radius: var(--radius-sm);
  font: inherit;
  font-weight: var(--font-weight-medium);
  overflow-wrap: anywhere;
  text-underline-offset: var(--space-1);
  transition:
    color var(--transition-fast),
    background-color var(--transition-fast),
    box-shadow var(--transition-fast);
}

.base-link:focus-visible {
  outline: var(--focus-outline-width) solid var(--bs-color-focus-ring);
  outline-offset: var(--focus-outline-offset);
}

.base-link--brand {
  color: var(--bs-color-brand-primary);
}

.base-link--brand:hover {
  color: var(--bs-color-brand-primary-hover);
}

.base-link--body {
  color: var(--bs-color-text-body);
}

.base-link--body:hover {
  color: var(--bs-color-text-heading);
}

.base-link--muted {
  color: var(--bs-color-text-muted);
}

.base-link--muted:hover {
  color: var(--bs-color-text-body);
}

.base-link--inverse {
  color: var(--bs-color-text-inverse);
}

.base-link--inverse:hover {
  color: var(--bs-color-brand-primary);
}

.base-link--underline-always {
  text-decoration: underline;
}

.base-link--underline-hover {
  text-decoration: none;
}

.base-link--underline-hover:hover {
  text-decoration: underline;
}

.base-link--underline-none {
  text-decoration: none;
}

.base-link--sm {
  font-size: var(--text-body-sm-size);
  line-height: var(--text-body-sm-leading);
}

.base-link--md {
  font-size: var(--text-body-md-size);
  line-height: var(--text-body-md-leading);
}

.base-link--lg {
  font-size: var(--font-size-md);
  line-height: var(--line-height-base);
}
</style>
