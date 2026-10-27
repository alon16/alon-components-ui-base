<script setup lang="ts">
import type { BaseBadgeProps } from "../public-types";

withDefaults(defineProps<BaseBadgeProps>(), {
  label: "",
  tone: "neutral",
  size: "sm",
  width: "fixed",
});
</script>

<template>
  <span
    class="base-badge"
    :class="[
      `base-badge--${tone}`,
      `base-badge--${size}`,
      `base-badge--width-${width}`,
    ]"
  >
    <slot>{{ label }}</slot>
  </span>
</template>

<style scoped>
.base-badge {
  --badge-text: var(--bs-badge-neutral-text);
  --badge-background: var(--bs-badge-neutral-background);
  --badge-border: var(--bs-badge-neutral-border);

  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 0;
  padding: var(--bs-badge-sm-padding-block) var(--bs-badge-sm-padding-inline);
  color: var(--badge-text);
  background: var(--badge-background);
  border: var(--border-width-thin) solid var(--badge-border);
  border-radius: var(--radius-round);
  font-weight: var(--font-weight-semibold);
  line-height: var(--bs-badge-sm-line-height);
  white-space: nowrap;
}

.base-badge--sm {
  padding-block: var(--bs-badge-sm-padding-block);
  padding-inline: var(--bs-badge-sm-padding-inline);
  font-size: var(--font-size-xs);
  line-height: var(--bs-badge-sm-line-height);
}

.base-badge--md {
  padding-block: var(--bs-badge-md-padding-block);
  padding-inline: var(--bs-badge-md-padding-inline);
  font-size: var(--text-body-sm-size);
  line-height: var(--bs-badge-md-line-height);
}

.base-badge--width-fixed {
  width: var(--bs-badge-fixed-width);
  min-width: var(--bs-badge-fixed-width);
}

.base-badge--info {
  --badge-text: var(--bs-badge-info-text);
  --badge-background: var(--bs-badge-info-background);
  --badge-border: var(--bs-badge-info-border);
}

.base-badge--success {
  --badge-text: var(--bs-badge-success-text);
  --badge-background: var(--bs-badge-success-background);
  --badge-border: var(--bs-badge-success-border);
}

.base-badge--warning {
  --badge-text: var(--bs-badge-warning-text);
  --badge-background: var(--bs-badge-warning-background);
  --badge-border: var(--bs-badge-warning-border);
}

.base-badge--error {
  --badge-text: var(--bs-badge-error-text);
  --badge-background: var(--bs-badge-error-background);
  --badge-border: var(--bs-badge-error-border);
}

.base-badge--critical {
  --badge-text: var(--bs-badge-critical-text);
  --badge-background: var(--bs-badge-critical-background);
  --badge-border: var(--bs-badge-critical-border);
}

.base-badge--progress {
  --badge-text: var(--bs-badge-progress-text);
  --badge-background: var(--bs-badge-progress-background);
  --badge-border: var(--bs-badge-progress-border);
}

.base-badge--violet {
  --badge-text: var(--bs-badge-violet-text);
  --badge-background: var(--bs-badge-violet-background);
  --badge-border: var(--bs-badge-violet-border);
}
</style>
