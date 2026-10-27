<script setup lang="ts">
import { ref } from "vue";

import { BaseAutocomplete } from "../../../src/index";

const city = ref<unknown>(null);

const cities = [
  { label: "Managua", value: "managua" },
  { label: "León", value: "leon" },
  { label: "Granada", value: "granada" },
  { label: "Masaya", value: "masaya" },
];
</script>

<template>
  <BaseAutocomplete
    v-model="city"
    label="Ciudad"
    placeholder="Busca una ciudad"
    :options="cities"
    allow-create
    no-results-text="No encontramos coincidencias."
  />
  <BaseAutocomplete
    label="Autocompletado con error"
    placeholder="Busca una ciudad"
    :options="cities"
    error="Selecciona una ciudad válida."
    state="error"
  />
</template>
