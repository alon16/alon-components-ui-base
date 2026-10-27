<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, useId, watch } from "vue";
import type { PhoneCountry } from "../public-types";
import spainFlag from "../assets/spain-flag.svg";
import BaseFieldInfo from "./BaseFieldInfo.vue";
import BaseIcon from "./BaseIcon.vue";

defineOptions({ inheritAttrs: false });

const props = defineProps({
  id: { type: String, default: "" },
  name: { type: String, default: "" },
  label: { type: String, default: "" },
  info: { type: String, default: "" },
  infoAriaLabel: { type: String, default: "Información adicional" },
  infoType: { type: String, default: "" },
  countries: {
    type: Array,
    default: () => [{ name: "España", prefix: "+34", iso2: "ES" }],
  },
  defaultCountry: { type: String, default: "" },
  size: { type: String, default: "sm" },
  state: { type: String, default: "default" },
  help: { type: String, default: "" },
  error: { type: String, default: "" },
  success: { type: String, default: "" },
  placeholder: { type: String, default: "" },
  countrySearchPlaceholder: { type: String, default: "Buscar país..." },
  noResultsText: { type: String, default: "No hay resultados." },
  countrySelectorAriaLabel: { type: String, default: "Seleccionar país" },
  showFlags: { type: Boolean, default: true },
  required: Boolean,
  disabled: Boolean,
  readonly: Boolean,
  tone: { type: String, default: "default" },
});
const model = defineModel({ type: String, default: "" });
const emit = defineEmits<{
  prefixChange: [country: PhoneCountry];
}>();
const generatedId = useId();
const phoneId = computed(() => props.id || `phone-${generatedId}`);
const messageId = computed(() => `${phoneId.value}-message`);
const listId = computed(() => `${phoneId.value}-countries`);
const root = ref(null);
const menu = ref(null);
const numberInput = ref(null);
const searchInput = ref(null);
const nationalNumber = ref("");
const selectedCountry = ref(null);
const search = ref("");
const open = ref(false);
const opensAbove = ref(false);
const activeIndex = ref(-1);
let lastEmittedValue = null;
const currentState = computed(() =>
  props.error || props.state === "error"
    ? "error"
    : props.success || props.state === "success"
      ? "success"
      : "default",
);
const message = computed(() => props.error || props.success || props.help);
const countries = computed(() =>
  Array.isArray(props.countries) ? props.countries : [],
);
const fallbackCountry = computed(() => {
  const preferred = props.defaultCountry
    ? countries.value.find((country) =>
        [country.iso2, country.prefix, country.name].some(
          (value) =>
            value &&
            String(value).toLocaleLowerCase() ===
              props.defaultCountry.toLocaleLowerCase(),
        ),
      )
    : countries.value.find(
        (country) =>
          country.iso2?.toLocaleUpperCase() === "ES" ||
          country.prefix === "+34" ||
          country.name?.toLocaleLowerCase() === "españa",
      );
  return preferred || countries.value[0] || null;
});
const filteredCountries = computed(() => {
  const term = normalizeSearch(search.value);
  if (!term) return countries.value;
  return countries.value.filter((country) =>
    normalizeSearch(`${country.name} ${country.prefix}`).includes(term),
  );
});
const currentStateClass = computed(
  () => `base-phone-input--${currentState.value}`,
);

function isSpain(country) {
  return (
    country?.iso2?.toLocaleUpperCase() === "ES" ||
    country?.prefix === "+34" ||
    normalizeSearch(country?.name) === "espana"
  );
}

function isFlagUri(flag) {
  return /^(?:https?:|data:image\/|blob:|\/|\.\.?\/)/i.test(flag ?? "");
}

function parseModel(value) {
  const raw = String(value ?? "");
  const matching = countries.value
    .map((country, index) => ({
      country,
      index,
      prefix: String(country.prefix ?? ""),
    }))
    .filter(({ prefix }) => prefix && raw.startsWith(prefix))
    .sort((a, b) => b.prefix.length - a.prefix.length || a.index - b.index)[0];
  if (matching) {
    selectedCountry.value = matching.country;
    nationalNumber.value = raw.slice(matching.prefix.length);
  } else {
    selectedCountry.value = fallbackCountry.value;
    const fallbackPrefix = String(fallbackCountry.value?.prefix ?? "");
    nationalNumber.value =
      fallbackPrefix && raw.startsWith(fallbackPrefix)
        ? raw.slice(fallbackPrefix.length)
        : raw;
  }
}

function normalizeSearch(value) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase();
}

function emitValue() {
  const nextValue = `${selectedCountry.value?.prefix ?? ""}${nationalNumber.value}`;
  lastEmittedValue = nextValue;
  model.value = nextValue;
}

