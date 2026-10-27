<script setup lang="ts">
import { computed } from "vue";
import BaseDatePicker from "./BaseDatePicker.vue";

const props = defineProps({
  modelValue: { type: [Date, String, Number], default: null },
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
  clearable: { type: Boolean, default: false },
  autoApply: { type: Boolean, default: true },
  locale: { type: [String, Object], default: undefined },
  formats: { type: Object, default: null },
  modelType: { type: String, default: undefined },
  teleport: { type: [Boolean, String, Object], default: false },
  minDate: { type: [Date, String, Number], default: undefined },
  maxDate: { type: [Date, String, Number], default: undefined },
  disabledDates: { type: [Array, Function], default: undefined },
  allowedDates: { type: Array, default: undefined },
  preventMinMaxNavigation: Boolean,
  filters: { type: Object, default: undefined },
  pickerProps: { type: Object, default: () => ({}) },
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
  ...props.pickerProps,
  autoApply: props.autoApply,
  locale: props.locale,
  formats: props.formats,
  modelType: props.modelType,
  teleport: props.teleport,
  minDate: props.minDate,
  maxDate: props.maxDate,
  disabledDates: props.disabledDates,
  allowedDates: props.allowedDates,
  preventMinMaxNavigation: props.preventMinMaxNavigation,
  filters: props.filters,
  timeConfig: {
    ...props.pickerProps.timeConfig,
    enableTimePicker: false,
  },
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
