<script setup lang="ts">
import { computed, ref, useId } from "vue";

defineOptions({ inheritAttrs: false });

const props = defineProps({
  id: { type: String, default: "" },
  label: { type: String, default: "" },
  state: {
    type: String,
    default: "default",
    validator: (value) => ["default", "error", "success"].includes(value),
  },
  help: { type: String, default: "" },
  error: { type: String, default: "" },
  success: { type: String, default: "" },
  rows: { type: Number, default: 4 },
  maxLength: { type: Number, default: null },
  maxLengthVisible: { type: Boolean, default: false },
  required: Boolean,
  disabled: Boolean,
});

const emit = defineEmits(["blur"]);
const generatedId = useId();
const textareaId = computed(() => props.id || `textarea-${generatedId}`);
const currentState = computed(() => {
  if (props.error || props.state === "error") return "error";
  if (props.success || props.state === "success") return "success";
  return "default";
});
const message = computed(() => props.error || props.success || props.help);
const messageId = computed(() => `${textareaId.value}-message`);
const textarea = defineModel({ type: String, default: "" });
const textareaElement = ref(null);
const characterCountId = computed(() => `${textareaId.value}-character-count`);
const hasMaxLength = computed(
  () => Number.isInteger(props.maxLength) && props.maxLength >= 0,
);
const showCharacterCount = computed(
  () => props.maxLengthVisible && hasMaxLength.value,
);
const characterCount = computed(() => String(textarea.value ?? "").length);
const describedBy = computed(
  () =>
    [
      message.value ? messageId.value : "",
      showCharacterCount.value ? characterCountId.value : "",
    ]
      .filter(Boolean)
      .join(" ") || undefined,
);

defineExpose({ focus: () => textareaElement.value?.focus() });
</script>

<template>
  <div class="base-textarea" :class="`base-textarea--${currentState}`">
    <label v-if="label" class="base-textarea__label" :for="textareaId">
      {{ label }}<span v-if="required" aria-hidden="true"> *</span>
    </label>
    <textarea
      :id="textareaId"
      ref="textareaElement"
      v-bind="$attrs"
      v-model="textarea"
      class="base-textarea__input"
      :rows="rows"
      :maxlength="hasMaxLength ? maxLength : undefined"
      :required="required"
      :disabled="disabled"
      :aria-invalid="currentState === 'error' ? 'true' : undefined"
      :aria-describedby="describedBy"
      @blur="emit('blur', $event)"
    ></textarea>
    <span
      :id="messageId"
      class="base-textarea__message"
      :class="{ 'base-textarea__message--visible': message }"
      :aria-hidden="message ? undefined : 'true'"
      :role="currentState === 'error' ? 'alert' : undefined"
    >
      {{ message }}
    </span>
    <span
      v-if="showCharacterCount"
      :id="characterCountId"
      class="base-textarea__character-count"
      aria-live="polite"
    >
      {{ characterCount }} / {{ maxLength }}
    </span>
  </div>
</template>

<style scoped>
.base-textarea {
  display: grid;
  min-width: var(--space-0);
  gap: var(--bs-field-gap, var(--space-2));
}

.base-textarea__label {
  color: var(--bs-form-label-color);
  font-size: var(--bs-form-label-size);
  font-weight: var(--text-label-weight);
  line-height: var(--text-label-leading);
}

.base-textarea__input {
  width: 100%;
  min-width: var(--space-0);
  padding: var(--space-3) var(--space-4);
  resize: vertical;
  border: var(--border-width-thin) solid var(--bs-control-border);
  border-radius: var(--radius-md);
  color: var(--bs-form-value-color);
  background: var(--bs-control-background);
  font: inherit;
  font-size: var(--font-size-sm);
  transition:
    border-color var(--transition-fast),
    box-shadow var(--transition-fast),
    background-color var(--transition-fast);
}

.base-textarea__input::placeholder {
  color: var(--bs-color-text-muted);
}

.base-textarea__input:hover:not(:disabled) {
  border-color: var(--bs-control-hover-border);
}

.base-textarea__input:focus {
  border-color: var(--bs-control-focus-border);
  outline: none;
  background: var(--bs-control-focus-background);
  box-shadow: 0 0 0 var(--space-1) var(--bs-control-focus-shadow);
}

.base-textarea__input:disabled {
  cursor: not-allowed;
  background: var(--bs-control-disabled-background);
  border-color: var(--bs-control-disabled-border);
}

.base-textarea--error .base-textarea__input {
  border-color: var(--bs-color-state-error);
  background: var(--bs-color-state-error-surface);
}

.base-textarea--success .base-textarea__input {
  border-color: var(--bs-color-state-success);
  background: var(--bs-color-state-success-surface);
}

.base-textarea__message {
  min-height: var(--bs-field-message-min-height);
  color: var(--bs-color-text-muted);
  font-size: var(--font-size-xs);
  line-height: var(--line-height-heading);
  visibility: hidden;
}

.base-textarea__message--visible {
  visibility: visible;
}

.base-textarea__character-count {
  justify-self: end;
  color: var(--bs-color-text-muted);
  font-size: var(--font-size-xs);
  line-height: var(--line-height-heading);
}

.base-textarea--error .base-textarea__message {
  color: var(--bs-color-state-error);
}

.base-textarea--success .base-textarea__message {
  color: var(--bs-color-state-success);
}
</style>
