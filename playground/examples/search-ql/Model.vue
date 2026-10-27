<script setup lang="ts">
import { ref } from "vue";

import {
  BaseButton,
  BaseSearchQL,
  type BaseSearchQLChange,
  type DateRangeValue,
} from "../../../src/index";

const filters = [
  { name: "reference", label: "Referencia", regex: false },
  { name: "customer", label: "Cliente", regex: true },
];

const defaultFilters = [
  {
    name: "status",
    label: "Estado",
    options: [
      { value: "pending", label: "Pendiente" },
      { value: "delivered", label: "Entregado" },
    ],
  },
];

const selection = ref<BaseSearchQLChange[]>([]);
const dateRange = ref<DateRangeValue>(null);

function loadPreset() {
  const today = new Date();
  const oneWeekAgo = new Date(today);
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  selection.value = [
    { name: "reference", value: "NP-1042" },
    { name: "customer", value: ".*Ada.*" },
    { name: "status", value: "pending" },
  ];
  dateRange.value = [oneWeekAgo, today];
}

function clear() {
  selection.value = [];
  dateRange.value = null;
}
</script>

<template>
  <div>
    <BaseButton size="sm" @click="loadPreset">Cargar filtros</BaseButton>
    <BaseButton size="sm" variant="ghost" @click="clear">Limpiar</BaseButton>
  </div>
  <BaseSearchQL
    v-model="selection"
    size="lg"
    :filters="filters"
    :default-filters="defaultFilters"
    show-date-range
    :date-range-required="false"
    :date-value="dateRange"
    placeholder="Escribe un término y elige un campo"
    @date-change="dateRange = $event"
  />
  <pre>{{ JSON.stringify({ filters: selection, dateRange }, null, 2) }}</pre>
</template>
