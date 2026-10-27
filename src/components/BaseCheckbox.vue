<script setup lang="ts">
import { computed, useId } from "vue";
import BaseFieldInfo from "./BaseFieldInfo.vue";

defineOptions({ inheritAttrs: false });

const props = defineProps({
  id: { type: String, default: "" },
  label: { type: String, default: "" },
  labelPosition: {
    type: String,
    default: "end",
    validator: (value) => ["top", "end"].includes(value),
  },
  info: { type: String, default: "" },
  infoAriaLabel: { type: String, default: "Información adicional" },
  type: {
    type: String,
    default: "primary",
    validator: (value) =>
      ["primary", "secondary", "success", "danger"].includes(value),
  },
  infoType: {
    type: String,
    default: "",
    validator: (value) =>
      ["", "primary", "secondary", "success", "danger"].includes(value),
  },
  size: {
    type: String,
    default: "sm",
    validator: (value) => ["sm", "md"].includes(value),
  },
  name: { type: String, default: "" },
  error: { type: String, default: "" },
  required: Boolean,
  disabled: Boolean,
  invalid: Boolean,
  indeterminate: Boolean,
});

const model = defineModel({ type: Boolean, default: false });
const generatedId = useId();
const inputId = computed(() => props.id || `checkbox-${generatedId}`);
const messageId = computed(() => `${inputId.value}-message`);
const hasInfo = computed(() => Boolean(props.info.trim()));
const hasError = computed(() => Boolean(props.error) || props.invalid);
</script>

<template>
  <span
    class="base-checkbox"
    :class="[
      `base-checkbox--${type}`,
      `base-checkbox--${size}`,
      `base-checkbox--label-${labelPosition}`,
      {
        'base-checkbox--disabled': disabled,
        'base-checkbox--error': hasError,
      },
    ]"
  >
    <label class="base-checkbox__field" :for="inputId">
      <span class="base-checkbox__label-row">
        <span v-if="label || $slots.label" class="base-checkbox__label">
          <slot name="label">{{ label }}</slot>
        </span>
        <BaseFieldInfo
          v-if="hasInfo"
          :text="info"
          :type="infoType"
          :aria-label="infoAriaLabel"
        />
      </span>
      <span class="base-checkbox__option">
        <input
          :id="inputId"
          v-bind="$attrs"
          v-model="model"
          class="base-checkbox__input"
          type="checkbox"
          :name="name || undefined"
          :required="required"
          :disabled="disabled"
          :indeterminate="indeterminate"
          :aria-invalid="hasError ? 'true' : undefined"
          :aria-describedby="error ? messageId : undefined"
        />
        <span class="base-checkbox__control" aria-hidden="true">✓</span>
      </span>
    </label>
    <span
      :id="error ? messageId : undefined"
      class="base-checkbox__message"
      :aria-hidden="error ? undefined : 'true'"
      :role="error ? 'alert' : undefined"
    >
      {{ error }}
    </span>
  </span>
</template>

<style scoped>
.base-checkbox {
  --checkbox-color: var(--bs-color-brand-primary);

  display: grid;
  min-width: 0;
  gap: var(--bs-field-gap, var(--base-field-gap, var(--space-2)));
}

.base-checkbox--secondary {
  --checkbox-color: var(--bs-color-brand-secondary);
}

.base-checkbox--success {
  --checkbox-color: var(--bs-color-state-success);
}

.base-checkbox--danger {
  --checkbox-color: var(--bs-color-state-error);
}

.base-checkbox--error {
  --checkbox-color: var(--bs-color-state-error);
}

.base-checkbox__field {
  display: grid;
  min-height: var(--base-choice-field-min-height);
  min-width: 0;
  gap: var(--bs-field-gap, var(--base-field-gap, var(--space-2)));
  color: var(--bs-color-text-body);
  cursor: pointer;
}

.base-checkbox__label {
  color: var(--bs-form-label-color);
  font-size: var(--bs-form-label-size);
  font-weight: var(--text-label-weight);
  line-height: var(--text-label-leading);
}

.base-checkbox__label-row {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
}

.base-checkbox__option {
  position: relative;
  display: inline-flex;
  width: fit-content;
  align-items: center;
}

.base-checkbox--label-end .base-checkbox__field {
  display: inline-flex;
  min-height: var(--space-0);
  align-items: center;
  gap: var(--space-3);
  transform: translateY(var(--base-form-row-choice-offset, var(--space-0)));
}

.base-checkbox--label-end .base-checkbox__label-row {
  order: 2;
}

.base-checkbox--label-end .base-checkbox__option {
  order: 1;
}

.base-checkbox--label-top .base-checkbox__field {
  height: auto;
  grid-template-rows: var(--text-label-leading) auto;
  align-content: start;
}

.base-checkbox__input {
  position: absolute;
  top: 50%;
  left: 0;
  width: var(--space-1);
  height: var(--space-1);
  opacity: 0;
  transform: translateY(-50%);
}

.base-checkbox__control {
  display: inline-flex;
  width: var(--space-4);
  height: var(--space-4);
  flex: 0 0 var(--space-4);
  align-items: center;
  justify-content: center;
  border: var(--border-width-thin) solid var(--bs-control-border);
  border-radius: var(--radius-sm);
  color: transparent;
  background: var(--bs-control-background);
  font-size: var(--font-size-2xs);
  font-weight: var(--font-weight-bold);
  line-height: 1;
  transition:
    border-color var(--transition-fast),
    background-color var(--transition-fast);
}

.base-checkbox--md .base-checkbox__control {
  width: var(--space-5);
  height: var(--space-5);
  flex-basis: var(--space-5);
}

.base-checkbox--sm {
  --base-choice-field-min-height: var(--control-height-sm);
}

.base-checkbox--md {
  --base-choice-field-min-height: var(--control-height-md);
}

.base-checkbox__field:hover .base-checkbox__control {
  border-color: var(--checkbox-color);
}

.base-checkbox__input:checked + .base-checkbox__control,
.base-checkbox__input:indeterminate + .base-checkbox__control {
  border-color: var(--checkbox-color);
  color: var(--bs-color-text-on-primary);
  background: var(--checkbox-color);
}

.base-checkbox__input:indeterminate + .base-checkbox__control {
  font-size: 0;
}

.base-checkbox__input:indeterminate + .base-checkbox__control::after {
  width: var(--space-2);
  height: var(--border-width-thin);
  background: currentColor;
  content: "";
}

.base-checkbox__input:focus-visible + .base-checkbox__control {
  outline: var(--focus-outline-width) solid var(--bs-color-focus-ring);
  outline-offset: var(--focus-outline-offset);
}

.base-checkbox__input:disabled + .base-checkbox__control {
  background: var(--bs-control-disabled-background);
  border-color: var(--bs-control-disabled-border);
}

.base-checkbox--error
  .base-checkbox__input:not(:checked, :indeterminate)
  + .base-checkbox__control {
  border-color: var(--bs-color-state-error);
  background: var(--bs-color-state-error-surface);
}

.base-checkbox__message {
  flex-basis: 100%;
  min-height: var(--bs-field-message-min-height);
  margin-top: calc(var(--space-2) * -0.5);
  color: var(--bs-color-state-error);
  font-size: var(--font-size-xs);
  line-height: var(--line-height-heading);
}

.base-checkbox--disabled {
  opacity: var(--opacity-disabled);
}

.base-checkbox--disabled .base-checkbox__field {
  cursor: not-allowed;
}
</style>
