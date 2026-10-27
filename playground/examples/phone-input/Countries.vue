<script setup lang="ts">
import { ref } from "vue";

import { BasePhoneInput } from "../../../src/index";

const phone = ref("+34612345678");
const phoneWithoutFlags = ref("+50588888888");

const countries = [
  { name: "España", prefix: "+34", iso2: "ES", flag: "🇪🇸" },
  { name: "Nicaragua", prefix: "+505", iso2: "NI", flag: "🇳🇮" },
  { name: "Estados Unidos", prefix: "+1", iso2: "US", flag: "🇺🇸" },
];
</script>

<template>
  <BasePhoneInput
    v-model="phone"
    label="Teléfono"
    :countries="countries"
    country-selector-aria-label="Seleccionar país del teléfono"
    help="Busca el país por nombre o prefijo."
  />
  <BasePhoneInput
    v-model="phoneWithoutFlags"
    label="Teléfono sin banderas"
    :countries="countries"
    :show-flags="false"
  />
</template>
