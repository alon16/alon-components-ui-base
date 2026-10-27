<script setup lang="ts">
import { ref } from "vue";

import { BaseDateTimeInput } from "../../../src/index";

defineProps<{ dark?: boolean }>();

const dateTime = ref<Date | null>(new Date());
</script>

<template>
  <BaseDateTimeInput
    v-model="dateTime"
    label="Fecha y hora"
    placeholder="Selecciona fecha y hora"
    :dark="dark"
  />
</template>
