<script setup lang="ts">
import {
  computed,
  onBeforeUnmount,
  onMounted,
  ref,
  useId,
  useSlots,
  watch,
} from "vue";
import BaseFieldInfo from "./BaseFieldInfo.vue";
import BaseIcon from "./BaseIcon.vue";

defineOptions({ inheritAttrs: false });

const props = defineProps({
  id: { type: String, default: "" },
  label: { type: String, default: "" },
  info: { type: String, default: "" },
  infoAriaLabel: { type: String, default: "Información adicional" },
  infoType: {
    type: String,
    default: "",
    validator: (value) =>
      ["", "primary", "secondary", "success", "danger"].includes(value),
  },
  options: { type: Array, default: () => [] },
  fetchOptions: { type: Function, default: null },
  allowCreate: Boolean,
  labelKey: { type: String, default: "label" },
  selectedLabelKey: { type: String, default: "" },
  valueKey: { type: String, default: "value" },
  initialMatchKey: { type: String, default: "" },
  initialMatchValue: { type: [String, Number], default: "" },
  minChars: { type: Number, default: 3 },
  debounceMs: { type: Number, default: 300 },
  maxSuggestions: { type: Number, default: 10 },
  size: {
    type: String,
    default: "md",
    validator: (value) => ["sm", "md", "lg"].includes(value),
  },
  state: {
    type: String,
    default: "default",
    validator: (value) => ["default", "error", "success"].includes(value),
  },
  help: { type: String, default: "" },
  error: { type: String, default: "" },
  success: { type: String, default: "" },
  required: Boolean,
  disabled: Boolean,
  readonly: Boolean,
  clearAriaLabel: { type: String, default: "Limpiar selección" },
  loadingText: { type: String, default: "Cargando opciones…" },
  noResultsText: { type: String, default: "No hay resultados." },
  loadErrorText: {
    type: String,
    default: "No se pudieron cargar las opciones.",
  },
  tone: {
    type: String,
    default: "default",
    validator: (value) => ["default", "inverse"].includes(value),
  },
});

const emit = defineEmits(["update:modelValue", "select", "blur"]);
const model = defineModel({
  type: [String, Number, Boolean, Object],
  default: null,
});
const slots = useSlots();
const generatedId = useId();
const autocompleteId = computed(
  () => props.id || `autocomplete-${generatedId}`,
);
const listboxId = computed(() => `${autocompleteId.value}-listbox`);
const messageId = computed(() => `${autocompleteId.value}-message`);
const inputElement = ref(null);
const rootElement = ref(null);
const query = ref("");
const selectedOption = ref(null);
const suggestions = ref([]);
const activeIndex = ref(-1);
const isOpen = ref(false);
const isLoading = ref(false);
const remoteError = ref("");
const requestController = ref(null);
const requestVersion = ref(0);
const debounceTimer = ref(null);
const hasMounted = ref(false);
const cache = new Map();

const isRemote = computed(() => typeof props.fetchOptions === "function");
const hasInfo = computed(() => Boolean(props.info.trim()));
const hasLeading = computed(() => Boolean(slots.leading));
const currentState = computed(() => {
  if (props.error || props.state === "error") return "error";
  if (props.success || props.state === "success") return "success";
  return "default";
});
const message = computed(() => props.error || props.success || props.help);
const activeDescendant = computed(() =>
  activeIndex.value >= 0
    ? `${autocompleteId.value}-option-${activeIndex.value}`
    : undefined,
);
const normalizedQuery = computed(() => normalize(query.value));
const canSearchRemotely = computed(
  () => normalizedQuery.value.length >= props.minChars,
);
const showList = computed(
  () =>
    isOpen.value &&
    (isLoading.value ||
      remoteError.value ||
      suggestions.value.length ||
      !isRemote.value ||
      canSearchRemotely.value),
);

onMounted(() => {
  hasMounted.value = true;
  document.addEventListener("pointerdown", handleDocumentPointerDown);
  loadInitialRemoteSelection();
});

onBeforeUnmount(() => {
  cancelPendingRequest();
  document.removeEventListener("pointerdown", handleDocumentPointerDown);
});

function normalize(value) {
  return String(value ?? "")
    .trim()
    .toLocaleLowerCase();
}

function getLabel(option) {
  if (option !== null && typeof option === "object")
    return String(option[props.labelKey] ?? "");
  return String(option ?? "");
}

