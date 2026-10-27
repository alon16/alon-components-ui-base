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
  --badge-text: var(--ui-badge-neutral-text);
  --badge-background: var(--ui-badge-neutral-background);
  --badge-border: var(--ui-badge-neutral-border);

  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 0;
  padding: var(--ui-badge-sm-padding-block) var(--ui-badge-sm-padding-inline);
  color: var(--badge-text);
  background: var(--badge-background);
  border: var(--border-width-thin) solid var(--badge-border);
  border-radius: var(--radius-round);
  font-weight: var(--font-weight-semibold);
  line-height: var(--ui-badge-sm-line-height);
  white-space: nowrap;
}

.base-badge--sm {
  padding-block: var(--ui-badge-sm-padding-block);
  padding-inline: var(--ui-badge-sm-padding-inline);
  font-size: var(--font-size-xs);
  line-height: var(--ui-badge-sm-line-height);
}

.base-badge--md {
  padding-block: var(--ui-badge-md-padding-block);
  padding-inline: var(--ui-badge-md-padding-inline);
  font-size: var(--text-body-sm-size);
  line-height: var(--ui-badge-md-line-height);
}

.base-badge--width-fixed {
  width: var(--ui-badge-fixed-width);
  min-width: var(--ui-badge-fixed-width);
}

.base-badge--info {
  --badge-text: var(--ui-badge-info-text);
  --badge-background: var(--ui-badge-info-background);
  --badge-border: var(--ui-badge-info-border);
}

.base-badge--success {
  --badge-text: var(--ui-badge-success-text);
  --badge-background: var(--ui-badge-success-background);
  --badge-border: var(--ui-badge-success-border);
}

.base-badge--warning {
  --badge-text: var(--ui-badge-warning-text);
  --badge-background: var(--ui-badge-warning-background);
  --badge-border: var(--ui-badge-warning-border);
}

.base-badge--error {
  --badge-text: var(--ui-badge-error-text);
  --badge-background: var(--ui-badge-error-background);
  --badge-border: var(--ui-badge-error-border);
}

.base-badge--critical {
  --badge-text: var(--ui-badge-critical-text);
  --badge-background: var(--ui-badge-critical-background);
  --badge-border: var(--ui-badge-critical-border);
}

.base-badge--progress {
  --badge-text: var(--ui-badge-progress-text);
  --badge-background: var(--ui-badge-progress-background);
  --badge-border: var(--ui-badge-progress-border);
}

.base-badge--violet {
  --badge-text: var(--ui-badge-violet-text);
  --badge-background: var(--ui-badge-violet-background);
  --badge-border: var(--ui-badge-violet-border);
}
</style>
