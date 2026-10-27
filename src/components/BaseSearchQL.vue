<script setup lang="ts">
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  useId,
  watch,
} from "vue";
import type {
  BaseSearchQLChange,
  BaseSearchQLDefaultFilter,
  BaseSearchQLProps,
  BaseSearchQLTextFilter,
  DateRangeValue,
  DateValue,
  SelectValue,
} from "../public-types";
import BaseButton from "./BaseButton.vue";
import BaseIcon from "./BaseIcon.vue";
import BaseDateInput from "./BaseDateInput.vue";

const props = withDefaults(defineProps<BaseSearchQLProps>(), {
  id: "",
  size: "md",
  filters: () => [],
  defaultFilters: () => [],
  placeholder: "Buscar...",
  searchAriaLabel: "Buscar por campo",
  searchSuggestionPrefix: "Buscar",
  searchSuggestionConnector: "por",
  defaultFiltersLabel: "Filtros",
  removeFilterAriaLabel: "Quitar filtro",
  noResultsText: "No hay campos de búsqueda disponibles.",
  showDateRange: false,
  dateRangeRequired: false,
  dateValue: null,
  dateRangeLabel: "Rango de fechas",
  dateRangeAriaLabel: "Seleccionar rango de fechas",
  acceptDateRangeLabel: "Aceptar",
  dateRangePlaceholder: "Seleccionar fechas",
  dateFromLabel: "Desde",
  dateToLabel: "Hasta",
  disabled: false,
});

const textLabels = computed(() => ({
  placeholder: props.texts?.placeholder ?? props.placeholder,
  searchAriaLabel: props.texts?.searchAriaLabel ?? props.searchAriaLabel,
  searchSuggestionPrefix:
    props.texts?.searchSuggestionPrefix ?? props.searchSuggestionPrefix,
  searchSuggestionConnector:
    props.texts?.searchSuggestionConnector ?? props.searchSuggestionConnector,
  defaultFiltersLabel:
    props.texts?.defaultFiltersLabel ?? props.defaultFiltersLabel,
  removeFilterAriaLabel:
    props.texts?.removeFilterAriaLabel ?? props.removeFilterAriaLabel,
  noResultsText: props.texts?.noResultsText ?? props.noResultsText,
  dateRangeLabel: props.texts?.dateRangeLabel ?? props.dateRangeLabel,
  dateRangeAriaLabel:
    props.texts?.dateRangeAriaLabel ?? props.dateRangeAriaLabel,
  acceptDateRangeLabel:
    props.texts?.acceptDateRangeLabel ?? props.acceptDateRangeLabel,
  dateRangePlaceholder:
    props.texts?.dateRangePlaceholder ?? props.dateRangePlaceholder,
  dateFromLabel: props.texts?.dateFromLabel ?? props.dateFromLabel,
  dateToLabel: props.texts?.dateToLabel ?? props.dateToLabel,
  dateLocale: props.texts?.dateLocale ?? "es",
}));

const emit = defineEmits<{
  "update:modelValue": [filters: BaseSearchQLChange[]];
  change: [filters: BaseSearchQLChange[]];
  "date-change": [value: DateRangeValue];
}>();

interface SelectedSearchFilter {
  id: number;
  kind: "text" | "default";
  name: string;
  label: string;
  displayValue: string;
  value: SelectValue;
}

type DateRangeDraft = [Date | string | null, Date | string | null] | null;
const datePickerActionRow = {
  showSelect: false,
  showCancel: false,
  showNow: false,
  showPreview: false,
};

const generatedId = useId();
const searchId = computed(() => props.id || `search-ql-${generatedId}`);
const suggestionsId = computed(() => `${searchId.value}-suggestions`);
const defaultFiltersId = computed(() => `${searchId.value}-filters`);
const dateFromInputId = computed(() => `${searchId.value}-date-from`);
const dateToInputId = computed(() => `${searchId.value}-date-to`);
const dateFromMenuId = computed(() => `${searchId.value}-date-from-menu`);
const dateToMenuId = computed(() => `${searchId.value}-date-to-menu`);
const rootElement = ref<HTMLElement | null>(null);
const searchInput = ref<HTMLInputElement | null>(null);
const query = ref("");
const selectedFilters = ref<SelectedSearchFilter[]>([]);
const suggestionsOpen = ref(false);
const defaultFiltersOpen = ref(false);
const dateRangeOpen = ref(false);
const dateDraft = ref<DateRangeDraft>(cloneDateRange(props.dateValue));
const activeSuggestionIndex = ref(0);
let nextFilterId = 0;

