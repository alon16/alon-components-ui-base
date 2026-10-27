<script setup lang="ts">
import { ref } from "vue";

import { BaseSwitch } from "../../../src/index";

const notifications = ref(true);
const small = ref(false);
</script>

<template>
  <BaseSwitch
    id="notifications"
    v-model="notifications"
    label="Recibir notificaciones"
  />
  <BaseSwitch
    id="small-switch"
    v-model="small"
    label="Switch pequeño (sm)"
    size="sm"
  />
  <BaseSwitch
    id="disabled-switch"
    label="Switch deshabilitado"
    label-position="end"
    disabled
  />
  <BaseSwitch
    id="error-switch"
    label="Switch con error"
    error="Corrige esta opción antes de continuar."
  />
</template>
