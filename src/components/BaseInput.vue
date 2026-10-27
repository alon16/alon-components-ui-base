<script setup lang="ts">
import { computed, ref, useId, useSlots } from "vue";
import BaseFieldInfo from "./BaseFieldInfo.vue";
import BaseIcon from "./BaseIcon.vue";
import BaseText from "./BaseText.vue";

defineOptions({ inheritAttrs: false });

const props = defineProps({
  id: {
    type: String,
    default: "",
  },
  label: {
    type: String,
    default: "",
  },
  info: {
    type: String,
    default: "",
  },
  infoAriaLabel: { type: String, default: "Información adicional" },
  infoType: {
    type: String,
    default: "",
    validator: (value) =>
      ["", "primary", "secondary", "success", "danger"].includes(value),
  },
  type: {
    type: String,
    default: "text",
  },
  mode: {
    type: String,
    default: "edit",
    validator: (value) => ["edit", "read"].includes(value),
  },
  size: {
    type: String,
    default: "sm",
    validator: (value) => ["sm", "md", "lg"].includes(value),
  },
  state: {
    type: String,
    default: "default",
    validator: (value) => ["default", "error", "success"].includes(value),
  },
  help: {
    type: String,
    default: "",
  },
  error: {
    type: String,
    default: "",
  },
  success: {
    type: String,
    default: "",
  },
  suffix: {
    type: String,
    default: "",
  },
  maxLength: {
    type: Number,
    default: null,
  },
  maxLengthVisible: {
    type: Boolean,
    default: false,
  },
  required: Boolean,
  disabled: Boolean,
  showPasswordAriaLabel: { type: String, default: "Mostrar contraseña" },
  hidePasswordAriaLabel: { type: String, default: "Ocultar contraseña" },
  tone: {
    type: String,
    default: "default",
    validator: (value) => ["default", "inverse"].includes(value),
  },
});

const emit = defineEmits(["blur"]);
const slots = useSlots();
const generatedId = useId();
const inputId = computed(() => props.id || `input-${generatedId}`);
const currentState = computed(() => {
  if (props.error || props.state === "error") return "error";
  if (props.success || props.state === "success") return "success";
  return "default";
});
const message = computed(() => props.error || props.success || props.help);
const messageId = computed(() => `${inputId.value}-message`);
const characterCountId = computed(() => `${inputId.value}-character-count`);
const input = defineModel({ type: [String, Number], default: "" });
const inputElement = ref(null);
const passwordVisible = ref(false);
const hasInfo = computed(() => Boolean(props.info.trim()));
const hasLeading = computed(() => Boolean(slots.leading));
const isPassword = computed(() => props.type === "password");
const inputType = computed(() =>
  isPassword.value && passwordVisible.value ? "text" : props.type,
);
const hasMaxLength = computed(
  () => Number.isInteger(props.maxLength) && props.maxLength >= 0,
);
const showCharacterCount = computed(
  () => props.maxLengthVisible && hasMaxLength.value,
);
const characterCount = computed(() => String(input.value ?? "").length);
const readonlyValue = computed(() =>
  input.value === "" || input.value === null || input.value === undefined
    ? "—"
    : input.value,
);
const describedBy = computed(
  () =>
    [
      message.value ? messageId.value : "",
      showCharacterCount.value ? characterCountId.value : "",
    ]
      .filter(Boolean)
      .join(" ") || undefined,
);

defineExpose({
  focus: () => inputElement.value?.focus(),
});
</script>

