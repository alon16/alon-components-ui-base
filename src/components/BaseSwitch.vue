<script setup lang="ts">
defineOptions({ inheritAttrs: false });

defineProps({
  id: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    default: "",
  },
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
  modelValue: Boolean,
  disabled: Boolean,
  error: { type: String, default: "" },
});

defineEmits(["update:modelValue"]);
</script>

<template>
  <span
    class="base-switch-wrapper"
    :class="{ 'base-switch-wrapper--error': error }"
  >
    <label
      class="base-switch"
      :class="[
        `base-switch--label-${labelPosition}`,
        `base-switch--${size}`,
        {
          'base-switch--disabled': disabled,
          'base-switch--error': error,
        },
      ]"
      :for="id"
    >
      <span class="base-switch__label">{{ label }}</span>
      <span class="base-switch__option">
        <input
          v-bind="$attrs"
          :id="id"
          class="base-switch__input"
          type="checkbox"
          role="switch"
          :checked="modelValue"
          :disabled="disabled"
          :aria-invalid="error ? 'true' : undefined"
          :aria-describedby="error ? `${id}-message` : undefined"
          @change="$emit('update:modelValue', $event.target.checked)"
        />
        <span class="base-switch__track" aria-hidden="true">
          <span class="base-switch__thumb" />
        </span>
      </span>
    </label>
    <span
      :id="error ? `${id}-message` : undefined"
      class="base-switch__message"
      :aria-hidden="error ? undefined : 'true'"
      :role="error ? 'alert' : undefined"
    >
      {{ error }}
    </span>
  </span>
</template>

<style scoped>
.base-switch-wrapper {
  display: grid;
  min-width: var(--space-0);
  gap: var(--bs-field-gap, var(--base-field-gap, var(--space-2)));
}

.base-switch {
  position: relative;
  display: grid;
  min-height: var(--base-choice-field-min-height);
  gap: var(--bs-field-gap, var(--base-field-gap, var(--space-2)));
  color: var(--bs-color-text-body);
  cursor: pointer;
}

.base-switch__label {
  color: var(--bs-form-label-color);
  font-size: var(--bs-form-label-size);
  font-weight: var(--text-label-weight);
  line-height: var(--text-label-leading);
}

.base-switch__option {
  position: relative;
  display: inline-flex;
  width: fit-content;
  align-items: center;
}

.base-switch--label-end {
  display: inline-flex;
  min-height: var(--space-0);
  align-items: center;
  gap: var(--space-3);
  transform: translateY(var(--base-form-row-choice-offset, var(--space-0)));
}

.base-switch--label-end .base-switch__label {
  order: 2;
}

.base-switch--label-end .base-switch__option {
  order: 1;
}

.base-switch--label-top {
  height: auto;
  grid-template-rows: var(--text-label-leading) auto;
  align-content: start;
}

.base-switch__input {
  position: absolute;
  top: 50%;
  left: 0;
  width: var(--base-switch-width);
  height: var(--base-switch-height);
  margin: var(--space-0);
  opacity: 0;
  transform: translateY(-50%);
}

.base-switch__track {
  display: flex;
  width: var(--base-switch-width);
  height: var(--base-switch-height);
  align-items: center;
  padding: calc(
    (var(--base-switch-height) - var(--base-switch-thumb-size)) / 2
  );
  border-radius: var(--radius-round);
  background: var(--bs-control-border);
  transition:
    background-color var(--transition-fast),
    box-shadow var(--transition-fast);
}

.base-switch__thumb {
  width: var(--base-switch-thumb-size);
  height: var(--base-switch-thumb-size);
  border-radius: var(--radius-round);
  background: var(--bs-control-background);
  box-shadow: var(--shadow-sm);
  transition: transform var(--transition-fast);
}

.base-switch__input:checked + .base-switch__track {
  background: var(--bs-color-action-primary);
}

.base-switch__input:checked + .base-switch__track .base-switch__thumb {
  transform: translateX(
    calc(var(--base-switch-width) - var(--base-switch-height))
  );
}

.base-switch--sm {
  --base-choice-field-min-height: var(--control-height-sm);
  --base-switch-width: var(--switch-width);
  --base-switch-height: var(--switch-height);
  --base-switch-thumb-size: var(--switch-thumb-size);
}

.base-switch--md {
  --base-choice-field-min-height: var(--control-height-md);
  --base-switch-width: calc(var(--switch-width) + var(--space-2));
  --base-switch-height: calc(var(--switch-height) + var(--space-1));
  --base-switch-thumb-size: calc(var(--switch-thumb-size) + var(--space-1));
}

.base-switch__input:focus-visible + .base-switch__track {
  box-shadow: 0 0 0 var(--focus-outline-width) var(--bs-color-focus-ring);
}

.base-switch--disabled {
  cursor: not-allowed;
  opacity: var(--opacity-disabled);
}
.base-switch--disabled .base-switch__track {
  border: var(--border-width-thin) solid var(--bs-control-disabled-border);
  background: var(--bs-control-disabled-background);
  box-sizing: border-box;
}

.base-switch--error .base-switch__track {
  box-shadow: 0 0 0 var(--border-width-thin) var(--bs-color-state-error);
}

.base-switch__message {
  min-height: var(--bs-field-message-min-height);
  margin-top: var(--space-0);
  color: var(--bs-color-state-error);
  font-size: var(--font-size-xs);
  line-height: var(--line-height-heading);
}
</style>
