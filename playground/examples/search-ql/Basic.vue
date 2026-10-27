<script setup lang="ts">
import { ref } from "vue";

import {
  BaseSearchQL,
  type BaseSearchQLChange,
  type DateRangeValue,
} from "../../../src/index";

const filters = [
  { name: "reference", label: "Referencia", regex: false },
  { name: "customer", label: "Cliente", regex: true },
  { name: "email", label: "Correo electrónico", regex: true },
];

const defaultFilters = [
  {
    name: "status",
    label: "Estado",
    options: [
      { value: "pending", label: "Pendiente" },
      { value: "transit", label: "En tránsito" },
      { value: "delivered", label: "Entregado" },
    ],
  },
  {
    name: "type",
    label: "Tipo de envío",
    options: [
      { value: "standard", label: "Estándar" },
      { value: "express", label: "Exprés" },
    ],
  },
];

const today = new Date();
const oneWeekAgo = new Date(today);
oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

const selection = ref<BaseSearchQLChange[]>([]);
const dateRange = ref<DateRangeValue>([oneWeekAgo, today]);
</script>

<template>
  <BaseSearchQL
    size="sm"
    :filters="filters"
    :default-filters="defaultFilters"
    show-date-range
    date-range-required
    :date-value="dateRange"
    placeholder="Escribe un término y elige un campo"
    @change="selection = $event"
    @date-change="dateRange = $event"
  />
  <pre>{{ JSON.stringify(selection, null, 2) }}</pre>
</template>
