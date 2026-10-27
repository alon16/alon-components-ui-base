<script setup lang="ts">
defineOptions({ inheritAttrs: false });

defineProps({
  id: { type: String, required: true },
  name: { type: String, required: true },
  value: { type: [String, Number, Boolean], required: true },
  label: { type: String, default: "" },
  labelPosition: {
    type: String,
    default: "end",
    validator: (value) => ["top", "end"].includes(value),
  },
  size: {
    type: String,
    default: "sm",
    validator: (value) => ["sm", "md"].includes(value),
  },
  required: Boolean,
  disabled: Boolean,
  invalid: Boolean,
});

const model = defineModel({ type: [String, Number, Boolean], default: "" });
</script>

<template>
  <label
    class="base-radio"
    :class="[
      `base-radio--label-${labelPosition}`,
      `base-radio--${size}`,
      { 'base-radio--disabled': disabled },
    ]"
  >
    <span class="base-radio__label">{{ label }}</span>
    <span class="base-radio__option">
      <input
        v-bind="$attrs"
        :id="id"
        v-model="model"
        class="base-radio__input"
        type="radio"
        :name="name"
        :value="value"
        :required="required"
        :disabled="disabled"
        :aria-invalid="invalid ? 'true' : undefined"
      />
      <span class="base-radio__control" aria-hidden="true"></span>
    </span>
  </label>
</template>

<style scoped>
.base-radio {
  position: relative;
  display: grid;
  min-height: var(--base-choice-field-min-height);
  min-width: 0;
  gap: var(--bs-field-gap, var(--base-field-gap, var(--space-2)));
  color: var(--bs-color-text-body);
  cursor: pointer;
}

.base-radio__label {
  color: var(--bs-form-label-color);
  font-size: var(--bs-form-label-size);
  font-weight: var(--text-label-weight);
  line-height: var(--text-label-leading);
}

.base-radio__option {
  position: relative;
  display: inline-flex;
  width: fit-content;
  align-items: center;
}

.base-radio--label-end {
  display: inline-flex;
  align-items: center;
  gap: var(--space-3);
}

.base-radio--label-end .base-radio__label {
  order: 2;
}

.base-radio--label-end .base-radio__option {
  order: 1;
}

.base-radio--label-top {
  height: auto;
  grid-template-rows: var(--text-label-leading) auto;
  align-content: start;
}

.base-radio__input {
  position: absolute;
  top: 50%;
  left: 0;
  width: var(--space-1);
  height: var(--space-1);
  opacity: 0;
  transform: translateY(-50%);
}

.base-radio__control {
  display: inline-flex;
  width: var(--base-radio-control-size);
  height: var(--base-radio-control-size);
  flex: 0 0 var(--base-radio-control-size);
  align-items: center;
  justify-content: center;
  border: var(--border-width-thin) solid var(--bs-control-border);
  border-radius: var(--radius-round);
  background: var(--bs-control-background);
  transition:
    border-color var(--transition-fast),
    background-color var(--transition-fast);
}

.base-radio__control::after {
  width: var(--base-radio-dot-size);
  height: var(--base-radio-dot-size);
  border-radius: var(--radius-round);
  background: var(--bs-color-brand-primary);
  content: "";
  opacity: 0;
  transform: scale(0.5);
  transition:
    opacity var(--transition-fast),
    transform var(--transition-fast);
}

.base-radio--sm {
  --base-choice-field-min-height: var(--control-height-sm);
  --base-radio-control-size: var(--space-5);
  --base-radio-dot-size: var(--space-3);
}

.base-radio--md {
  --base-choice-field-min-height: var(--control-height-md);
  --base-radio-control-size: calc(var(--space-5) + var(--space-1));
  --base-radio-dot-size: calc(var(--space-3) + var(--space-1));
}

.base-radio:hover:not(.base-radio--disabled) .base-radio__control {
  border-color: var(--bs-color-text-heading);
}

.base-radio__input:checked + .base-radio__control {
  border-color: var(--bs-color-brand-secondary);
}

.base-radio__input:checked + .base-radio__control::after {
  opacity: 1;
  transform: scale(1);
}

.base-radio__input:focus-visible + .base-radio__control {
  outline: var(--focus-outline-width) solid var(--bs-color-focus-ring);
  outline-offset: var(--focus-outline-offset);
}

.base-radio--disabled {
  cursor: not-allowed;
  opacity: var(--opacity-disabled);
}
.base-radio--disabled .base-radio__control {
  border-color: var(--bs-control-disabled-border);
  background: var(--bs-control-disabled-background);
}
</style>