<template>
  <div
    class="base-field"
    :class="[
      `base-field--${currentState}`,
      `base-field--${tone}`,
      { 'base-field--read': mode === 'read' },
    ]"
  >
    <div v-if="label" class="base-field__label-row">
      <label
        class="base-field__label"
        :for="mode === 'edit' ? inputId : undefined"
      >
        {{ label }}<span v-if="required" aria-hidden="true"> *</span>
      </label>
      <BaseFieldInfo
        v-if="hasInfo"
        :text="info"
        :type="infoType"
        :aria-label="infoAriaLabel"
      />
    </div>
    <div
      class="base-field__control"
      :class="{
        'base-field__control--leading': hasLeading,
        'base-field__control--password': isPassword,
      }"
    >
      <span v-if="hasLeading" class="base-field__leading" aria-hidden="true">
        <slot name="leading" />
      </span>
      <input
        v-if="mode === 'edit'"
        :id="inputId"
        ref="inputElement"
        v-bind="$attrs"
        v-model="input"
        class="base-field__input"
        :class="`base-field__input--${size}`"
        :type="inputType"
        :maxlength="hasMaxLength ? maxLength : undefined"
        :required="required"
        :disabled="disabled"
        :aria-invalid="currentState === 'error' ? 'true' : undefined"
        :aria-describedby="describedBy"
        @blur="emit('blur', $event)"
      />
      <BaseText
        v-else
        as="span"
        class="base-field__readonly-value"
        :variant="size === 'sm' ? 'sm' : size === 'lg' ? 'xl' : 'md'"
        :aria-describedby="describedBy"
      >
        {{ readonlyValue }}
      </BaseText>
      <button
        v-if="mode === 'edit' && isPassword"
        class="base-field__password-toggle"
        type="button"
        :disabled="disabled"
        :aria-label="
          passwordVisible ? hidePasswordAriaLabel : showPasswordAriaLabel
        "
        :aria-pressed="passwordVisible"
        @click="passwordVisible = !passwordVisible"
      >
        <BaseIcon
          :name="passwordVisible ? 'eyeOff' : 'eye'"
          size="sm"
          decorative
        />
      </button>
      <span v-if="suffix" class="base-field__suffix" aria-hidden="true">{{
        suffix
      }}</span>
    </div>
    <span
      :id="messageId"
      class="base-field__message"
      :class="{ 'base-field__message--visible': message }"
      :aria-hidden="message ? undefined : 'true'"
      :role="currentState === 'error' ? 'alert' : undefined"
    >
      {{ message }}
    </span>
    <span
      v-if="showCharacterCount"
      :id="characterCountId"
      class="base-field__character-count"
      aria-live="polite"
    >
      {{ characterCount }} / {{ maxLength }}
    </span>
  </div>
</template>

<style scoped>
.base-field {
  display: grid;
  min-width: var(--space-0);
  gap: var(--ui-field-gap, var(--base-field-gap, var(--space-2)));
}

.base-field--read {
  gap: var(--space-0);
}

.base-field__label {
  color: var(--ui-form-label-color);
  font-size: var(--ui-form-label-size);
  font-weight: var(--text-label-weight);
  line-height: var(--text-label-leading);
}

.base-field__label-row {
  display: flex;
  width: 100%;
  min-width: 0;
  align-items: center;
  gap: var(--space-1);
  flex-wrap: wrap;
}

.base-field--inverse .base-field__label {
  color: var(--ui-color-text-inverse-muted);
}

.base-field__control {
  position: relative;
}

.base-field__leading {
  position: absolute;
  z-index: 1;
  top: 50%;
  left: var(--space-3);
  display: inline-flex;
  color: var(--ui-color-text-muted);
  transform: translateY(-50%);
  pointer-events: none;
}

.base-field__control--leading .base-field__input {
  padding-left: var(--space-10);
}

.base-field__control--password .base-field__input {
  padding-right: var(--control-height-sm);
}