function cloneDateRange(value: DateRangeValue | undefined): DateRangeDraft {
  return value ? [value[0], value[1]] : null;
}

watch(
  () => props.dateValue,
  (value) => {
    dateDraft.value = cloneDateRange(value);
  },
);

const formattedDateRange = computed(() => {
  if (!props.dateValue?.[0] || !props.dateValue[1]) return "";
  const formatter = new Intl.DateTimeFormat(textLabels.value.dateLocale, {
    dateStyle: "medium",
  });
  const format = (value: DateValue) => {
    if (
      !(value instanceof Date) &&
      typeof value !== "string" &&
      typeof value !== "number"
    ) {
      return String(value);
    }
    const date = value instanceof Date ? value : new Date(value);
    return Number.isNaN(date.getTime())
      ? String(value)
      : formatter.format(date);
  };
  return `${format(props.dateValue[0])} – ${format(props.dateValue[1])}`;
});
const canAcceptDateRange = computed(() =>
  Boolean(dateDraft.value?.[0] && dateDraft.value[1]),
);

function acceptDateRange() {
  if (!canAcceptDateRange.value || props.disabled) return;
  const value: DateRangeValue = [
    dateDraft.value![0] as Date | string,
    dateDraft.value![1] as Date | string,
  ];
  emit("date-change", value);
  dateRangeOpen.value = false;
}

function updateDateDraft(index: 0 | 1, value: DateValue) {
  const dateValue =
    value == null
      ? null
      : value instanceof Date || typeof value === "string"
        ? value
        : typeof value === "number"
          ? new Date(value)
          : String(value);
  const current = dateDraft.value ?? [null, null];
  dateDraft.value =
    index === 0 ? [dateValue, current[1]] : [current[0], dateValue];
}

function removeDateRange() {
  if (props.disabled || props.dateRangeRequired) return;
  dateDraft.value = null;
  emit("date-change", null);
}

function toggleDefaultFilters() {
  defaultFiltersOpen.value = !defaultFiltersOpen.value;
  if (defaultFiltersOpen.value) dateRangeOpen.value = false;
}

function toggleDateRange() {
  dateRangeOpen.value = !dateRangeOpen.value;
  if (dateRangeOpen.value) defaultFiltersOpen.value = false;
}

const filterColumns = computed(() =>
  props.defaultFilters.map((filter) => [filter]),
);
const visibleSuggestions = computed(() => {
  if (!query.value.trim()) return [];
  const selectedNames = new Set(selectedFilters.value.map(({ name }) => name));
  return props.filters.filter((filter) => !selectedNames.has(filter.name));
});

watch(query, (value) => {
  suggestionsOpen.value = Boolean(value.trim());
  activeSuggestionIndex.value = 0;
});

function areValuesEqual(first: SelectValue | undefined, second: SelectValue) {
  if (Object.is(first, second)) return true;
  if (
    !first ||
    !second ||
    typeof first !== "object" ||
    typeof second !== "object"
  ) {
    return false;
  }
  return JSON.stringify(first) === JSON.stringify(second);
}

function escapeSearchText(text: string) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function formatSearchValue(value: SelectValue, regex = false) {
  const text =
    typeof value === "object" ? JSON.stringify(value) : String(value);
  if (!regex || typeof value !== "string") return text;
  // Only unwrap the escaped literal patterns produced by this component.
  if (value.startsWith(".*") && value.endsWith(".*")) {
    const literal = value.slice(2, -2).replace(/\\([.*+?^${}()|[\]\\])/g, "$1");
    if (`.*${escapeSearchText(literal)}.*` === value) return literal;
  }
  return text;
}

