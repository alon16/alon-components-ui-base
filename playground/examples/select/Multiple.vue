<script setup lang="ts">
import { ref } from "vue";

import { BaseSelect } from "../../../src/index";

const favorites = ref<string[]>(["ni", "cr", "sv", "hn", "pa"]);
const existingOnly = ref<string[]>(["ni", "cr"]);

const countries = [
  { label: "Nicaragua", value: "ni" },
  { label: "Costa Rica", value: "cr" },
  { label: "El Salvador", value: "sv" },
  { label: "Honduras", value: "hn" },
  { label: "Panamá", value: "pa" },
  { label: "México", value: "mx" },
  { label: "Colombia", value: "co" },
];
</script>

<template>
  <BaseSelect
    v-model="favorites"
    label="Países favoritos"
    placeholder="Selecciona o crea países"
    :options="countries"
    multiple
    allow-create
  />
  <BaseSelect
    v-model="existingOnly"
    label="Selección múltiple sin creación"
    placeholder="Selecciona países existentes"
    :options="countries"
    multiple
    :allow-create="false"
  />
</template>
