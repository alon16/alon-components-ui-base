<script setup lang="ts">
import { BaseInput } from "../../../src/index";
</script>

<template>
  <BaseInput
    model-value="valor inválido"
    label="Campo con error"
    error="Corrige el valor antes de continuar."
    state="error"
  />
  <BaseInput
    model-value="dato@example.com"
    label="Campo válido y deshabilitado"
    success="El correo está disponible."
    state="success"
    disabled
  />
  <BaseInput model-value="Ada Lovelace" label="Modo lectura" mode="read" />
  <BaseInput label="Campo vacío en modo lectura" mode="read" />
</template>