watch(
  [() => props.modelValue, () => props.filters, () => props.defaultFilters],
  () => {
    const values = props.modelValue ?? selectedFilters.value;
    const previous = new Map(
      selectedFilters.value.map((filter) => [filter.name, filter]),
    );
    // A field has one selection; the last incoming value wins.
    const uniqueValues = new Map(
      values.map((filter) => [filter.name, filter.value]),
    );
    selectedFilters.value = Array.from(uniqueValues, ([name, value]) => {
      const defaultFilter = props.defaultFilters.find(
        (filter) => filter.name === name,
      );
      const option = defaultFilter?.options.find((option) =>
        areValuesEqual(option.value, value),
      );
      const textFilter = props.filters.find((filter) => filter.name === name);
      return {
        id: previous.get(name)?.id ?? nextFilterId++,
        kind: defaultFilter ? "default" : "text",
        name,
        label: defaultFilter?.label ?? textFilter?.label ?? name,
        displayValue:
          option?.label ?? formatSearchValue(value, textFilter?.regex),
        value,
      };
    });
    activeSuggestionIndex.value = 0;
  },
  { immediate: true, deep: true },
);

function emitChange() {
  const filters = selectedFilters.value.map(({ name, value }) => ({
    name,
    value,
  }));
  emit("update:modelValue", filters);
  emit("change", filters);
}

function addTextFilter(filter: BaseSearchQLTextFilter) {
  const text = query.value.trim();
  if (!text || props.disabled) return;

  const value = filter.regex ? `.*${escapeSearchText(text)}.*` : text;
  const duplicate = selectedFilters.value.some(
    (selected) => selected.name === filter.name,
  );
  if (!duplicate) {
    selectedFilters.value = [
      ...selectedFilters.value,
      {
        id: nextFilterId++,
        kind: "text",
        name: filter.name,
        label: filter.label,
        displayValue: text,
        value,
      },
    ];
    emitChange();
  }

  query.value = "";
  suggestionsOpen.value = false;
  void nextTick(() => searchInput.value?.focus());
}

function toggleDefaultOption(
  filter: BaseSearchQLDefaultFilter,
  option: { label: string; value: SelectValue },
) {
  if (props.disabled) return;

  const currentIndex = selectedFilters.value.findIndex(
    (selected) =>
      selected.kind === "default" &&
      selected.name === filter.name &&
      areValuesEqual(selected.value, option.value),
  );

  if (currentIndex >= 0) {
    selectedFilters.value = selectedFilters.value.filter(
      (_, index) => index !== currentIndex,
    );
  } else {
    const remaining = selectedFilters.value.filter(
      (selected) => selected.name !== filter.name,
    );
    selectedFilters.value = [
      ...remaining,
      {
        id: nextFilterId++,
        kind: "default",
        name: filter.name,
        label: filter.label,
        displayValue: option.label,
        value: option.value,
      },
    ];
  }

  emitChange();
}

function removeFilter(id: number) {
  if (props.disabled) return;
  selectedFilters.value = selectedFilters.value.filter(
    (filter) => filter.id !== id,
  );
  emitChange();
}

function handleSearchKeydown(event: KeyboardEvent) {
  if (props.disabled) return;

  if (event.key === "Escape") {
    suggestionsOpen.value = false;
    defaultFiltersOpen.value = false;
    return;
  }
  if (
    event.key === "Backspace" &&
    !query.value &&
    selectedFilters.value.length
  ) {
    event.preventDefault();
    removeFilter(selectedFilters.value.at(-1)!.id);
    return;
  }
  if (!suggestionsOpen.value || !visibleSuggestions.value.length) return;

  if (event.key === "ArrowDown" || event.key === "ArrowUp") {
    event.preventDefault();
    const direction = event.key === "ArrowDown" ? 1 : -1;
    activeSuggestionIndex.value =
      (activeSuggestionIndex.value +
        direction +
        visibleSuggestions.value.length) %
      visibleSuggestions.value.length;
  } else if (event.key === "Enter") {
    event.preventDefault();
    addTextFilter(visibleSuggestions.value[activeSuggestionIndex.value]);
  }
}

function handleDocumentPointerDown(event: PointerEvent) {
  const target = event.target;
  if (
    rootElement.value?.contains(target as Node) ||
    (target instanceof Node &&
      [dateFromMenuId.value, dateToMenuId.value].some((menuId) =>
        document.getElementById(menuId)?.contains(target),
      ))
  ) {
    return;
  }
  suggestionsOpen.value = false;
  defaultFiltersOpen.value = false;
  dateRangeOpen.value = false;
}

