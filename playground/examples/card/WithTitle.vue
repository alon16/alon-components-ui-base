<script setup lang="ts">
import { BaseCard, BaseText } from "../../../src/index";
</script>

<template>
  <BaseCard
    title="Datos del remitente"
    title-icon="location"
    title-position="inside"
    padding="comfortable"
    outlined
  >
    <BaseText color="muted">Título interno con icono.</BaseText>
  </BaseCard>
  <BaseCard
    title="Conexión con Shopify"
    title-icon="location"
    title-position="outside"
    padding="comfortable"
    outlined
  >
    <BaseText color="muted">Título externo sobre la tarjeta.</BaseText>
  </BaseCard>
</template>
