<script setup lang="ts">
import { computed, ref, useId } from "vue";
import { VueDatePicker } from "@vuepic/vue-datepicker";
import BaseFieldInfo from "./BaseFieldInfo.vue";
import BaseIcon from "./BaseIcon.vue";

defineOptions({ inheritAttrs: false });

const props = defineProps({
  modelValue: { type: [Date, String, Number, Object], default: null },
  pickerProps: { type: Object, default: () => ({}) },
  id: { type: String, default: "" },
  name: { type: String, default: "" },
  label: { type: String, default: "" },
  placeholder: { type: String, default: "" },
  clearAriaLabel: { type: String, default: "Borrar fecha" },
  ariaLabels: { type: Object, default: undefined },
  actionRow: { type: Object, default: undefined },
  dayNames: { type: [Array, Function], default: undefined },
  weekNumbers: { type: [Boolean, Object], default: undefined },
  dark: Boolean,
  info: { type: String, default: "" },
  infoAriaLabel: { type: String, default: "Información adicional" },
  infoType: {
    type: String,
    default: "",
    validator: (value) =>
      ["", "primary", "secondary", "success", "danger"].includes(value),
  },
  size: {
    type: String,
    default: "md",
    validator: (value) => ["sm", "md", "lg"].includes(value),
  },
  state: {
    type: String,
    default: "default",
    validator: (value) => ["default", "error", "success"].includes(value),
  },
  help: { type: String, default: "" },
  error: { type: String, default: "" },
  success: { type: String, default: "" },
  required: Boolean,
  disabled: Boolean,
  readonly: Boolean,
  clearable: { type: Boolean, default: true },
  tone: {
    type: String,
    default: "default",
    validator: (value) => ["default", "inverse"].includes(value),
  },
  inputIcon: { type: String, default: "calendar" },
});

const emit = defineEmits([
  "update:modelValue",
  "focus",
  "blur",
  "open",
  "close",
  "clear",
  "invalid",
]);
const generatedId = useId();
const inputId = computed(() => props.id || `date-picker-${generatedId}`);
const messageId = computed(() => `${inputId.value}-message`);
const hasInfo = computed(() => Boolean(props.info.trim()));
const currentState = computed(() =>
  props.error || props.state === "error"
    ? "error"
    : props.success || props.state === "success"
      ? "success"
      : "default",
);
const message = computed(() => props.error || props.success || props.help);
const calendarIcon = computed(() =>
  props.inputIcon === "clock" ? "clock" : "calendar",
);
const picker = ref(null);

const datePickerProps = computed(() => ({
  ...props.pickerProps,
  modelValue: props.modelValue,
  disabled: props.disabled,
  readonly: props.readonly,
  dark: props.dark,
  clearable: props.clearable,
  placeholder: props.placeholder,
  ariaLabels: props.ariaLabels,
  actionRow: props.actionRow,
  dayNames: props.dayNames,
  weekNumbers: props.weekNumbers,
  inputAttrs: {
    name: props.name || undefined,
    autocomplete: "off",
  },
  ui: { ...(props.pickerProps.ui ?? {}), menu: ["base-date-picker__menu"] },
}));

function updateValue(value) {
  emit("update:modelValue", value ?? null);
}

function clearValue() {
  emit("clear");
}

defineExpose({
  focus: () => picker.value?.inputRef?.()?.focus(),
  open: () => picker.value?.openMenu?.(),
  close: () => picker.value?.closeMenu?.(),
});
</script>