function getSelectedLabel(option) {
  if (option !== null && typeof option === "object" && props.selectedLabelKey) {
    return String(option[props.selectedLabelKey] ?? "");
  }

  return getLabel(option);
}

function getValue(option) {
  if (option !== null && typeof option === "object")
    return option[props.valueKey];
  return option;
}

function getHighlightedLabelParts(option) {
  const label = getLabel(option);
  const search = String(query.value).trim();
  if (!search) return [{ text: label, isMatch: false }];

  const expression = new RegExp(`(${escapeRegExp(search)})`, "gi");
  return label
    .split(expression)
    .filter((text) => text !== "")
    .map((text) => ({
      text,
      isMatch:
        text.localeCompare(search, undefined, { sensitivity: "accent" }) === 0,
    }));
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function createOption(value) {
  return {
    [props.labelKey]: value,
    [props.valueKey]: value,
  };
}

function isSameValue(first, second) {
  return Object.is(first, second);
}

function findOptionByValue(value) {
  return (
    props.options.find((option) => isSameValue(getValue(option), value)) ?? null
  );
}

function setSelectedOption(option) {
  selectedOption.value = option;
  query.value = option ? getSelectedLabel(option) : "";
}

function updateLocalSuggestions() {
  const search = normalizedQuery.value;
  suggestions.value = props.options
    .filter((option) => normalize(getLabel(option)).includes(search))
    .slice(0, props.maxSuggestions);
  activeIndex.value = -1;
  remoteError.value = "";
}

function cancelPendingRequest() {
  if (debounceTimer.value) clearTimeout(debounceTimer.value);
  debounceTimer.value = null;
  requestController.value?.abort();
  requestController.value = null;
}

async function searchRemote({ force = false, selectSingle = false } = {}) {
  const term = normalizedQuery.value;
  const requestQuery = String(query.value).trim();
  if (!force && !canSearchRemotely.value) {
    cancelPendingRequest();
    suggestions.value = props.options.slice(0, props.maxSuggestions);
    activeIndex.value = -1;
    isLoading.value = false;
    remoteError.value = "";
    return;
  }

  if (cache.has(term)) {
    const options = cache.get(term);
    suggestions.value = options;
    activeIndex.value = -1;
    remoteError.value = "";
    isLoading.value = false;
    if (selectSingle) selectInitialRemoteOption(options);
    return;
  }

  requestController.value?.abort();
  const controller = new AbortController();
  requestController.value = controller;
  const version = ++requestVersion.value;
  isLoading.value = true;
  remoteError.value = "";

  try {
    const result = await props.fetchOptions(requestQuery, {
      limit: props.maxSuggestions,
      signal: controller.signal,
    });
    if (version !== requestVersion.value || controller.signal.aborted) return;
    const remoteOptions = Array.isArray(result)
      ? result.slice(0, props.maxSuggestions)
      : [];
    const options =
      !remoteOptions.length && props.allowCreate && requestQuery
        ? [createOption(requestQuery)]
        : remoteOptions;
    cache.set(term, options);
    suggestions.value = options;
    activeIndex.value = -1;
    if (selectSingle) selectInitialRemoteOption(options);
  } catch (error) {
    if (version !== requestVersion.value || controller.signal.aborted) return;
    suggestions.value = [];
    remoteError.value = props.loadErrorText;
  } finally {
    if (version === requestVersion.value) isLoading.value = false;
  }
}

function scheduleSearch() {
  if (!isRemote.value) {
    updateLocalSuggestions();
    return;
  }

  cancelPendingRequest();
  if (!canSearchRemotely.value) {
    suggestions.value = props.options.slice(0, props.maxSuggestions);
    activeIndex.value = -1;
    remoteError.value = "";
    return;
  }
  debounceTimer.value = setTimeout(searchRemote, props.debounceMs);
}

function openList() {
  if (props.disabled || props.readonly) return;
  isOpen.value = true;
  scheduleSearch();
}

function closeList() {
  isOpen.value = false;
  activeIndex.value = -1;
}

function clearSelection(keepQuery = false) {
  cancelPendingRequest();
  ++requestVersion.value;
  selectedOption.value = null;
  if (!keepQuery) query.value = "";
  suggestions.value = [];
  remoteError.value = "";
  emit("update:modelValue", null);
  emit("select", null);
}

function selectOption(option) {
  if (option?.disabled) return;
  cancelPendingRequest();
  ++requestVersion.value;
  isLoading.value = false;
  setSelectedOption(option);
  suggestions.value = [];
  closeList();
  emit("update:modelValue", getValue(option));
  emit("select", option);
}

function handleInput(event) {
  query.value = event.target.value;
  const selectedLabel = selectedOption.value
    ? getSelectedLabel(selectedOption.value)
    : String(model.value ?? "");
  if (
    model.value !== null &&
    model.value !== undefined &&
    query.value !== selectedLabel
  ) {
    clearSelection(true);
  }
  isOpen.value = true;
  scheduleSearch();
}

function handleKeydown(event) {
  if (props.disabled || props.readonly) return;
  if (event.key === "Escape") {
    closeList();
    return;
  }
  if (event.key === "ArrowDown" || event.key === "ArrowUp") {
    event.preventDefault();
    if (!isOpen.value) openList();
    const enabled = suggestions.value
      .map((option, index) => ({ option, index }))
      .filter(({ option }) => !option?.disabled);
    if (!enabled.length) return;
    const direction = event.key === "ArrowDown" ? 1 : -1;
    const current = enabled.findIndex(
      ({ index }) => index === activeIndex.value,
    );
    activeIndex.value =
      enabled[(current + direction + enabled.length) % enabled.length].index;
    return;
  }
  if (event.key === "Enter" && isOpen.value && activeIndex.value >= 0) {
    event.preventDefault();
    selectOption(suggestions.value[activeIndex.value]);
  }
}

function handleDocumentPointerDown(event) {
  if (!rootElement.value?.contains(event.target)) closeList();
}

function handleBlur(event) {
  closeList();
  emit("blur", event);
}

function hasInitialValue(value) {
  return value !== null && value !== undefined && String(value).trim() !== "";
}

function loadInitialRemoteSelection() {
  if (!isRemote.value || !hasInitialValue(model.value)) return;

  query.value = getLabel(model.value);
  searchRemote({ force: true, selectSingle: true });
}

function selectInitialRemoteOption(options) {
  if (!options.length) return;

  const matchingOption = props.initialMatchKey
    ? options.find(
        (option) =>
          String(option?.[props.initialMatchKey] || "") ===
          String(props.initialMatchValue || ""),
      )
    : options.length === 1
      ? options[0]
      : null;

  if (matchingOption) selectOption(matchingOption);
}

watch(
  () => model.value,
  (value) => {
    if (
      selectedOption.value &&
      isSameValue(getValue(selectedOption.value), value)
    )
      return;
    setSelectedOption(findOptionByValue(value));
    if (hasMounted.value && isRemote.value && hasInitialValue(value)) {
      loadInitialRemoteSelection();
    }
  },
  { immediate: true },
);

watch(
  () => props.options,
  () => {
    if (model.value !== null && model.value !== undefined)
      setSelectedOption(findOptionByValue(model.value));
  },
  { deep: true },
);

defineExpose({
  focus: () => inputElement.value?.focus(),
});
</script>

<template>
  <div
    ref="rootElement"
    class="base-autocomplete"
    :class="[
      `base-autocomplete--${currentState}`,
      `base-autocomplete--${tone}`,
    ]"
  >
    <div v-if="label" class="base-autocomplete__label-row">
      <label class="base-autocomplete__label" :for="autocompleteId">
        {{ label }}<span v-if="required" aria-hidden="true"> *</span>
      </label>
      <BaseFieldInfo
        v-if="hasInfo"
        :text="info"
        :type="infoType"
        :aria-label="infoAriaLabel"
      />
    </div>
    <div
      class="base-autocomplete__control"
      :class="{ 'base-autocomplete__control--leading': hasLeading }"
    >
      <span
        v-if="hasLeading"
        class="base-autocomplete__leading"
        aria-hidden="true"
        ><slot name="leading"
      /></span>
      <input
        :id="autocompleteId"
        ref="inputElement"
        v-bind="$attrs"
        :value="query"
        class="base-autocomplete__input"
        :class="`base-autocomplete__input--${size}`"
        type="text"
        role="combobox"
        autocomplete="off"
        :required="required"
        :disabled="disabled"
        :readonly="readonly"
        :aria-invalid="currentState === 'error' ? 'true' : undefined"
        :aria-describedby="message ? messageId : undefined"
        :aria-expanded="isOpen"
        :aria-controls="listboxId"
        :aria-activedescendant="activeDescendant"
        @input="handleInput"
        @focus="openList"
        @keydown="handleKeydown"
        @blur="handleBlur"
      />
      <button
        v-if="selectedOption && !disabled && !readonly"
        class="base-autocomplete__clear"
        type="button"
        :aria-label="clearAriaLabel"
        @click="clearSelection()"
      >
        <BaseIcon name="close" size="sm" decorative />
      </button>
      <BaseIcon
        v-else-if="isLoading"
        class="base-autocomplete__indicator base-autocomplete__indicator--loading"
        name="loader"
        size="sm"
        decorative
      />
      <BaseIcon
        v-else
        class="base-autocomplete__indicator"
        name="chevronDown"
        size="sm"
        decorative
      />
      <ul
        v-if="showList"
        :id="listboxId"
        class="base-autocomplete__list"
        role="listbox"
      >
        <li v-if="isLoading" class="base-autocomplete__status" role="status">
          {{ loadingText }}
        </li>
        <li
          v-else-if="remoteError"
          class="base-autocomplete__status base-autocomplete__status--error"
          role="alert"
        >
          {{ remoteError }}
        </li>
        <li v-else-if="!suggestions.length" class="base-autocomplete__status">
          {{ noResultsText }}
        </li>
        <li
          v-for="(option, index) in suggestions"
          :id="`${autocompleteId}-option-${index}`"
          :key="`${String(getValue(option))}-${index}`"
          class="base-autocomplete__option"
          :class="{
            'base-autocomplete__option--active': index === activeIndex,
            'base-autocomplete__option--selected': isSameValue(
              getValue(option),
              model,
            ),
            'base-autocomplete__option--disabled': option?.disabled,
          }"
          role="option"
          :aria-selected="isSameValue(getValue(option), model)"
          :aria-disabled="option?.disabled || undefined"
          @mousedown.prevent="selectOption(option)"
        >
          <template
            v-for="(part, partIndex) in getHighlightedLabelParts(option)"
            :key="partIndex"
          >
            <strong v-if="part.isMatch" class="base-autocomplete__match">{{
              part.text
            }}</strong>
            <template v-else>{{ part.text }}</template>
          </template>
        </li>
      </ul>
    </div>
    <span
      :id="messageId"
      class="base-autocomplete__message"
      :class="{ 'base-autocomplete__message--visible': message }"
      :aria-hidden="message ? undefined : 'true'"
      :role="currentState === 'error' ? 'alert' : undefined"
    >
      {{ message }}
    </span>
  </div>
