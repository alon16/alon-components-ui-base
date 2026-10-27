<script setup lang="ts">
import { BaseBadge } from "../../../src/index";
</script>

<template>
  <BaseBadge tone="success" size="md">Tamaño mediano</BaseBadge>
  <BaseBadge tone="info" width="fixed">Ancho fijo</BaseBadge>
  <BaseBadge label="Ancho automático" tone="neutral" width="auto" />
</template>
