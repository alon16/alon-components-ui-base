<script setup lang="ts">
import { ref } from "vue";

import { BaseCheckbox } from "../../../src/index";

const small = ref(false);
const medium = ref(true);
</script>

<template>
  <BaseCheckbox v-model="small" label="Checkbox pequeño (sm)" size="sm" />
  <BaseCheckbox v-model="medium" label="Checkbox mediano (md)" size="md" />
</template>
