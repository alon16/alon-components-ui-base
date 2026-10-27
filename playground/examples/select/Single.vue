<script setup lang="ts">
import { ref } from "vue";

import { BaseSelect } from "../../../src/index";

const country = ref("ni");

const countries = [
  { label: "Nicaragua", value: "ni" },
  { label: "Costa Rica", value: "cr" },
  { label: "El Salvador", value: "sv" },
  { label: "Honduras", value: "hn" },
  { label: "Panamá", value: "pa" },
  { label: "Guatemala", value: "gt", disabled: true },
];
</script>

<template>
  <BaseSelect
    v-model="country"
    label="País"
    placeholder="Selecciona un país"
    :options="countries"
    info="Guatemala está deshabilitada para mostrar ese estado."
  />
</template>