watch(
  () => model.value,
  (value) => {
    if (value === lastEmittedValue) {
      lastEmittedValue = null;
      return;
    }
    parseModel(value);
  },
  { immediate: true },
);
watch(search, () => {
  activeIndex.value = filteredCountries.value.length ? 0 : -1;
});
watch(fallbackCountry, (country) => {
  if (!selectedCountry.value) selectedCountry.value = country;
});

function updateNumber(event) {
  const input = event.target;
  nationalNumber.value = input.value;
  emitValue();
}

function toggle() {
  if (props.disabled || props.readonly) return;
  open.value = !open.value;
  search.value = "";
  activeIndex.value = Math.max(
    0,
    filteredCountries.value.indexOf(selectedCountry.value),
  );
  if (open.value) {
    requestAnimationFrame(() => searchInput.value?.focus());
    requestAnimationFrame(updateMenuPlacement);
  }
}

function updateMenuPlacement() {
  if (!open.value || !menu.value || !root.value) return;
  const control = root.value.querySelector(".base-phone-input__control");
  if (!control) return;
  const rect = control.getBoundingClientRect();
  const gap = 8;
  const spaceBelow = window.innerHeight - rect.bottom - gap;
  const spaceAbove = rect.top - gap;
  opensAbove.value =
    menu.value.offsetHeight > spaceBelow && spaceAbove > spaceBelow;
}

function choose(country) {
  const changed = country !== selectedCountry.value;
  selectedCountry.value = country;
  open.value = false;
  search.value = "";
  emitValue();
  if (changed) emit("prefixChange", country);
  numberInput.value?.focus();
}

function handleSearchKeydown(event) {
  if (event.key === "Escape") {
    open.value = false;
    numberInput.value?.focus();
  } else if (event.key === "ArrowDown" || event.key === "ArrowUp") {
    event.preventDefault();
    if (!filteredCountries.value.length) return;
    const direction = event.key === "ArrowDown" ? 1 : -1;
    activeIndex.value =
      (activeIndex.value + direction + filteredCountries.value.length) %
      filteredCountries.value.length;
  } else if (event.key === "Enter" && activeIndex.value >= 0) {
    event.preventDefault();
    choose(filteredCountries.value[activeIndex.value]);
  }
}

function onDocumentPointerDown(event) {
  if (!root.value?.contains(event.target)) open.value = false;
}
function onViewportChange() {
  updateMenuPlacement();
}
onMounted(() => {
  document.addEventListener("pointerdown", onDocumentPointerDown);
  window.addEventListener("resize", onViewportChange);
  window.addEventListener("scroll", onViewportChange, true);
});
onBeforeUnmount(() => {
  document.removeEventListener("pointerdown", onDocumentPointerDown);
  window.removeEventListener("resize", onViewportChange);
  window.removeEventListener("scroll", onViewportChange, true);
});

defineExpose({ focus: () => numberInput.value?.focus() });
</script>

