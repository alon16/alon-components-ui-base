<script setup lang="ts">
import { ref } from "vue";

import { BaseRadioGroup } from "../../../src/index";

const channel = ref("email");
const groupedChannel = ref("sms");

const options = [
  { value: "email", label: "Correo electrónico" },
  { value: "sms", label: "SMS" },
  { value: "push", label: "Push no disponible", disabled: true },
];
</script>

<template>
  <BaseRadioGroup
    v-model="channel"
    name="notification-type"
    label="Canal de notificación"
    :options="options"
  />
  <BaseRadioGroup
    v-model="groupedChannel"
    name="notification-group"
    label="Canal horizontal con borde y error"
    :options="options"
    orientation="horizontal"
    bordered
    error="Selecciona un canal para continuar."
  />
</template>