<template>
  <div
    class="base-date-picker"
    :class="[`base-date-picker--${currentState}`, `base-date-picker--${tone}`]"
  >
    <div v-if="label" class="base-date-picker__label-row">
      <label class="base-date-picker__label" :for="inputId"
        >{{ label }}<span v-if="required" aria-hidden="true"> *</span></label
      >
      <BaseFieldInfo
        v-if="hasInfo"
        :text="info"
        :type="infoType"
        :aria-label="infoAriaLabel"
      />
    </div>
    <VueDatePicker
      ref="picker"
      v-bind="datePickerProps"
      :id="inputId"
      class="base-date-picker__picker"
      :clearable="clearable"
      @update:model-value="updateValue"
      @focus="emit('focus')"
      @blur="emit('blur')"
      @open="emit('open')"
      @closed="emit('close')"
      @cleared="clearValue"
      @invalid-date="emit('invalid')"
    >
      <template
        #dp-input="{
          value,
          isMenuOpen,
          onInput,
          onEnter,
          onTab,
          onClear,
          onBlur,
          onFocus,
          onKeypress,
          onPaste,
        }"
      >
        <div class="base-date-picker__control">
          <BaseIcon
            class="base-date-picker__input-icon"
            :name="calendarIcon"
            size="sm"
            decorative
          />
          <input
            :id="inputId"
            v-bind="$attrs"
            :name="name || undefined"
            :value="value"
            class="base-date-picker__input"
            :class="[
              `base-date-picker__input--${size}`,
              { 'base-date-picker__input--clearable': clearable },
            ]"
            type="text"
            :placeholder="placeholder"
            :required="required"
            :disabled="disabled"
            :readonly="readonly"
            autocomplete="off"
            autocapitalize="off"
            autocorrect="off"
            spellcheck="false"
            :aria-invalid="currentState === 'error' ? 'true' : undefined"
            :aria-describedby="message ? messageId : undefined"
            :aria-expanded="isMenuOpen"
            @input="onInput"
            @focus="onFocus"
            @blur="onBlur"
            @keydown.enter="onEnter"
            @keydown.tab="onTab"
            @keydown="onKeypress"
            @paste="onPaste"
          />
        </div>
      </template>
      <template #clear-icon="{ clear }">
        <button
          v-if="clearable"
          class="base-date-picker__clear"
          type="button"
          :aria-label="clearAriaLabel"
          @click="clear"
        >
          <BaseIcon name="close" size="sm" decorative />
        </button>
      </template>
      <template #calendar-icon
        ><BaseIcon name="calendar" size="sm" decorative
      /></template>
      <template #clock-icon
        ><BaseIcon name="clock" size="sm" decorative
      /></template>
      <template #arrow-left
        ><BaseIcon name="chevronLeft" size="sm" decorative
      /></template>
      <template #arrow-right
        ><BaseIcon name="chevronRight" size="sm" decorative
      /></template>
      <template #arrow-up
        ><BaseIcon
          name="chevronDown"
          class="base-date-picker__arrow-up"
          size="sm"
          decorative
      /></template>
      <template #arrow-down
        ><BaseIcon name="chevronDown" size="sm" decorative
      /></template>
    </VueDatePicker>
    <span
      :id="messageId"
      class="base-date-picker__message"
      :class="{ 'base-date-picker__message--visible': message }"
      :aria-hidden="message ? undefined : 'true'"
      :role="currentState === 'error' ? 'alert' : undefined"
      >{{ message }}</span
    >
  </div>
</template>

