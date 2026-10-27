<script setup lang="ts">
import { BaseCard, BaseHeading, BaseText } from "../../../src/index";
</script>

<template>
  <BaseCard padding="comfortable" elevation="sm" outlined>
    <BaseHeading as="h4" variant="md">Tarjeta de página</BaseHeading>
    <BaseText>Superficie predeterminada, borde y elevación suave.</BaseText>
  </BaseCard>
  <BaseCard surface="primary" padding="comfortable" radius="lg">
    <BaseHeading as="h4" variant="md">Superficie primaria</BaseHeading>
    <BaseText color="heading">Útil para destacar contenido relevante.</BaseText>
  </BaseCard>
  <BaseCard surface="inverse" padding="compact" elevation="md">
    <BaseHeading as="h4" variant="sm" color="inverse">
      Tarjeta inversa
    </BaseHeading>
    <BaseText color="inverse-muted">Contraste para fondos destacados.</BaseText>
  </BaseCard>
</template>
