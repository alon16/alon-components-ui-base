<script setup lang="ts">
import { ref } from "vue";

import { BaseButton, BaseToast } from "../../../src/index";

type ToastTone = "success" | "info" | "warning" | "danger";

const messages: Record<ToastTone, { title: string; description: string }> = {
  success: {
    title: "Cambios guardados",
    description: "Tu información se actualizó correctamente.",
  },
  info: {
    title: "Nuevo envío disponible",
    description: "Puedes consultar el seguimiento desde tu cuenta.",
  },
  warning: {
    title: "Revisa los datos",
    description: "Hay campos pendientes de completar.",
  },
  danger: {
    title: "No se pudo guardar",
    description: "Comprueba tu conexión e inténtalo de nuevo.",
  },
};

const open = ref(false);
const tone = ref<ToastTone>("success");

function showToast(nextTone: ToastTone) {
  tone.value = nextTone;
  open.value = true;
}
</script>

<template>
  <BaseButton @click="showToast('success')">Éxito</BaseButton>
  <BaseButton variant="outline" @click="showToast('info')">
    Información
  </BaseButton>
  <BaseButton variant="outline" @click="showToast('warning')">
    Advertencia
  </BaseButton>
  <BaseButton variant="danger" @click="showToast('danger')">Error</BaseButton>

  <BaseToast
    v-model:open="open"
    :tone="tone"
    :title="messages[tone].title"
    :description="messages[tone].description"
    position="top-right"
  />
</template>
