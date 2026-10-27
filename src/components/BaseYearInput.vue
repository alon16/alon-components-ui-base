<script setup lang="ts">
import { computed } from "vue";
import BaseDatePicker from "./BaseDatePicker.vue";

const props = defineProps({
  modelValue: { type: Number, default: null },
  id: String,
  name: String,
  label: String,
  placeholder: String,
  clearAriaLabel: String,
  ariaLabels: Object,
  actionRow: Object,
  dayNames: [Array, Function],
  weekNumbers: [Boolean, Object],
  dark: Boolean,
  info: String,
  infoAriaLabel: String,
  infoType: String,
  size: String,
  state: String,
  help: String,
  error: String,
  success: String,
  required: Boolean,
  disabled: Boolean,
  readonly: Boolean,
  clearable: { type: Boolean, default: true },
  autoApply: { type: Boolean, default: true },
  locale: { type: [String, Object], default: undefined },
  formats: { type: Object, default: null },
  teleport: { type: [Boolean, String, Object], default: false },
  minDate: { type: [Date, String, Number], default: undefined },
  maxDate: { type: [Date, String, Number], default: undefined },
  filters: { type: Object, default: undefined },
  tone: String,
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
const pickerProps = computed(() => ({
  autoApply: props.autoApply,
  locale: props.locale,
  formats: props.formats,
  teleport: props.teleport,
  minDate: props.minDate,
  maxDate: props.maxDate,
  filters: props.filters,
  yearPicker: true,
}));
</script>
<template>
  <BaseDatePicker
    v-bind="props"
    input-icon="calendar"
    :picker-props="pickerProps"
    @update:model-value="emit('update:modelValue', $event)"
    @focus="emit('focus')"
    @blur="emit('blur')"
    @open="emit('open')"
    @close="emit('close')"
    @clear="emit('clear')"
    @invalid="emit('invalid')"
  />
</template>
