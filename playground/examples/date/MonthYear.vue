<script setup lang="ts">
import { ref } from "vue";

import { BaseMonthInput, BaseYearInput } from "../../../src/index";

defineProps<{ dark?: boolean }>();

const month = ref<{ month: number; year: number } | null>(null);
const year = ref<number | null>(new Date().getFullYear());
</script>

<template>
  <BaseMonthInput
    v-model="month"
    label="Mes"
    placeholder="Selecciona un mes"
    :dark="dark"
  />
  <BaseYearInput
    v-model="year"
    label="Año"
    placeholder="Selecciona un año"
    :dark="dark"
  />
</template>
