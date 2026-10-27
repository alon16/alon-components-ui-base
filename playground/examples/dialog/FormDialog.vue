<script setup lang="ts">
import { ref } from "vue";

import { BaseButton, BaseDialog, BaseInput } from "../../../src/index";

const open = ref(false);
const email = ref("");
</script>

<template>
  <BaseButton @click="open = true">Abrir diálogo</BaseButton>

  <BaseDialog
    :open="open"
    title="Editar perfil"
    description="Ejemplo de diálogo con formulario y acciones personalizadas."
    form
    @close="open = false"
    @submit="open = false"
  >
    <BaseInput
      v-model="email"
      label="Correo electrónico"
      type="email"
      required
    />
    <template #actions>
      <BaseButton variant="outline" @click="open = false">Cancelar</BaseButton>
      <BaseButton type="submit">Guardar</BaseButton>
    </template>
  </BaseDialog>
</template>
