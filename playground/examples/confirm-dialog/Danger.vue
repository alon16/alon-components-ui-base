<script setup lang="ts">
import { ref } from "vue";

import { BaseButton, BaseConfirmDialog, BaseText } from "../../../src/index";

const open = ref(false);
const result = ref("");

function confirm() {
  open.value = false;
  result.value = "Elemento eliminado.";
}
</script>

<template>
  <BaseButton variant="danger" @click="open = true">
    Eliminar elemento
  </BaseButton>
  <BaseText variant="sm" color="muted" aria-live="polite">{{
    result
  }}</BaseText>

  <BaseConfirmDialog
    :open="open"
    title="Eliminar elemento"
    description="Esta acción no se puede deshacer."
    confirm-label="Sí, eliminar"
    cancel-label="Conservar"
    button-size="md"
    tone="danger"
    @close="open = false"
    @confirm="confirm"
  />
</template>