<template>
  <div
    ref="root"
    class="base-phone-input"
    :class="[currentStateClass, `base-phone-input--${tone}`]"
  >
    <div v-if="label" class="base-phone-input__label-row">
      <label class="base-phone-input__label" :for="phoneId"
        >{{ label }}<span v-if="required" aria-hidden="true"> *</span></label
      >
      <BaseFieldInfo
        v-if="info"
        :text="info"
        :type="infoType"
        :aria-label="infoAriaLabel"
      />
    </div>
    <div
      class="base-phone-input__control"
      :class="[
        `base-phone-input__control--${size}`,
        { 'base-phone-input__control--open': open },
      ]"
    >
      <button
        class="base-phone-input__country"
        type="button"
        :disabled="disabled || readonly"
        :aria-label="countrySelectorAriaLabel"
        aria-haspopup="listbox"
        :aria-expanded="open"
        :aria-controls="listId"
        @click="toggle"
      >
        <img
          v-if="showFlags && isSpain(selectedCountry) && !selectedCountry?.flag"
          class="base-phone-input__flag"
          :src="spainFlag"
          alt=""
          aria-hidden="true"
        />
        <img
          v-else-if="
            showFlags &&
            selectedCountry?.flag &&
            isFlagUri(selectedCountry.flag)
          "
          class="base-phone-input__flag"
          :src="selectedCountry.flag"
          alt=""
          aria-hidden="true"
        />
        <span
          v-else-if="showFlags && selectedCountry?.flag"
          aria-hidden="true"
          >{{ selectedCountry.flag }}</span
        >
        <span class="base-phone-input__prefix">{{
          selectedCountry?.prefix
        }}</span>
        <BaseIcon name="chevronDown" size="sm" decorative />
      </button>
      <input
        :id="phoneId"
        ref="numberInput"
        v-bind="$attrs"
        :value="nationalNumber"
        class="base-phone-input__number"
        type="text"
        inputmode="numeric"
        autocomplete="tel-national"
        :placeholder="placeholder"
        :required="required"
        :disabled="disabled"
        :readonly="readonly"
        :aria-invalid="currentState === 'error' ? 'true' : undefined"
        :aria-describedby="message ? messageId : undefined"
        @input="updateNumber"
      />
      <div
        v-if="open"
        ref="menu"
        class="base-phone-input__menu"
        :class="{ 'base-phone-input__menu--above': opensAbove }"
      >
        <input
          ref="searchInput"
          v-model="search"
          class="base-phone-input__search"
          type="search"
          :placeholder="countrySearchPlaceholder"
          role="searchbox"
          :aria-label="countrySearchPlaceholder"
          :aria-controls="listId"
          :aria-activedescendant="
            activeIndex >= 0 ? `${phoneId}-country-${activeIndex}` : undefined
          "
          @keydown="handleSearchKeydown"
        />
        <ul
          :id="listId"
          class="base-phone-input__list"
          role="listbox"
          :aria-label="countrySelectorAriaLabel"
        >
          <li
            v-for="(country, index) in filteredCountries"
            :id="`${phoneId}-country-${index}`"
            :key="`${country.iso2 || country.name}-${country.prefix}`"
            class="base-phone-input__option"
            :class="{
              'base-phone-input__option--active': index === activeIndex,
              'base-phone-input__option--selected': country === selectedCountry,
            }"
            role="option"
            :aria-selected="country === selectedCountry"
            @mousedown.prevent="choose(country)"
          >
            <img
              v-if="showFlags && isSpain(country) && !country.flag"
              class="base-phone-input__flag"
              :src="spainFlag"
              alt=""
              aria-hidden="true"
            />
            <img
              v-else-if="showFlags && country.flag && isFlagUri(country.flag)"
              class="base-phone-input__flag"
              :src="country.flag"
              alt=""
              aria-hidden="true"
            />
            <span v-else-if="showFlags && country.flag" aria-hidden="true">{{
              country.flag
            }}</span
            ><span>{{ country.name }}</span
            ><span class="base-phone-input__option-prefix">{{
              country.prefix
            }}</span>
          </li>
          <li v-if="!filteredCountries.length" class="base-phone-input__empty">
            {{ noResultsText }}
          </li>
        </ul>
      </div>
      <input v-if="name" type="hidden" :name="name" :value="model" />
    </div>
    <span
      :id="messageId"
      class="base-phone-input__message"
      :class="{ 'base-phone-input__message--visible': message }"
      :aria-hidden="message ? undefined : 'true'"
      :role="currentState === 'error' ? 'alert' : undefined"
      >{{ message }}</span
    >
  </div>
</template>

