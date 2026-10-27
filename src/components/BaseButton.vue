<script setup lang="ts">
import { computed } from "vue";
import BaseIcon from "./BaseIcon.vue";

const props = defineProps({
  variant: {
    type: String,
    default: "primary",
    validator: (value) =>
      [
        "primary",
        "secondary",
        "outline",
        "ghost",
        "inverse",
        "danger",
        "ghost-danger",
      ].includes(value),
  },
  size: {
    type: String,
    default: "sm",
    validator: (value) => ["sm", "md", "lg", "icon"].includes(value),
  },
  type: {
    type: String,
    default: "button",
    validator: (value) => ["button", "submit", "reset"].includes(value),
  },
  loading: Boolean,
  disabled: Boolean,
  block: Boolean,
});

defineEmits(["click"]);

const classes = computed(() => [
  `base-button--${props.variant}`,
  `base-button--${props.size}`,
  { "base-button--block": props.block, "base-button--loading": props.loading },
]);
</script>

<template>
  <button
    class="base-button"
    :class="classes"
    :type="type"
    :disabled="disabled || loading"
    :aria-busy="loading || undefined"
    @click="$emit('click', $event)"
  >
    <BaseIcon
      v-if="loading"
      class="base-spinner"
      name="loader"
      size="sm"
      decorative
    />
    <span class="base-button__content">
      <slot />
    </span>
  </button>
</template>

<style scoped>
.base-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  min-width: max-content;
  border: var(--border-width-thin) solid transparent;
  border-radius: var(--radius-md);
  font: inherit;
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-heading);
  cursor: pointer;
  transition:
    color var(--transition-fast),
    background-color var(--transition-fast),
    border-color var(--transition-fast),
    box-shadow var(--transition-fast),
    transform var(--transition-fast);
}

.base-button:hover:not(:disabled) {
  transform: translateY(calc(var(--border-width-thin) * -1));
}

.base-button:active:not(:disabled) {
  transform: translateY(var(--space-0));
}

.base-button:focus-visible {
  outline: var(--focus-outline-width) solid var(--base-button-focus-color);
  outline-offset: var(--focus-outline-offset);
}

.base-button:disabled {
  cursor: not-allowed;
  opacity: var(--opacity-disabled);
}

.base-button--primary {
  --base-button-focus-color: var(--bs-color-action-primary);

  color: var(--bs-color-text-on-primary);
  background: var(--bs-color-action-primary);
  box-shadow: var(--shadow-sm);
}

.base-button--primary:hover:not(:disabled) {
  background: var(--bs-color-action-primary-hover);
  box-shadow: var(--shadow-md);
}

.base-button--secondary {
  --base-button-focus-color: var(--bs-color-action-secondary);

  color: var(--bs-color-text-inverse);
  background: var(--bs-color-action-secondary);
}

.base-button--secondary:hover:not(:disabled) {
  background: var(--bs-color-brand-secondary-hover);
}

.base-button--outline {
  --base-button-focus-color: var(--bs-color-action-primary);

  color: var(--bs-color-action-primary);
  background: transparent;
  border-color: var(--bs-color-action-primary);
}

.base-button--outline:hover:not(:disabled) {
  color: var(--bs-color-text-on-primary);
  background: var(--bs-color-action-primary);
  border-color: var(--bs-color-action-primary);
}

.base-button--danger {
  --base-button-focus-color: var(--bs-color-action-danger);

  color: var(--bs-color-text-inverse);
  background: var(--bs-color-action-danger);
  box-shadow: var(--shadow-sm);
}

.base-button--danger:hover:not(:disabled) {
  background: var(--bs-color-action-danger-hover);
  box-shadow: var(--shadow-md);
}

.base-button--ghost {
  --base-button-focus-color: var(--bs-color-border-strong);

  color: var(--bs-color-text-heading);
  background: transparent;
  border-color: var(--bs-color-border-strong);
}

.base-button--ghost:hover:not(:disabled) {
  background: var(--bs-color-surface-muted);
}

.base-button--ghost-danger {
  --base-button-focus-color: var(--bs-color-action-danger);

  color: var(--bs-color-action-danger);
  background: transparent;
  border-color: var(--bs-color-action-danger);
}

.base-button--ghost-danger:hover:not(:disabled) {
  background: var(--bs-color-state-error-surface);
}

.base-button--inverse {
  --base-button-focus-color: var(--bs-color-text-inverse);

  color: var(--bs-color-text-inverse);
  background: transparent;
}

.base-button--inverse:hover:not(:disabled) {
  color: var(--bs-color-brand-primary);
  background: var(--bs-color-surface-inverse-hover);
}

.base-button--sm {
  min-height: var(--control-height-sm);
  padding: var(--space-2) var(--space-4);
  font-size: var(--font-size-xs);
}

.base-button--md {
  min-height: var(--control-height-md);
  padding: var(--space-3) var(--space-5);
  font-size: var(--font-size-sm);
}

.base-button--lg {
  min-height: var(--control-height-lg);
  padding: var(--space-4) var(--space-8);
  font-size: var(--font-size-md);
}

.base-button--icon {
  width: var(--icon-size-md);
  min-width: var(--icon-size-md);
  height: var(--icon-size-md);
  min-height: var(--icon-size-md);
  padding: var(--space-1);
  border: var(--space-0);
  border-radius: var(--radius-sm);
  font-size: var(--font-size-sm);
}

.base-button--block {
  width: 100%;
}

.base-button--loading .base-button__content {
  opacity: var(--opacity-loading-content);
}

.base-button--loading :deep(.base-icon) {
  animation: base-button-spin var(--motion-spin-duration) linear infinite;
}

.base-button__content {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
}

@keyframes base-button-spin {
  to {
    transform: rotate(1turn);
  }
}
</style>
