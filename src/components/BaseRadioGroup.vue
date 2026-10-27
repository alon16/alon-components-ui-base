<script setup lang="ts">
import { computed, useId } from "vue";
import type { PropType } from "vue";
import BaseRadio from "./BaseRadio.vue";

defineOptions({ inheritAttrs: false });

const props = defineProps({
  id: { type: String, default: "" },
  name: { type: String, required: true },
  label: { type: String, default: "" },
  options: {
    type: Array as PropType<
      Array<{
        id?: string;
        value: string | number | boolean;
        label: string;
        disabled?: boolean;
      }>
    >,
    required: true,
  },
  optionLabelPosition: {
    type: String,
    default: "end",
    validator: (value) => ["top", "end"].includes(value),
  },
  orientation: {
    type: String,
    default: "vertical",
    validator: (value) => ["vertical", "horizontal"].includes(value),
  },
  bordered: { type: Boolean, default: true },
  required: Boolean,
  disabled: Boolean,
  error: { type: String, default: "" },
});

const model = defineModel({
  type: [String, Number, Boolean],
  default: "",
});
const generatedId = useId();
const groupId = computed(() => props.id || `radio-group-${generatedId}`);
const errorId = computed(() => `${groupId.value}-error`);
</script>

<template>
  <fieldset
    class="base-radio-group"
    :class="{
      'base-radio-group--disabled': disabled,
      'base-radio-group--error': error,
      'base-radio-group--horizontal': orientation === 'horizontal',
      'base-radio-group--borderless': !bordered,
    }"
    v-bind="$attrs"
  >
    <legend v-if="label" class="base-radio-group__label">
      {{ label }}<span v-if="required" aria-hidden="true"> *</span>
    </legend>
    <div class="base-radio-group__options">
      <BaseRadio
        v-for="(option, index) in options"
        :id="option.id || `${groupId}-${index}`"
        :key="option.id || `${groupId}-${index}`"
        v-model="model"
        :name="name"
        :value="option.value"
        :label="option.label"
        :label-position="optionLabelPosition"
        :required="required"
        :disabled="disabled || option.disabled"
        :invalid="Boolean(error)"
        :aria-describedby="error ? errorId : undefined"
      />
    </div>
    <span
      :id="error ? errorId : undefined"
      class="base-radio-group__message"
      :aria-hidden="error ? undefined : 'true'"
      :role="error ? 'alert' : undefined"
    >
      {{ error }}
    </span>
  </fieldset>
</template>

<style scoped>
.base-radio-group {
  display: grid;
  min-width: var(--space-0);
  margin: var(--space-0);
  padding: var(--space-0);
  border: var(--border-width-thin) solid var(--bs-color-border-default);
  border-radius: var(--radius-md);
  gap: var(--bs-field-gap, var(--base-field-gap, var(--space-2)));
}

.base-radio-group__label {
  padding: var(--space-0) var(--space-2);
  color: var(--bs-form-label-color);
  font-size: var(--bs-form-label-size);
  font-weight: var(--text-label-weight);
  line-height: var(--text-label-leading);
}

.base-radio-group__options {
  display: grid;
  gap: var(--bs-form-field-gap);
  padding: var(--space-2) var(--space-3) 0;
}

.base-radio-group--horizontal .base-radio-group__options {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  column-gap: var(--bs-form-field-gap);
}

.base-radio-group__options :deep(.base-radio--label-top),
.base-radio-group__options :deep(.base-radio--label-end) {
  min-height: var(--space-0);
  height: auto;
  width: 100%;
}

.base-radio-group--horizontal .base-radio-group__options :deep(.base-radio) {
  min-width: 0;
  flex: 1 1 0;
}

.base-radio-group__message {
  box-sizing: border-box;
  height: var(--bs-field-message-min-height);
  min-height: var(--bs-field-message-min-height);
  margin-top: var(--space-0);
  padding: var(--space-0) var(--space-3) var(--space-3);
  color: var(--bs-color-state-error);
  font-size: var(--font-size-xs);
  line-height: var(--line-height-heading);
}

.base-radio-group--error {
  border-color: var(--bs-color-state-error);
}

.base-radio-group--borderless {
  border: var(--space-0);
}

.base-radio-group--borderless .base-radio-group__label {
  margin-bottom: var(--space-1);
  padding-inline: var(--space-0);
}

.base-radio-group--borderless .base-radio-group__options,
.base-radio-group--borderless .base-radio-group__message {
  padding-inline: var(--space-0);
}

.base-radio-group--disabled {
  opacity: var(--opacity-disabled);
}
</style>