onMounted(() =>
  document.addEventListener("pointerdown", handleDocumentPointerDown),
);
onBeforeUnmount(() =>
  document.removeEventListener("pointerdown", handleDocumentPointerDown),
);
</script>

<template>
  <div
    ref="rootElement"
    class="base-search-ql"
    :class="`base-search-ql--${size}`"
  >
    <div class="base-search-ql__bar">
      <BaseIcon
        name="search"
        :size="size"
        decorative
        class="base-search-ql__search-icon"
      />
      <div class="base-search-ql__search-area">
        <div
          v-for="filter in selectedFilters"
          :key="filter.id"
          class="base-search-ql__chip"
        >
          <span class="base-search-ql__chip-field">{{ filter.label }}</span>
          <span class="base-search-ql__chip-value">{{
            filter.displayValue
          }}</span>
          <BaseButton
            type="button"
            variant="ghost"
            size="icon"
            class="base-search-ql__remove"
            :aria-label="`${textLabels.removeFilterAriaLabel}: ${filter.label} ${filter.displayValue}`"
            :disabled="disabled"
            @click="removeFilter(filter.id)"
          >
            <BaseIcon name="close" size="sm" decorative />
          </BaseButton>
        </div>
        <div
          v-if="showDateRange && dateValue?.[0] && dateValue[1]"
          class="base-search-ql__chip"
        >
          <span class="base-search-ql__chip-field">{{
            textLabels.dateRangeLabel
          }}</span>
          <span class="base-search-ql__chip-value">{{
            formattedDateRange
          }}</span>
          <BaseButton
            v-if="!dateRangeRequired"
            type="button"
            variant="ghost"
            size="icon"
            class="base-search-ql__remove"
            :aria-label="`${textLabels.removeFilterAriaLabel}: ${textLabels.dateRangeLabel} ${formattedDateRange}`"
            :disabled="disabled"
            @click="removeDateRange"
          >
            <BaseIcon name="close" size="sm" decorative />
          </BaseButton>
        </div>
        <input
          :id="searchId"
          ref="searchInput"
          v-model="query"
          class="base-search-ql__input"
          type="search"
          role="combobox"
          :placeholder="textLabels.placeholder"
          :aria-label="textLabels.searchAriaLabel"
          :aria-expanded="suggestionsOpen"
          :aria-controls="suggestionsId"
          :aria-activedescendant="
            suggestionsOpen && visibleSuggestions.length
              ? `${suggestionsId}-option-${activeSuggestionIndex}`
              : undefined
          "
          :disabled="disabled"
          autocomplete="off"
          @focus="suggestionsOpen = Boolean(query.trim())"
          @keydown="handleSearchKeydown"
        />

        <ul
          v-if="suggestionsOpen"
          :id="suggestionsId"
          class="base-search-ql__suggestions"
          role="listbox"
          :aria-label="textLabels.searchAriaLabel"
        >
          <li
            v-for="(filter, index) in visibleSuggestions"
            :id="`${suggestionsId}-option-${index}`"
            :key="filter.name"
            role="option"
            :aria-selected="index === activeSuggestionIndex"
            :class="{
              'base-search-ql__suggestion--active':
                index === activeSuggestionIndex,
            }"
            class="base-search-ql__suggestion"
            @mouseenter="activeSuggestionIndex = index"
            @mousedown.prevent="addTextFilter(filter)"
          >
            {{ textLabels.searchSuggestionPrefix }}
            <strong>{{ filter.label }}</strong>
            {{ textLabels.searchSuggestionConnector }}
            <span>{{ query.trim() }}</span>
          </li>
          <li v-if="!visibleSuggestions.length" class="base-search-ql__empty">
            {{ textLabels.noResultsText }}
          </li>
        </ul>
      </div>

      <div v-if="defaultFilters.length" class="base-search-ql__filter-control">
        <BaseButton
          type="button"
          variant="ghost"
          :size="size"
          class="base-search-ql__filter-trigger"
          :aria-label="textLabels.defaultFiltersLabel"
          :aria-expanded="defaultFiltersOpen"
          :aria-controls="defaultFiltersId"
          :disabled="disabled"
          @click="toggleDefaultFilters"
        >
          <span class="base-search-ql__button-content">
            <BaseIcon
              name="tag"
              :size="size === 'lg' ? 'md' : 'sm'"
              decorative
            />
            <span>{{ textLabels.defaultFiltersLabel }}</span>
            <BaseIcon
              name="chevronDown"
              :size="size === 'lg' ? 'md' : 'sm'"
              decorative
            />
          </span>
        </BaseButton>
        <div
          v-if="defaultFiltersOpen"
          :id="defaultFiltersId"
          class="base-search-ql__filter-menu"
          role="region"
          :aria-label="textLabels.defaultFiltersLabel"
        >
          <div
            v-for="(column, columnIndex) in filterColumns"
            :key="columnIndex"
            class="base-search-ql__filter-column"
          >
            <section
              v-for="filter in column"
              :key="filter.name"
              class="base-search-ql__filter-group"
              :aria-labelledby="`${defaultFiltersId}-${filter.name}`"
            >
              <h3
                :id="`${defaultFiltersId}-${filter.name}`"
                class="base-search-ql__filter-heading"
              >
                {{ filter.label }}
              </h3>
              <BaseButton
                v-for="option in filter.options"
                :key="String(option.value)"
                type="button"
                variant="ghost"
                size="sm"
                class="base-search-ql__filter-option"
                :aria-pressed="
                  selectedFilters.some(
                    (selected) =>
                      selected.kind === 'default' &&
                      selected.name === filter.name &&
                      areValuesEqual(selected.value, option.value),
                  )
                "
                :disabled="disabled"
                @click="toggleDefaultOption(filter, option)"
              >
                <span class="base-search-ql__button-content">
                  <BaseIcon
                    v-if="
                      selectedFilters.some(
                        (selected) =>
                          selected.kind === 'default' &&
                          selected.name === filter.name &&
                          areValuesEqual(selected.value, option.value),
                      )
                    "
                    name="check"
                    size="sm"
                    decorative
                  />
                  <span
                    v-else
                    class="base-search-ql__option-indicator"
                    aria-hidden="true"
                  />
                  {{ option.label }}
                </span>
              </BaseButton>
            </section>
          </div>
        </div>
      </div>
      <div v-if="showDateRange" class="base-search-ql__date-control">
        <BaseButton
          type="button"
          variant="ghost"
          size="icon"
          class="base-search-ql__date-trigger"
          :aria-label="textLabels.dateRangeAriaLabel"
          :aria-expanded="dateRangeOpen"
          :aria-controls="`${searchId}-date-range`"
          :disabled="disabled"
          @click="toggleDateRange"
        >
          <BaseIcon
            name="calendar"
            :size="size === 'lg' ? 'md' : 'sm'"
            decorative
          />
        </BaseButton>
        <div
          v-if="dateRangeOpen"
          :id="`${searchId}-date-range`"
          class="base-search-ql__date-menu"
          role="region"
          :aria-label="textLabels.dateRangeAriaLabel"
        >
          <div class="base-search-ql__date-field">
            <BaseDateInput
              :id="dateFromInputId"
              :model-value="dateDraft?.[0]"
              :label="textLabels.dateFromLabel"
              :placeholder="textLabels.dateRangePlaceholder"
              size="sm"
              :disabled="disabled"
              :required="dateRangeRequired"
              :picker-props="{
                menuId: dateFromMenuId,
                floating: { placement: 'top-start', strategy: 'fixed' },
              }"
              @update:model-value="updateDateDraft(0, $event)"
            />
          </div>
          <div class="base-search-ql__date-field">
            <BaseDateInput
              :id="dateToInputId"
              :model-value="dateDraft?.[1]"
              :label="textLabels.dateToLabel"
              :placeholder="textLabels.dateRangePlaceholder"
              size="sm"
              :disabled="disabled"
              :required="dateRangeRequired"
              :picker-props="{
                menuId: dateToMenuId,
                floating: { placement: 'top-start', strategy: 'fixed' },
              }"
              @update:model-value="updateDateDraft(1, $event)"
            />
          </div>
          <div>
            <BaseButton
              type="button"
              variant="primary"
              size="sm"
              :disabled="disabled || !canAcceptDateRange"
              @click="acceptDateRange"
            >
              {{ textLabels.acceptDateRangeLabel }}
            </BaseButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.base-search-ql
  :is(
    .base-search-ql__remove,
    .base-search-ql__filter-trigger,
    .base-search-ql__filter-option,
    .base-search-ql__date-trigger
  ) {
  min-width: 0;
  min-height: 0;
  box-shadow: none;
  font-weight: inherit;
  line-height: inherit;
  transition: none;
}

