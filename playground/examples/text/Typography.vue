<script setup lang="ts">
import { BaseHeading, BaseText } from "../../../src/index";
</script>

<template>
  <BaseHeading variant="hero">Título hero</BaseHeading>
  <BaseHeading as="h3" variant="lg" color="brand">
    Título grande de marca
  </BaseHeading>
  <BaseHeading as="h4" variant="md">Título mediano</BaseHeading>
  <BaseText variant="xl">Texto destacado de tamaño XL.</BaseText>
  <BaseText>Texto de cuerpo para contenidos habituales.</BaseText>
  <BaseText variant="sm" color="muted">Texto pequeño y secundario.</BaseText>
  <BaseText as="span" variant="label" color="brand" weight="bold">
    Etiqueta de marca
  </BaseText>
</template>
