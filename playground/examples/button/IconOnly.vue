<script setup lang="ts">
import { BaseButton, BaseIcon } from "../../../src/index";
</script>

<template>
  <BaseButton
    size="icon"
    variant="ghost"
    aria-label="Ver devolución DEV-2048"
    title="Ver devolución"
  >
    <BaseIcon name="eye" size="sm" decorative />
  </BaseButton>
  <BaseButton
    size="icon"
    variant="ghost"
    aria-label="Configurar tienda Managua"
    title="Configurar tienda"
  >
    <BaseIcon name="settings" size="sm" decorative />
  </BaseButton>
  <BaseButton
    size="icon"
    variant="danger"
    aria-label="Eliminar webhook de pedidos creados"
    title="Eliminar webhook"
  >
    <BaseIcon name="trash" size="sm" decorative />
  </BaseButton>
</template>
