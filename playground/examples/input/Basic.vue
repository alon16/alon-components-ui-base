<script setup lang="ts">
import { ref } from "vue";

import { BaseInput } from "../../../src/index";

const name = ref("Ada Lovelace");
</script>

<template>
  <BaseInput
    v-model="name"
    label="Nombre completo"
    placeholder="Escribe un nombre"
    help="Este campo muestra texto de ayuda."
    info="Usa el nombre legal de la persona."
    required
  />
</template>
