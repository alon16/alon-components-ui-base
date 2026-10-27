<script setup lang="ts">
import { ref } from "vue";

import { BaseSignature } from "../../../src/index";

const signature = ref<string | null>(null);
</script>

<template>
  <BaseSignature
    v-model="signature"
    label="Firma del remitente"
    help="Dibuja dentro del área usando ratón, lápiz o pantalla táctil."
    clear-aria-label="Borrar la firma"
    drawing-instructions="Área para dibujar una firma"
    :height="180"
  />
</template>
