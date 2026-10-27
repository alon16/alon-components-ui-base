<script setup lang="ts">
import { ref } from "vue";

import { BaseRadio } from "../../../src/index";

const size = ref("sm");
</script>

<template>
  <BaseRadio
    id="radio-size-sm"
    v-model="size"
    name="radio-size-example"
    value="sm"
    label="Radio pequeño (sm)"
    size="sm"
  />
  <BaseRadio
    id="radio-size-md"
    v-model="size"
    name="radio-size-example"
    value="md"
    label="Radio mediano (md)"
    size="md"
  />
  <BaseRadio
    id="radio-label-end"
    v-model="size"
    name="radio-size-example"
    value="end"
    label="Radio con label a la derecha"
    label-position="end"
  />
</template>
