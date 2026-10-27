<script setup lang="ts">
import { ref } from "vue";

import { BaseText, BaseTabs } from "../../../src/index";

const activeTab = ref("overview");

const tabs = [
  { label: "Resumen", value: "overview" },
  { label: "Actividad", value: "activity" },
  { label: "Deshabilitada", value: "disabled", disabled: true },
];
</script>

<template>
  <BaseTabs v-model="activeTab" :tabs="tabs" aria-label="Detalle del envío" />
  <div
    :id="`${activeTab}-panel`"
    role="tabpanel"
    :aria-labelledby="`${activeTab}-tab`"
  >
    <BaseText v-if="activeTab === 'overview'"
      >Contenido del panel Resumen.</BaseText
    >
    <BaseText v-else>Contenido del panel Actividad.</BaseText>
  </div>
</template>