.base-search-ql
  :is(
    .base-search-ql__remove,
    .base-search-ql__filter-trigger,
    .base-search-ql__filter-option,
    .base-search-ql__date-trigger
  ):hover:not(:disabled) {
  transform: none;
  box-shadow: none;
}

.base-search-ql__button-content {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
}

.base-search-ql--sm
  .base-search-ql__filter-trigger
  .base-search-ql__button-content {
  gap: var(--space-1);
}

.base-search-ql--lg
  .base-search-ql__filter-trigger
  .base-search-ql__button-content {
  gap: var(--space-3);
}

.base-search-ql {
  min-width: 0;
  color: var(--bs-color-text-body);
}

.base-search-ql__bar {
  position: relative;
  display: flex;
  box-sizing: border-box;
  min-height: calc(var(--control-height-md) - var(--space-1));
  align-items: center;
  gap: var(--space-2);
  padding: 0 var(--space-3);
  border: var(--border-width-thin) solid var(--bs-control-border);
  border-radius: var(--radius-md);
  background: var(--bs-control-background);
  transition:
    border-color var(--transition-fast),
    box-shadow var(--transition-fast);
}

.base-search-ql--sm .base-search-ql__bar {
  min-height: var(--control-height-sm);
  gap: var(--space-1);
  padding-right: var(--space-2);
  padding-left: var(--space-2);
}