</template>

<style scoped>
.base-autocomplete {
  display: grid;
  min-width: var(--space-0);
  gap: var(--bs-field-gap, var(--base-field-gap, var(--space-2)));
}
.base-autocomplete__label {
  color: var(--bs-form-label-color);
  font-size: var(--bs-form-label-size);
  font-weight: var(--text-label-weight);
  line-height: var(--text-label-leading);
}
.base-autocomplete__label-row {
  display: flex;
  width: 100%;
  min-width: 0;
  align-items: center;
  gap: var(--space-1);
  flex-wrap: wrap;
}
.base-autocomplete--inverse .base-autocomplete__label {
  color: var(--bs-color-text-inverse-muted);
}
.base-autocomplete__control {
  position: relative;
}
.base-autocomplete__input {
  width: 100%;
  min-width: var(--space-0);
  box-sizing: border-box;
  border: var(--border-width-thin) solid var(--bs-control-border);
  border-radius: var(--radius-md);
  color: var(--bs-form-value-color);
  background: var(--bs-control-background);
  font: inherit;
  transition:
    border-color var(--transition-fast),
    box-shadow var(--transition-fast),
    background-color var(--transition-fast);
}
.base-autocomplete__input::placeholder {
  color: var(--bs-color-text-muted);
}
.base-autocomplete__input:hover:not(:disabled):not(:read-only):not(:focus) {
  border-color: var(--bs-control-hover-border);
}
.base-autocomplete__input:focus {
  border-color: var(--bs-control-focus-border);
  outline: none;
  background: var(--bs-control-focus-background);
  box-shadow: 0 0 0 var(--space-1) var(--bs-control-focus-shadow);
}
.base-autocomplete__input:disabled {
  cursor: not-allowed;
  background: var(--bs-control-disabled-background);
  border-color: var(--bs-control-disabled-border);
}
.base-autocomplete__input:read-only {
  cursor: default;
}
.base-autocomplete__input--sm {
  height: var(--control-height-sm);
  padding-inline: var(--space-3) var(--space-10);
  font-size: var(--font-size-xs);
}
.base-autocomplete__input--md {
  height: var(--control-height-md);
  padding-inline: var(--space-4) var(--space-10);
  font-size: var(--font-size-sm);
}
.base-autocomplete__input--lg {
  height: var(--control-height-lg);
  padding-inline: var(--space-4) var(--space-10);
  font-size: var(--font-size-md);
}
.base-autocomplete__leading {
  position: absolute;
  z-index: 1;
  top: 50%;
  left: var(--space-3);
  display: inline-flex;
  color: var(--bs-color-text-muted);
  transform: translateY(-50%);
  pointer-events: none;
}
.base-autocomplete__control--leading .base-autocomplete__input {
  padding-left: var(--space-10);
}
.base-autocomplete__indicator,
.base-autocomplete__clear {
  position: absolute;
  top: 50%;
  right: var(--space-3);
  color: var(--bs-color-text-muted);
  transform: translateY(-50%);
}
.base-autocomplete__indicator {
  pointer-events: none;
}
.base-autocomplete__indicator--loading {
  animation: base-autocomplete-spin 0.8s linear infinite;
}
.base-autocomplete__clear {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-0);
  border: 0;
  border-radius: var(--radius-sm);
  background: transparent;
  cursor: pointer;
}
.base-autocomplete__clear:hover {
  color: var(--bs-color-text-heading);
  background: var(--bs-color-surface-muted);
}
.base-autocomplete__clear:focus-visible {
  outline: var(--focus-outline-width) solid var(--bs-color-focus-ring);
  outline-offset: var(--focus-outline-offset);
}
.base-autocomplete__list {
  position: absolute;
  z-index: 2;
  top: var(--base-menu-top, calc(100% + var(--space-1)));
  left: 0;
  width: 100%;
  max-height: 16rem;
  margin: 0;
  padding: var(--space-1);
  overflow-y: auto;
  border: var(--border-width-thin) solid var(--bs-control-border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
  background: var(--bs-overlay-background);
  list-style: none;
  bottom: var(--base-menu-bottom, auto);
}
.base-autocomplete__option,
.base-autocomplete__status {
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-sm);
  font-size: var(--font-size-sm);
  line-height: var(--line-height-base);
}
.base-autocomplete__option {
  color: var(--bs-color-text-body);
  cursor: pointer;
}
.base-autocomplete__option--active,
.base-autocomplete__option:hover {
  background: var(--bs-color-surface-muted);
}
.base-autocomplete__option--selected {
  color: var(--bs-color-brand-primary);
  font-weight: var(--font-weight-semibold);
}
.base-autocomplete__option--disabled {
  cursor: not-allowed;
  opacity: var(--opacity-disabled);
}
.base-autocomplete__option--disabled:hover {
  background: transparent;
}
.base-autocomplete__status {
  color: var(--bs-color-text-muted);
}
.base-autocomplete__status--error {
  color: var(--bs-color-state-error);
}
.base-autocomplete--error .base-autocomplete__input {
  border-color: var(--bs-color-state-error);
  background: var(--bs-control-background);
  box-shadow: none;
}
.base-autocomplete--success .base-autocomplete__input {
  border-color: var(--bs-color-state-success);
  background: var(--bs-color-state-success-surface);
}
.base-autocomplete__message {
  margin-top: calc(var(--space-2) * -0.5);
  min-height: var(
    --bs-field-message-min-height,
    var(
      --base-field-message-min-height,
      calc(var(--font-size-xs) * var(--line-height-heading))
    )
  );
  color: var(--bs-color-text-muted);
  font-size: var(--font-size-xs);
  line-height: var(--line-height-heading);
  visibility: hidden;
}
.base-autocomplete__message--visible {
  visibility: visible;
}
.base-autocomplete--error .base-autocomplete__message {
  color: var(--bs-color-state-error);
}
.base-autocomplete--success .base-autocomplete__message {
  color: var(--bs-color-state-success);
}
@keyframes base-autocomplete-spin {
  to {
    transform: translateY(-50%) rotate(360deg);
  }
}
</style>