<style scoped>
.base-phone-input {
  display: grid;
  min-width: var(--space-0);
  gap: var(--ui-field-gap, var(--base-field-gap, var(--space-2)));
}
.base-phone-input__label-row {
  display: flex;
  width: 100%;
  min-width: 0;
  align-items: center;
  gap: var(--space-1);
  flex-wrap: wrap;
}
.base-phone-input__label {
  color: var(--ui-form-label-color);
  font-size: var(--ui-form-label-size);
  font-weight: var(--text-label-weight);
  line-height: var(--text-label-leading);
}
.base-phone-input--inverse .base-phone-input__label {
  color: var(--ui-color-text-inverse-muted);
}
.base-phone-input__control {
  position: relative;
  display: flex;
  min-width: 0;
  border: var(--border-width-thin) solid var(--ui-control-border);
  border-radius: var(--radius-md);
  background: var(--ui-control-background);
  transition:
    border-color var(--transition-fast),
    box-shadow var(--transition-fast);
}
.base-phone-input__control:hover:not(:has(:disabled)):not(:focus-within) {
  border-color: var(--ui-control-hover-border);
}
.base-phone-input__control:focus-within {
  border-color: var(--ui-control-focus-border);
  outline: none;
  background: var(--ui-control-focus-background);
  box-shadow: 0 0 0 var(--space-1) var(--ui-control-focus-shadow);
}
.base-phone-input__control--sm {
  height: var(--control-height-sm);
  font-size: var(--font-size-xs);
}
.base-phone-input__control--md {
  height: var(--control-height-md);
  font-size: var(--font-size-sm);
}
.base-phone-input__control--lg {
  height: var(--control-height-lg);
  font-size: var(--font-size-md);
}
.base-phone-input__flag {
  display: block;
  width: 1.25rem;
  height: 0.875rem;
  flex: 0 0 auto;
  object-fit: cover;
  border-radius: var(--radius-xs, var(--radius-sm));
}
.base-phone-input__country {
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  gap: var(--space-2);
  padding: 0 var(--space-3);
  border: 0;
  border-right: var(--border-width-thin) solid var(--ui-color-border-default);
  border-radius: var(--radius-md) 0 0 var(--radius-md);
  color: var(--ui-color-text-body);
  background: transparent;
  font: inherit;
  cursor: pointer;
}
.base-phone-input__country:focus-visible {
  outline: var(--focus-outline-width) solid var(--ui-color-focus-ring);
  outline-offset: calc(var(--focus-outline-offset) * -1);
}
.base-phone-input__country:disabled {
  cursor: not-allowed;
}
.base-phone-input__number {
  flex: 1;
  width: 100%;
  min-width: 0;
  padding: 0 var(--space-3);
  border: 0;
  border-radius: 0 var(--radius-md) var(--radius-md) 0;
  outline: 0;
  color: var(--ui-color-text-body);
  background: transparent;
  font: inherit;
}
.base-phone-input__number::placeholder,
.base-phone-input__search::placeholder {
  color: var(--ui-color-text-muted);
}
.base-phone-input__control:has(:disabled) {
  background: var(--ui-control-disabled-background);
  border-color: var(--ui-control-disabled-border);
}
.base-phone-input--error .base-phone-input__control {
  border-color: var(--ui-color-state-error);
  background: var(--ui-color-state-error-surface);
}
.base-phone-input--success .base-phone-input__control {
  border-color: var(--ui-color-state-success);
  background: var(--ui-color-state-success-surface);
}
.base-phone-input__menu {
  position: absolute;
  z-index: 3;
  top: calc(100% + var(--space-1));
  left: 0;
  width: min(22rem, 100%);
  padding: var(--space-2);
  border: var(--border-width-thin) solid var(--ui-color-border-default);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
  background: var(--ui-overlay-background);
}
.base-phone-input__menu--above {
  top: auto;
  bottom: calc(100% + var(--space-1));
}
.base-phone-input__search {
  width: 100%;
  height: var(--control-height-sm);
  padding-inline: var(--space-3);
  border: var(--border-width-thin) solid var(--ui-control-border);
  border-radius: var(--radius-sm);
  color: var(--ui-color-text-body);
  background: var(--ui-control-background);
  font: inherit;
  transition:
    border-color var(--transition-fast),
    box-shadow var(--transition-fast),
    background-color var(--transition-fast);
}
.base-phone-input__search:hover:not(:disabled):not(:focus) {
  border-color: var(--ui-control-hover-border);
}
.base-phone-input__search:focus {
  border-color: var(--ui-control-focus-border);
  outline: none;
  background: var(--ui-control-focus-background);
  box-shadow: 0 0 0 var(--space-1) var(--ui-control-focus-shadow);
}
.base-phone-input__list {
  max-height: 16rem;
  margin: var(--space-1) 0 0;
  padding: var(--space-1);
  overflow-y: auto;
  list-style: none;
}
.base-phone-input__option {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-sm);
  color: var(--ui-color-text-body);
  font-size: var(--font-size-sm);
  cursor: pointer;
}
.base-phone-input__option-prefix {
  margin-left: auto;
  color: var(--ui-color-text-muted);
}
.base-phone-input__option:hover,
.base-phone-input__option--active {
  background: var(--ui-color-surface-muted);
}
.base-phone-input__option--selected {
  color: var(--ui-color-brand-primary);
  font-weight: var(--font-weight-semibold);
}
.base-phone-input__empty {
  padding: var(--space-2) var(--space-3);
  color: var(--ui-color-text-muted);
  font-size: var(--font-size-sm);
}
.base-phone-input__message {
  min-height: var(
    --ui-field-message-min-height,
    var(
      --base-field-message-min-height,
      calc(var(--font-size-xs) * var(--line-height-heading))
    )
  );
  margin-top: calc(var(--space-2) * -0.5);
  color: var(--ui-color-text-muted);
  font-size: var(--font-size-xs);
  line-height: var(--line-height-heading);
  visibility: hidden;
}
.base-phone-input__message--visible {
  visibility: visible;
}
.base-phone-input--error .base-phone-input__message {
  color: var(--ui-color-state-error);
}
.base-phone-input--success .base-phone-input__message {
  color: var(--ui-color-state-success);
}
</style>
