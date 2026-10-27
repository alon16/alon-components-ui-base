<script setup lang="ts">
import { ref } from "vue";

import { BaseInput } from "../../../src/index";

const password = ref("secreto");
</script>

<template>
  <BaseInput
    v-model="password"
    label="Contraseña"
    type="password"
    size="sm"
    show-password-aria-label="Mostrar contraseña"
    hide-password-aria-label="Ocultar contraseña"
  />
</template>