<style>
.base-date-picker {
  display: grid;
  min-width: var(--space-0);
  gap: var(--ui-field-gap, var(--space-2));
}
.base-date-picker__label {
  color: var(--ui-form-label-color);
  font-size: var(--ui-form-label-size);
  font-weight: var(--text-label-weight);
  line-height: var(--text-label-leading);
}
.base-date-picker__label-row {
  display: flex;
  width: 100%;
  min-width: 0;
  align-items: center;
  gap: var(--space-1);
  flex-wrap: wrap;
}
.base-date-picker--inverse .base-date-picker__label {
  color: var(--ui-color-text-inverse-muted);
}
.base-date-picker__control {
  position: relative;
}
.base-date-picker__picker {
  display: block;
  width: 100%;
}
.base-date-picker__input {
  width: 100%;
  min-width: var(--space-0);
  border: var(--border-width-thin) solid var(--ui-control-border);
  border-radius: var(--radius-md);
  color: var(--ui-form-value-color);
  background: var(--ui-control-background);
  font: inherit;
  transition:
    border-color var(--transition-fast),
    box-shadow var(--transition-fast),
    background-color var(--transition-fast);
}
.base-date-picker__input::placeholder {
  color: var(--ui-color-text-muted);
}
.base-date-picker__input:hover:not(:disabled):not(:read-only) {
  border-color: var(--ui-control-hover-border);
}
.base-date-picker__input:focus {
  border-color: var(--ui-control-focus-border);
  outline: none;
  background: var(--ui-control-focus-background);
  box-shadow: 0 0 0 var(--space-1) var(--ui-control-focus-shadow);
}
.base-date-picker__input:disabled {
  cursor: not-allowed;
  background: var(--ui-control-disabled-background);
  border-color: var(--ui-control-disabled-border);
}
.base-date-picker__input:read-only {
  cursor: default;
}
.base-date-picker__input--sm {
  height: var(--control-height-sm);
  padding-inline: var(--space-10) var(--space-10);
  font-size: var(--font-size-xs);
}
.base-date-picker__input--md {
  height: var(--control-height-md);
  padding-inline: var(--space-10) var(--space-10);
  font-size: var(--font-size-sm);
}
.base-date-picker__input--lg {
  height: var(--control-height-lg);
  padding-inline: var(--space-10) var(--space-10);
  font-size: var(--font-size-md);
}
.base-date-picker__input--clearable.base-date-picker__input--sm {
  padding-right: var(--space-12);
}
.base-date-picker__input--clearable.base-date-picker__input--md {
  padding-right: var(--space-12);
}
.base-date-picker__input--clearable.base-date-picker__input--lg {
  padding-right: var(--space-12);
}
.base-date-picker__input-icon {
  position: absolute;
  z-index: 1;
  top: 50%;
  left: var(--space-3);
  color: var(--ui-color-text-muted);
  transform: translateY(-50%);
  pointer-events: none;
}
.base-date-picker__clear {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-inline-end: var(--space-1);
  padding: var(--space-0);
  border: 0;
  border-radius: var(--radius-sm);
  color: var(--ui-color-text-muted);
  background: transparent;
  cursor: pointer;
}
.base-date-picker__clear:hover {
  color: var(--ui-color-text-heading);
  background: var(--ui-color-surface-muted);
}
.base-date-picker__clear:focus-visible {
  outline: var(--focus-outline-width) solid var(--ui-color-focus-ring);
  outline-offset: var(--focus-outline-offset);
}
.base-date-picker__message {
  min-height: var(--ui-field-message-min-height);
  color: var(--ui-color-text-muted);
  font-size: var(--font-size-xs);
  line-height: var(--line-height-heading);
  visibility: hidden;
}
.base-date-picker__message--visible {
  visibility: visible;
}
.base-date-picker--error .base-date-picker__input {
  border-color: var(--ui-color-state-error);
  background: var(--ui-control-background);
  box-shadow: none;
}
.base-date-picker--success .base-date-picker__input {
  border-color: var(--ui-color-state-success);
  background: var(--ui-color-state-success-surface);
}
.base-date-picker--error .base-date-picker__message {
  color: var(--ui-color-state-error);
}
.base-date-picker--success .base-date-picker__message {
  color: var(--ui-color-state-success);
}
.base-date-picker__arrow-up {
  transform: rotate(180deg);
}
.base-date-picker__menu {
  --dp-background-color: var(--ui-date-picker-menu-background);
  --dp-text-color: var(--ui-date-picker-menu-text);
  --dp-hover-color: var(--ui-date-picker-menu-hover-background);
  --dp-hover-text-color: var(--ui-date-picker-menu-hover-text);
  --dp-hover-icon-color: var(--ui-date-picker-menu-hover-icon);
  --dp-primary-color: var(--ui-date-picker-menu-selected-background);
  --dp-primary-text-color: var(--ui-date-picker-menu-selected-text);
  --dp-primary-disabled-color: var(--ui-date-picker-menu-selected-disabled);
  --dp-secondary-color: var(--ui-date-picker-menu-muted-text);
  --dp-border-color: var(--ui-date-picker-menu-border);
  --dp-menu-border-color: var(--ui-date-picker-menu-border);
  --dp-border-color-hover: var(--ui-date-picker-menu-hover-border);
  --dp-border-color-focus: var(--ui-date-picker-menu-focus-border);
  --dp-disabled-color: var(--ui-date-picker-menu-disabled-background);
  --dp-disabled-color-text: var(--ui-date-picker-menu-disabled-text);
  --dp-icon-color: var(--ui-date-picker-menu-icon);
  --dp-success-color: var(--ui-date-picker-menu-success);
  --dp-danger-color: var(--ui-date-picker-menu-danger);
  --dp-marker-color: var(--ui-date-picker-menu-marker);
  --dp-tooltip-color: var(--ui-date-picker-menu-tooltip-background);
  --dp-highlight-color: var(--ui-date-picker-menu-highlight);
  --dp-range-between-dates-background-color: var(
    --ui-date-picker-menu-range-background
  );
  --dp-range-between-dates-text-color: var(--ui-date-picker-menu-range-text);
  --dp-range-between-border-color: var(--ui-date-picker-menu-range-border);
  --dp-scroll-bar-background: var(--ui-date-picker-menu-scrollbar-track);
  --dp-scroll-bar-color: var(--ui-date-picker-menu-scrollbar-thumb);
  --dp-loader: var(--ui-date-picker-menu-loader);
  --dp-border-radius: var(--radius-md);
  --dp-font-family: var(--font-family-base);
  --dp-font-size: var(--font-size-sm);
  --dp-menu-min-width: 16rem;
  z-index: var(--layer-toast);
  box-shadow: var(--shadow-md);
}
.base-date-picker__menu .dp__menu {
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
}
.base-date-picker__menu .dp__today {
  border-color: var(--ui-control-focus-border);
}
</style>
