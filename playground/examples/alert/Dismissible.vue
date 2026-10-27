<script setup lang="ts">
import { ref } from "vue";

import { BaseAlert, BaseButton, BaseText } from "../../../src/index";

const visible = ref(true);
</script>

<template>
  <BaseAlert
    v-if="visible"
    tone="danger"
    title="No se pudo guardar"
    description="Comprueba tu conexión e inténtalo de nuevo."
    icon="circleX"
    dismissible
    @dismiss="visible = false"
  >
    <BaseText as="span" variant="sm">El borrador sigue disponible.</BaseText>
  </BaseAlert>
  <BaseButton v-else variant="outline" @click="visible = true">
    Mostrar el aviso de nuevo
  </BaseButton>
</template>