.base-search-ql--lg .base-search-ql__bar {
  min-height: calc(var(--control-height-lg) + var(--space-2));
  gap: var(--space-3);
  padding-right: var(--space-4);
  padding-left: var(--space-4);
}

.base-search-ql__bar:hover:not(:focus-within):not(:has(:disabled)) {
  border-color: var(--bs-control-hover-border);
}

.base-search-ql__bar:focus-within,
.base-search-ql__bar:focus-within:hover {
  border-color: var(--bs-control-focus-border);
  background: var(--bs-control-focus-background);
  box-shadow: 0 0 0 var(--space-1) var(--bs-control-focus-shadow);
}

.base-search-ql__search-icon {
  color: var(--bs-color-text-muted);
}

.base-search-ql__search-area {
  position: relative;
  display: flex;
  min-width: 0;
  flex: 1;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--space-1);
}

.base-search-ql__input {
  box-sizing: border-box;
  min-width: 7rem;
  min-height: calc(var(--control-height-md) - var(--space-1));
  flex: 1 1 9rem;
  padding: var(--space-1);
  border: 0;
  outline: 0;
  color: inherit;
  background: transparent;
  font: inherit;
}

.base-search-ql--sm .base-search-ql__input {
  min-height: var(--control-height-sm);
  font-size: var(--font-size-xs);
}

.base-search-ql--lg .base-search-ql__input {
  min-height: calc(var(--control-height-lg) + var(--space-2));
  font-size: var(--font-size-md);
}

.base-search-ql__input:disabled {
  cursor: not-allowed;
}

.base-search-ql__input::placeholder {
  color: var(--bs-color-text-muted);
  opacity: 1;
}

.base-search-ql__chip {
  display: inline-flex;
  min-width: 0;
  align-items: center;
  gap: var(--space-1);
  padding: var(--space-1) var(--space-2);
  border: var(--border-width-thin) solid var(--bs-control-border);
  border-radius: var(--radius-sm);
  background: var(--bs-color-surface-subtle);
  font-size: var(--font-size-xs);
}

.base-search-ql--sm .base-search-ql__chip {
  gap: var(--space-1);
  padding: var(--space-1);
  font-size: var(--font-size-xs);
}

