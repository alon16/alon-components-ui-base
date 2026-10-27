<script setup lang="ts">
import { BaseBreadcrumb } from "../../../src/index";

const items = [
  { name: "Inicio", to: { name: "home" } },
  { name: "Configuración", to: { path: "/settings" } },
  { name: "Direcciones", to: { name: "address-book", query: { page: 1 } } },
  { name: "Editar dirección" },
];
</script>

<template>
  <BaseBreadcrumb :value="items" divider="/" size="md" weight="semibold" />
</template>
