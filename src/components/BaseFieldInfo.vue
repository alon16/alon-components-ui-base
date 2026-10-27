<script setup lang="ts">
import { computed, useId } from "vue";
import BaseIcon from "./BaseIcon.vue";

const props = defineProps({
  text: {
    type: String,
    default: "",
  },
  type: {
    type: String,
    default: "",
    validator: (value) =>
      ["", "primary", "secondary", "success", "danger"].includes(value),
  },
  ariaLabel: { type: String, default: "Información adicional" },
});

const generatedId = useId();
const tooltipId = computed(() => `field-info-${generatedId}`);
const hasText = computed(() => Boolean(props.text.trim()));
const infoType = computed(() => props.type || "default");
</script>

<template>
  <span class="base-field-info" :class="`base-field-info--${infoType}`">
    <button
      type="button"
      class="base-field-info__trigger"
      :aria-label="ariaLabel"
      :aria-describedby="hasText ? tooltipId : undefined"
    >
      <BaseIcon name="info" size="sm" decorative />
      <span
        v-if="hasText"
        :id="tooltipId"
        class="base-field-info__tooltip"
        role="tooltip"
      >
        {{ text }}
      </span>
    </button>
  </span>
</template>

<style scoped>
.base-field-info {
  --field-info-color: var(--ui-color-text-muted);

  position: relative;
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
}

.base-field-info--primary {
  --field-info-color: var(--ui-color-brand-primary);
}

.base-field-info--secondary {
  --field-info-color: var(--ui-color-brand-secondary);
}

.base-field-info--success {
  --field-info-color: var(--ui-color-state-success);
}

.base-field-info--danger {
  --field-info-color: var(--ui-color-state-error);
}

.base-field-info__trigger {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: var(--space-4);
  height: var(--space-4);
  padding: var(--space-0);
  border: var(--border-width-thin) solid transparent;
  border-radius: var(--radius-round);
  color: var(--field-info-color);
  background: transparent;
  cursor: help;
  transition:
    color var(--transition-fast),
    background-color var(--transition-fast),
    border-color var(--transition-fast),
    box-shadow var(--transition-fast),
    transform var(--transition-fast);
}

.base-field-info__trigger :deep(.base-icon) {
  width: 0.75rem;
  height: 0.75rem;
}

.base-field-info__trigger:hover {
  background: var(--ui-field-info-hover-background);
}

.base-field-info__trigger:focus-visible {
  outline: none;
  border-color: var(--ui-field-info-focus-border);
  box-shadow: 0 0 0 var(--focus-outline-offset)
    var(--ui-field-info-focus-shadow);
}

.base-field-info__tooltip {
  position: absolute;
  z-index: 1;
  bottom: calc(100% + var(--space-2));
  left: 50%;
  display: block;
  min-width: 12rem;
  max-width: 16rem;
  padding: var(--space-2) var(--space-3);
  border: var(--border-width-thin) solid var(--ui-field-info-tooltip-border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
  color: var(--ui-color-text-body);
  background: var(--ui-color-surface-page);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-regular);
  line-height: var(--line-height-base);
  text-align: left;
  white-space: normal;
  opacity: 0;
  visibility: hidden;
  transform: translate(-50%, var(--space-1));
  pointer-events: none;
  transition:
    opacity var(--transition-fast),
    visibility var(--transition-fast),
    transform var(--transition-fast);
}

.base-field-info__tooltip::after {
  content: "";
  position: absolute;
  top: 100%;
  left: 50%;
  width: var(--space-2);
  height: var(--space-2);
  background: var(--ui-color-surface-page);
  border-right: var(--border-width-thin) solid
    var(--ui-field-info-tooltip-border);
  border-bottom: var(--border-width-thin) solid
    var(--ui-field-info-tooltip-border);
  transform: translate(-50%, -50%) rotate(45deg);
}

.base-field-info__trigger:hover .base-field-info__tooltip,
.base-field-info__trigger:focus-visible .base-field-info__tooltip {
  opacity: 1;
  visibility: visible;
  transform: translate(-50%, 0);
}
</style>