.base-search-ql--lg .base-search-ql__chip {
  gap: var(--space-2);
  padding: var(--space-2) var(--space-3);
  font-size: var(--font-size-sm);
}

.base-search-ql__chip-field {
  color: var(--bs-color-text-muted);
  font-weight: var(--font-weight-medium);
}

.base-search-ql__chip-value {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.base-search-ql .base-search-ql__remove {
  display: inline-grid;
  width: var(--space-4);
  height: var(--space-4);
  flex: 0 0 auto;
  place-items: center;
  padding: 0;
  border: 0;
  border-radius: var(--radius-sm);
  color: inherit;
  background: transparent;
  cursor: pointer;
}

.base-search-ql--sm .base-search-ql__remove {
  width: var(--space-3);
  height: var(--space-3);
}

.base-search-ql--lg .base-search-ql__remove {
  width: var(--space-5);
  height: var(--space-5);
}

.base-search-ql .base-search-ql__remove:hover:not(:disabled) {
  color: var(--bs-color-action-danger);
  background: transparent;
}

.base-search-ql .base-search-ql__remove:focus-visible,
.base-search-ql .base-search-ql__filter-trigger:focus-visible,
.base-search-ql .base-search-ql__filter-option:focus-visible,
.base-search-ql .base-search-ql__date-trigger:focus-visible {
  outline: var(--focus-outline-width) solid var(--bs-color-focus-ring);
  outline-offset: var(--focus-outline-offset);
}

.base-search-ql .base-search-ql__remove:disabled,
.base-search-ql .base-search-ql__filter-trigger:disabled,
.base-search-ql .base-search-ql__filter-option:disabled,
.base-search-ql .base-search-ql__date-trigger:disabled {
  cursor: not-allowed;
  opacity: var(--opacity-disabled);
}

.base-search-ql__filter-control {
  position: relative;
  flex: 0 0 auto;
}

.base-search-ql__date-control {
  position: relative;
  flex: 0 0 auto;
}

.base-search-ql .base-search-ql__filter-trigger {
  display: inline-flex;
  box-sizing: border-box;
  min-height: calc(var(--control-height-md) - var(--space-1));
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-1) var(--space-2);
  border: 0;
  border-radius: var(--radius-sm);
  color: var(--bs-color-text-body);
  background: transparent;
  font: inherit;
  cursor: pointer;
}

.base-search-ql--sm .base-search-ql__filter-trigger {
  min-height: var(--control-height-sm);
  gap: var(--space-1);
  padding: var(--space-1);
  font-size: var(--font-size-xs);
}

.base-search-ql--lg .base-search-ql__filter-trigger {
  min-height: calc(var(--control-height-lg) + var(--space-2));
  gap: var(--space-3);
  padding: var(--space-2) var(--space-3);
  font-size: var(--font-size-md);
}

.base-search-ql .base-search-ql__date-trigger {
  display: inline-grid;
  box-sizing: border-box;
  width: calc(var(--control-height-md) - var(--space-1));
  min-height: calc(var(--control-height-md) - var(--space-1));
  place-items: center;
  padding: var(--space-1);
  border: 0;
  border-radius: var(--radius-sm);
  color: var(--bs-color-text-body);
  background: transparent;
  cursor: pointer;
}

.base-search-ql--sm .base-search-ql__date-trigger {
  width: var(--control-height-sm);
  min-height: var(--control-height-sm);
}

.base-search-ql--lg .base-search-ql__date-trigger {
  width: calc(var(--control-height-lg) + var(--space-2));
  min-height: calc(var(--control-height-lg) + var(--space-2));
}

.base-search-ql .base-search-ql__filter-trigger:hover:not(:disabled),
.base-search-ql .base-search-ql__filter-trigger[aria-expanded="true"] {
  background: var(--bs-color-surface-subtle);
}

.base-search-ql .base-search-ql__date-trigger:hover:not(:disabled),
.base-search-ql .base-search-ql__date-trigger[aria-expanded="true"] {
  background: var(--bs-color-surface-subtle);
}

