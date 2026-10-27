<script setup lang="ts">
import { onUnmounted, ref } from "vue";

import { BaseButton } from "../../../src/index";

const saving = ref(false);
let timer: ReturnType<typeof setTimeout> | undefined;

function save() {
  saving.value = true;
  timer = setTimeout(() => (saving.value = false), 1500);
}

onUnmounted(() => clearTimeout(timer));
</script>

<template>
  <BaseButton :loading="saving" @click="save">
    {{ saving ? "Guardando" : "Guardar (simula carga)" }}
  </BaseButton>
  <BaseButton loading>Cargando</BaseButton>
  <BaseButton disabled>Deshabilitado</BaseButton>
</template>
