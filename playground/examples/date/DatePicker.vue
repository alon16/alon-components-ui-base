<script setup lang="ts">
import { ref } from "vue";

import { BaseDatePicker } from "../../../src/index";

defineProps<{ dark?: boolean }>();

const date = ref<Date | null>(null);
</script>

<template>
  <BaseDatePicker
    v-model="date"
    label="BaseDatePicker"
    placeholder="Wrapper de bajo nivel"
    :picker-props="{ autoApply: true }"
    info="Permite pasar configuración compatible mediante pickerProps."
    :dark="dark"
  />
</template>
