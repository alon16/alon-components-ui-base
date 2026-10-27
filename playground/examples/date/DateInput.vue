<script setup lang="ts">
import { ref } from "vue";

import { BaseDateInput } from "../../../src/index";

defineProps<{ dark?: boolean }>();

const date = ref<Date | null>(new Date());
</script>

<template>
  <BaseDateInput
    v-model="date"
    label="Fecha"
    placeholder="Selecciona una fecha"
    help="Selector sin hora."
    :dark="dark"
  />
  <BaseDateInput
    label="Fecha deshabilitada"
    placeholder="No editable"
    :dark="dark"
    disabled
  />
</template>
