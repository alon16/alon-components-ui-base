<script setup lang="ts">
import { BaseLink } from "../../../src/index";
</script>

<template>
  <BaseLink href="#base-input">Ir a formularios</BaseLink>
  <BaseLink href="#base-icon" variant="body" underline="always">
    Ver iconos
  </BaseLink>
  <BaseLink href="https://example.com" target="_blank" variant="muted">
    Abrir enlace externo
  </BaseLink>
</template>
