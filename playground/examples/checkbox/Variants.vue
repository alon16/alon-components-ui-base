<script setup lang="ts">
import { ref } from "vue";

import { BaseCheckbox } from "../../../src/index";

const accepted = ref(true);
const partial = ref(false);
const policy = ref(false);
</script>

<template>
  <BaseCheckbox v-model="accepted" label="Acepto los términos" type="primary" />
  <BaseCheckbox v-model="policy" type="primary">
    <template #label>
      Acepto las <a href="#base-checkbox">condiciones de devolución</a>
    </template>
  </BaseCheckbox>
  <BaseCheckbox
    v-model="partial"
    label="Selección parcial"
    type="secondary"
    indeterminate
  />
  <BaseCheckbox
    label="Opción con error"
    label-position="end"
    type="danger"
    invalid
    error="Texto de error de ejemplo"
  />
</template>
