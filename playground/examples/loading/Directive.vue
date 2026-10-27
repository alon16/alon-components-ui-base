<script setup lang="ts">
import { ref } from "vue";

import {
  BaseCard,
  BaseSwitch,
  BaseText,
  loading as vLoading,
} from "../../../src/index";

const isLoading = ref(false);
</script>

<template>
  <BaseSwitch id="loading-example" v-model="isLoading" label="Mostrar carga" />
  <section v-loading="isLoading" aria-label="Resumen del pedido">
    <BaseCard elevation="none" surface="page" outlined>
      <BaseText variant="label" color="heading" weight="bold">
        Resumen del pedido
      </BaseText>
      <BaseText>Pedido NP-1042 · Envío estándar</BaseText>
    </BaseCard>
  </section>
</template>