.base-search-ql__suggestions,
.base-search-ql__filter-menu {
  position: absolute;
  z-index: var(--layer-dropdown, 70);
  margin: 0;
  padding: var(--space-1);
  border: var(--border-width-thin) solid var(--bs-control-border);
  border-radius: var(--radius-md);
  background: var(--bs-overlay-background);
  box-shadow: var(--shadow-md);
}

.base-search-ql__date-menu {
  position: absolute;
  z-index: var(--layer-dropdown, 70);
  top: calc(100% + var(--space-2));
  right: 0;
  width: min(22rem, calc(100vw - var(--space-8)));
  max-height: min(75vh, 42rem);
  overflow: auto;
  padding: var(--space-2);
  border: var(--border-width-thin) solid var(--bs-control-border);
  border-radius: var(--radius-md);
  background: var(--bs-overlay-background);
  box-shadow: var(--shadow-md);
}

.base-search-ql__date-menu :deep(.base-date-picker) {
  gap: var(--space-2);
}

.base-search-ql__date-field + .base-search-ql__date-field {
  margin-top: var(--space-2);
}

.base-search-ql__date-menu > div:last-child {
  margin-top: var(--space-2);
  text-align: right;
}

.base-search-ql__suggestions {
  top: calc(100% + var(--space-2));
  left: 0;
  width: min(100%, 28rem);
  max-height: 18rem;
  overflow-y: auto;
  list-style: none;
}

.base-search-ql__suggestion,
.base-search-ql__empty {
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-sm);
  color: var(--bs-color-text-body);
  font-size: var(--font-size-sm);
}

.base-search-ql__suggestion {
  cursor: pointer;
}

.base-search-ql__suggestion:hover,
.base-search-ql__suggestion--active {
  background: var(--bs-color-surface-muted);
}

.base-search-ql__suggestion span {
  color: var(--bs-color-text-muted);
}

.base-search-ql__empty {
  color: var(--bs-color-text-muted);
}

.base-search-ql__filter-menu {
  top: calc(100% + var(--space-2));
  right: 0;
  display: grid;
  width: min(34rem, calc(100vw - var(--space-8)));
  max-height: min(70vh, 30rem);
  grid-auto-columns: minmax(0, 1fr);
  grid-auto-flow: column;
  gap: var(--space-3);
  overflow: auto;
}

.base-search-ql__filter-column {
  min-width: 0;
}

.base-search-ql__filter-group + .base-search-ql__filter-group {
  margin-top: var(--space-2);
  padding-top: var(--space-2);
  border-top: var(--border-width-thin) solid var(--bs-color-border-default);
}

.base-search-ql__filter-heading {
  margin: 0;
  padding: var(--space-2) var(--space-3) var(--space-1);
  color: var(--bs-color-text-muted);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
}

.base-search-ql .base-search-ql__filter-option {
  display: flex;
  justify-content: flex-start;
  width: 100%;
  min-height: var(--control-height-sm);
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-3);
  border: 0;
  border-radius: var(--radius-sm);
  color: var(--bs-color-text-body);
  background: transparent;
  text-align: left;
  font: inherit;
  cursor: pointer;
}

.base-search-ql .base-search-ql__filter-option:hover:not(:disabled),
.base-search-ql .base-search-ql__filter-option[aria-pressed="true"] {
  background: var(--bs-color-surface-muted);
}

.base-search-ql
  .base-search-ql__filter-option[aria-pressed="true"]
  :deep(.base-icon) {
  color: var(--bs-color-brand-primary);
}

.base-search-ql__option-indicator {
  width: var(--icon-size-sm);
  height: var(--icon-size-sm);
  flex: 0 0 auto;
}

@media (max-width: 40rem) {
  .base-search-ql__bar {
    flex-wrap: wrap;
  }

  .base-search-ql__search-area {
    flex-basis: calc(100% - var(--icon-size-md) - var(--space-4));
    order: 1;
  }

  .base-search-ql__filter-control {
    order: 2;
    margin-left: auto;
  }

  .base-search-ql__filter-menu {
    grid-auto-columns: minmax(12rem, 1fr);
    grid-auto-flow: row;
    right: calc(-1 * var(--space-3));
    width: min(22rem, calc(100vw - var(--space-8)));
  }
}
</style>
