<script setup lang="ts">
import { ref } from "vue";

import { BaseTextarea } from "../../../src/index";

const notes = ref("Los componentes pueden probarse sin publicar el paquete.");
</script>

<template>
  <BaseTextarea
    v-model="notes"
    label="Notas"
    :rows="4"
    :max-length="160"
    max-length-visible
  />
</template>