.base-field__input {
  width: 100%;
  min-width: var(--space-0);
  box-sizing: border-box;
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

.base-field__readonly-value {
  display: block;
  min-height: var(--control-height-sm);
  padding: var(--space-0);
  overflow-wrap: anywhere;
  color: var(--ui-form-value-color);
}

.base-field__readonly-value.base-text--md {
  min-height: var(--control-height-md);
}

.base-field__readonly-value.base-text--xl {
  min-height: var(--control-height-lg);
}

.base-field__input::placeholder {
  color: var(--ui-color-text-muted);
}

.base-field__input:hover:not(:disabled):not(:focus) {
  border-color: var(--ui-control-hover-border);
}

.base-field__input:focus {
  border-color: var(--ui-control-focus-border);
  outline: none;
  background: var(--ui-control-focus-background);
  box-shadow: 0 0 0 var(--space-1) var(--ui-control-focus-shadow);
}

.base-field__input:disabled {
  cursor: not-allowed;
  background: var(--ui-control-disabled-background);
  border-color: var(--ui-control-disabled-border);
}

.base-field__input--sm {
  height: var(--control-height-sm);
  padding-inline: var(--space-3);
  font-size: var(--font-size-xs);
}

.base-field__input--md {
  height: var(--control-height-md);
  padding-inline: var(--space-4);
  font-size: var(--font-size-sm);
}

.base-field__input--lg {
  height: var(--control-height-lg);
  padding-inline: var(--space-4);
  font-size: var(--font-size-md);
}

.base-field__suffix {
  position: absolute;
  top: 50%;
  right: var(--space-3);
  color: var(--ui-color-text-muted);
  font-size: var(--font-size-xs);
  transform: translateY(-50%);
  pointer-events: none;
}

.base-field__password-toggle {
  position: absolute;
  top: 50%;
  right: var(--space-2);
  display: inline-flex;
  width: 32px;
  height: 32px;
  align-items: center;
  justify-content: center;
  padding: var(--space-0);
  border: var(--space-0);
  border-radius: var(--radius-sm);
  color: var(--ui-color-text-muted);
  background: transparent;
  cursor: pointer;
  transform: translateY(-50%);
  transition:
    color var(--transition-fast),
    background-color var(--transition-fast);
}

.base-field__password-toggle:hover:not(:disabled) {
  color: var(--ui-color-text-heading);
  background: var(--ui-color-surface-muted);
}

.base-field__password-toggle:focus-visible {
  outline: var(--focus-outline-width) solid var(--ui-color-focus-ring);
  outline-offset: var(--focus-outline-offset);
}

.base-field__password-toggle:disabled {
  cursor: not-allowed;
  opacity: var(--opacity-disabled);
}

.base-field:has(.base-field__suffix) .base-field__input {
  padding-right: var(--space-10);
}

.base-field:has(.base-field__suffix) .base-field__input[type="number"] {
  appearance: textfield;
}

.base-field:has(.base-field__suffix)
  .base-field__input[type="number"]::-webkit-inner-spin-button,
.base-field:has(.base-field__suffix)
  .base-field__input[type="number"]::-webkit-outer-spin-button {
  margin: var(--space-0);
  appearance: none;
}

.base-field--error .base-field__input {
  border-color: var(--ui-color-state-error);
  background: var(--ui-control-background);
  box-shadow: none;
}

.base-field--success .base-field__input {
  border-color: var(--ui-color-state-success);
  background: var(--ui-color-state-success-surface);
}

.base-field__message {
  margin-top: calc(var(--space-2) * -0.5);
  min-height: var(
    --ui-field-message-min-height,
    var(
      --base-field-message-min-height,
      calc(var(--font-size-xs) * var(--line-height-heading))
    )
  );
  color: var(--ui-color-text-muted);
  font-size: var(--font-size-xs);
  line-height: var(--line-height-heading);
  visibility: hidden;
}

.base-field__message--visible {
  visibility: visible;
}

.base-field__character-count {
  justify-self: end;
  color: var(--ui-color-text-muted);
  font-size: var(--font-size-xs);
  line-height: var(--line-height-heading);
}

.base-field--error .base-field__message {
  color: var(--ui-color-state-error);
}

.base-field--success .base-field__message {
  color: var(--ui-color-state-success);
}
</style>
