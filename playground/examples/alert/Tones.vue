<script setup lang="ts">
import { BaseAlert, BaseIcon } from "../../../src/index";
</script>

<template>
  <BaseAlert
    tone="warning"
    title="Revisa los datos"
    description="Hay campos pendientes de completar."
    icon="alertTriangle"
  />
  <BaseAlert
    tone="primary"
    title="Nuevo envío disponible"
    description="Puedes consultar el seguimiento desde tu cuenta."
  />
  <BaseAlert
    tone="secondary"
    description="Este aviso usa el tono secundario."
  />
  <BaseAlert tone="info" description="Aviso informativo con icono por slot.">
    <template #icon>
      <BaseIcon name="info" size="md" decorative />
    </template>
  </BaseAlert>
</template>
