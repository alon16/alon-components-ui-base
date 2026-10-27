<script setup lang="ts">
import { ref } from "vue";

import { BaseStepper, BaseText } from "../../../src/index";

const currentStep = ref("details");

const steps = [
  { value: "details", label: "Datos", description: "Información principal" },
  { value: "shipping", label: "Envío", description: "Método de entrega" },
  { value: "review", label: "Revisión", description: "Confirma los datos" },
  {
    value: "done",
    label: "Final",
    description: "No disponible",
    disabled: true,
  },
];

const variants = ["circles", "bars", "pills"] as const;
</script>

<template>
  <template v-for="variant in variants" :key="variant">
    <BaseText variant="label" color="muted">variant="{{ variant }}"</BaseText>
    <BaseStepper
      v-model="currentStep"
      :steps="steps"
      :variant="variant"
      navigable
      show-step-descriptions
      :aria-label="`Progreso del envío (${variant})`"
    />
  </template>
</template>
