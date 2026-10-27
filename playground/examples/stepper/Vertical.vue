<script setup lang="ts">
import { ref } from "vue";

import { BaseStepper } from "../../../src/index";

const currentStep = ref("shipping");

const steps = [
  { value: "details", label: "Datos", description: "Información principal" },
  { value: "shipping", label: "Envío", description: "Método de entrega" },
  { value: "review", label: "Revisión", description: "Confirma los datos" },
];
</script>

<template>
  <BaseStepper
    v-model="currentStep"
    :steps="steps"
    variant="vertical"
    navigable
    description="Flujo de ejemplo con descripción inferior."
    description-position="bottom"
  />
</template>
