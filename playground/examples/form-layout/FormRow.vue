<script setup lang="ts">
import { ref } from "vue";

import {
  BaseFormRow,
  BaseFormSection,
  BaseInput,
  BaseSwitch,
  BaseTextarea,
} from "../../../src/index";

const active = ref(false);
</script>

<template>
  <BaseFormSection
    title="Datos de envío"
    description="BaseFormRow admite de 1 a 4 columnas y se apila en pantallas estrechas."
  >
    <BaseInput label="Campo a ancho completo" model-value="Valor completo" />
    <BaseFormRow :columns="3" :column-widths="['1fr', '2fr', '1fr']">
      <BaseInput label="1fr" model-value="Valor" />
      <BaseInput label="2fr" model-value="Otro valor" />
      <BaseInput label="1fr" model-value="Tercer valor" />
    </BaseFormRow>
    <BaseFormRow :columns="2" align-items="center">
      <BaseInput label="Campo con etiqueta" model-value="Valor" />
      <BaseSwitch
        id="form-row-switch"
        v-model="active"
        label="Control alineado al centro"
        label-position="end"
      />
    </BaseFormRow>
    <BaseFormRow :columns="2" align-items="end">
      <BaseTextarea label="Alineación al final" model-value="Valor" :rows="3" />
      <BaseSwitch
        id="form-row-switch-end"
        v-model="active"
        label="Control al final"
        label-position="end"
      />
    </BaseFormRow>
  </BaseFormSection>
</template>
