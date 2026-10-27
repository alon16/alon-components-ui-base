<script setup>
import { computed, ref, watch } from "vue";

import BaseCheckbox from "./BaseCheckbox.vue";
import BaseIcon from "./BaseIcon.vue";
import { loading as vLoading } from "../directives/loading";
import { useBaseTableCrud } from "../composables/useBaseTableCrud";

const alignments = ["left", "center", "right"];

const props = defineProps({
  rows: {
    type: Array,
    required: true,
  },
  columns: {
    type: Array,
    required: true,
  },
  totalItems: {
    type: Number,
    required: true,
    validator: (value) => Number.isInteger(value) && value >= 0,
  },
  pageSize: {
    type: Number,
    required: true,
    validator: (value) => Number.isInteger(value) && value > 0,
  },
  page: {
    type: Number,
    default: 1,
    validator: (value) => Number.isInteger(value) && value > 0,
  },
  paginationMode: {
    type: String,
    default: "local",
    validator: (value) => ["local", "remote"].includes(value),
  },
  paginationStyle: {
    type: String,
    default: "default",
    validator: (value) => ["default", "floating"].includes(value),
  },
  rowKey: {
    type: [String, Function],
    default: "id",
  },
  loading: Boolean,
  caption: {
    type: String,
    default: "",
  },
  emptyText: {
    type: String,
    default: "No hay elementos para mostrar.",
  },
  sort: {
    type: Object,
    default: null,
  },
  selectable: Boolean,
  selectedRows: {
    type: Array,
    default: () => [],
  },
  clearSelectionOnPageChange: {
    type: Boolean,
    default: false,
  },
  addable: Boolean,
  editable: Boolean,
  deletable: Boolean,
});

const emit = defineEmits([
  "update:page",
  "page-change",
  "update:sort",
  "sort-change",
  "update:selectedRows",
  "selection-change",
  "add",
  "add-invalid",
  "add-start",
  "add-cancel",
  "edit",
  "edit-start",
  "edit-cancel",
  "delete",
]);

const sortState = ref(props.sort);

const {
  addDraftRow,
  addErrors,
  adding,
  cancelAdd,
  cancelEdit,
  deleteRow,
  editDraftRow,
  editingRowKey,
  isEditing,
  originalEditingRow,
  saveAdd,
  saveEdit,
  startEdit,
} = useBaseTableCrud(props, emit, resolveValue, resolveRowKey);

const hasRowActions = computed(
  () => props.addable || props.editable || props.deletable
);

const normalizedColumns = computed(() => [
  ...props.columns.map((column) => {
    const align = alignments.includes(column.align) ? column.align : "left";
    const headerAlign = alignments.includes(column.headerAlign)
      ? column.headerAlign
      : align;

    return {
      ...column,
      align,
      headerAlign,
    };
  }),
  ...(hasRowActions.value &&
  !props.columns.some((column) => column.key === "actions")
    ? [{ key: "actions", label: "", align: "right", headerAlign: "right" }]
    : []),
]);

const totalPages = computed(() =>
  Math.max(1, Math.ceil(props.totalItems / props.pageSize))
);
const currentPage = computed(() =>
  Math.min(Math.max(props.page, 1), totalPages.value)
);
const rowOffset = computed(() => (currentPage.value - 1) * props.pageSize);
const sortedRows = computed(() => {
  if (props.paginationMode === "remote" || !sortState.value?.key)
    return props.rows;

  const column = normalizedColumns.value.find(
    (item) => item.key === sortState.value.key
  );
  if (!column) return props.rows;

  return [...props.rows].sort((firstRow, secondRow) => {
    const result = compareValues(
      resolveValue(firstRow, column),
      resolveValue(secondRow, column)
    );
    return sortState.value.direction === "desc" ? -result : result;
  });
});
const visibleRows = computed(() => {
  if (props.paginationMode === "remote") return props.rows;
  return sortedRows.value.slice(
    rowOffset.value,
    rowOffset.value + props.pageSize
  );
});
const visibleCount = computed(() => visibleRows.value.length);
const summaryStart = computed(() =>
  props.totalItems && visibleCount.value ? rowOffset.value + 1 : 0
);
const summaryEnd = computed(() =>
  visibleCount.value
    ? Math.min(summaryStart.value + visibleCount.value - 1, props.totalItems)
    : 0
);
const selectedKeys = computed(
  () => new Set(props.selectedRows.map((row) => resolveRowKey(row)))
);
const visibleSelectedCount = computed(
  () => visibleRows.value.filter((row) => isRowSelected(row)).length
);
const allVisibleSelected = computed(
  () =>
    visibleCount.value > 0 && visibleSelectedCount.value === visibleCount.value
);
const someVisibleSelected = computed(
  () => visibleSelectedCount.value > 0 && !allVisibleSelected.value
);
const selectedCount = computed(() => props.selectedRows.length);

const paginationItems = computed(() => {
  const lastPage = totalPages.value;
  if (lastPage <= 7) {
    return Array.from({ length: lastPage }, (_, index) => ({
      type: "page",
      key: `page-${index + 1}`,
      page: index + 1,
    }));
  }

  const pages = new Set([
    1,
    lastPage,
    currentPage.value - 1,
    currentPage.value,
    currentPage.value + 1,
  ]);

  if (currentPage.value <= 4) {
    pages.add(2);
    pages.add(3);
    pages.add(4);
  }

  if (currentPage.value >= lastPage - 3) {
    pages.add(lastPage - 3);
    pages.add(lastPage - 2);
    pages.add(lastPage - 1);
  }

  const validPages = [...pages]
    .filter((page) => page >= 1 && page <= lastPage)
    .sort((a, b) => a - b);
  const items = [];

  validPages.forEach((page, index) => {
    const previousPage = validPages[index - 1];
    if (previousPage && page - previousPage > 1) {
      items.push({ type: "ellipsis", key: `ellipsis-${previousPage}-${page}` });
    }
    items.push({ type: "page", key: `page-${page}`, page });
  });

  return items;
});

watch(
  [() => props.page, totalPages, () => props.loading],
  () => {
    if (!props.loading && props.page !== currentPage.value)
      emitPageChange(currentPage.value);
  },
  { immediate: true }
);

watch(
  () => props.sort,
  (value) => {
    sortState.value = value;
  }
);

watch(
  () => props.page,
  (value, oldValue) => {
    if (!props.clearSelectionOnPageChange || value === oldValue) return;
    updateSelection([]);
  }
);

function emitPageChange(page) {
  emit("update:page", page);
  emit("page-change", { page, pageSize: props.pageSize });
}

function goToPage(page) {
  const nextPage = Math.min(Math.max(page, 1), totalPages.value);
  if (props.loading || nextPage === currentPage.value) return;
  emitPageChange(nextPage);
}

function resolveValue(row, column) {
  if (typeof column.field === "function") return column.field(row);
  return row?.[column.field ?? column.key];
}

function compareValues(firstValue, secondValue) {
  const firstEmpty =
    firstValue === null || firstValue === undefined || firstValue === "";
  const secondEmpty =
    secondValue === null || secondValue === undefined || secondValue === "";

  if (firstEmpty && secondEmpty) return 0;
  if (firstEmpty) return 1;
  if (secondEmpty) return -1;
  if (typeof firstValue === "number" && typeof secondValue === "number") {
    return firstValue - secondValue;
  }

  return String(firstValue).localeCompare(String(secondValue), "es", {
    numeric: true,
    sensitivity: "base",
  });
}

function sortDirection(column) {
  if (sortState.value?.key !== column.key) return "none";
  return sortState.value.direction === "desc" ? "descending" : "ascending";
}

function sortLabel(column) {
  const direction = sortDirection(column);
  if (direction === "ascending") return `Orden descendente por ${column.label}`;
  if (direction === "descending") return `Quitar orden por ${column.label}`;
  return `Ordenar por ${column.label}`;
}

function toggleSort(column) {
  if (props.loading || !column.sortable) return;

  const nextSort =
    sortState.value?.key !== column.key
      ? { key: column.key, direction: "asc" }
      : sortState.value.direction === "asc"
      ? { key: column.key, direction: "desc" }
      : null;

  sortState.value = nextSort;
  emit("update:sort", nextSort);
  emit("sort-change", nextSort);
}

function isRowSelected(row) {
  return selectedKeys.value.has(resolveRowKey(row));
}

function updateSelection(rows) {
  emit("update:selectedRows", rows);
  emit("selection-change", rows);
}

function toggleRowSelection(row, selected) {
  const rowKey = resolveRowKey(row);
  const nextSelection = props.selectedRows.filter(
    (selectedRow) => resolveRowKey(selectedRow) !== rowKey
  );

  if (selected) nextSelection.push(row);
  updateSelection(nextSelection);
}

function toggleVisibleSelection(selected) {
  const visibleKeys = new Set(
    visibleRows.value.map((row) => resolveRowKey(row))
  );
  const nextSelection = props.selectedRows.filter(
    (row) => !visibleKeys.has(resolveRowKey(row))
  );

  if (selected) nextSelection.push(...visibleRows.value);
  updateSelection(nextSelection);
}

function formatValue(row, column, rowIndex) {
  const value = resolveValue(row, column);
  const formatted = column.formatter?.(value, row, rowIndex) ?? value;
  return formatted ?? "";
}

function resolveRowKey(row, index) {
  if (typeof props.rowKey === "function") return props.rowKey(row, index);
  return row?.[props.rowKey] ?? index;
}

function absoluteRowIndex(index) {
  return rowOffset.value + index;
}
</script>

<template>
  <div
    class="base-table"
    :class="{
      'base-table--add-row-empty': adding && !visibleRows.length,
      'base-table--floating-pagination': paginationStyle === 'floating',
    }"
    :aria-busy="loading || undefined"
  >
    <div v-loading="loading" class="base-table__content">
      <div class="base-table__scroll">
        <table class="base-table__table">
          <caption class="sr-only">
            {{
              caption
            }}
          </caption>
          <thead>
            <tr>
              <th
                v-if="selectable"
                class="base-table__selection-cell"
                scope="col"
              >
                <BaseCheckbox
                  :model-value="allVisibleSelected"
                  :indeterminate="someVisibleSelected"
                  :disabled="loading || !visibleCount"
                  aria-label="Seleccionar todas las filas visibles"
                  @update:model-value="toggleVisibleSelection"
                />
              </th>
              <th
                v-for="column in normalizedColumns"
                :key="column.key"
                scope="col"
                :class="`base-table__cell--${column.headerAlign}`"
                :aria-sort="column.sortable ? sortDirection(column) : undefined"
              >
                <button
                  v-if="column.sortable"
                  class="base-table__sort-button"
                  type="button"
                  :disabled="loading"
                  :aria-label="sortLabel(column)"
                  @click="toggleSort(column)"
                >
                  <slot :name="`header-${column.key}`" :column="column">
                    {{ column.label }}
                  </slot>
                  <BaseIcon
                    name="sort"
                    size="sm"
                    decorative
                    :class="`base-table__sort-icon--${sortDirection(column)}`"
                  />
                </button>
                <slot v-else :name="`header-${column.key}`" :column="column">
                  {{ column.label }}
                </slot>
              </th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-if="adding"
              class="base-table__add-row"
              :class="{ 'base-table__add-row--empty': !visibleRows.length }"
            >
              <td v-if="selectable" class="base-table__selection-cell"></td>
              <td
                v-for="column in normalizedColumns"
                :key="column.key"
                :class="`base-table__cell--${column.align}`"
              >
                <slot
                  v-if="column.key !== 'actions'"
                  :name="`add-cell-${column.key}`"
                  :row="addDraftRow"
                  :column="column"
                  :cancel="cancelAdd"
                  :required="Boolean(column.required)"
                  :invalid="Boolean(addErrors[column.key])"
                  :error="addErrors[column.key] || ''"
                />
                <div v-else class="base-table__row-actions">
                  <button
                    class="base-table__icon-button"
                    type="button"
                    aria-label="Agregar nuevo registro"
                    title="Agregar"
                    :disabled="loading"
                    @click="saveAdd"
                  >
                    <BaseIcon name="plus" size="sm" decorative />
                  </button>
                </div>
              </td>
            </tr>

            <tr v-if="!visibleRows.length && !adding">
              <td
                class="base-table__state"
                :colspan="normalizedColumns.length + (selectable ? 1 : 0)"
              >
                <slot name="empty">{{ emptyText }}</slot>
              </td>
            </tr>

            <template v-else>
              <tr
                v-for="(row, visibleIndex) in visibleRows"
                :key="resolveRowKey(row, absoluteRowIndex(visibleIndex))"
                :class="{
                  'base-table__row--editing': isEditing(
                    row,
                    absoluteRowIndex(visibleIndex)
                  ),
                }"
              >
                <td v-if="selectable" class="base-table__selection-cell">
                  <BaseCheckbox
                    :model-value="isRowSelected(row)"
                    :disabled="loading"
                    :aria-label="`Seleccionar fila ${resolveRowKey(
                      row,
                      absoluteRowIndex(visibleIndex)
                    )}`"
                    @update:model-value="toggleRowSelection(row, $event)"
                  />
                </td>
                <td
                  v-for="column in normalizedColumns"
                  :key="column.key"
                  :class="`base-table__cell--${column.align}`"
                >
                  <template
                    v-if="isEditing(row, absoluteRowIndex(visibleIndex))"
                  >
                    <slot
                      v-if="column.key !== 'actions'"
                      :name="`edit-cell-${column.key}`"
                      :row="editDraftRow"
                      :original-row="originalEditingRow"
                      :value="resolveValue(editDraftRow, column)"
                      :row-index="absoluteRowIndex(visibleIndex)"
                      :column="column"
                      :cancel="cancelEdit"
                    >
                      {{
                        formatValue(
                          editDraftRow,
                          column,
                          absoluteRowIndex(visibleIndex)
                        )
                      }}
                    </slot>
                    <div v-else class="base-table__row-actions">
                      <button
                        class="base-table__icon-button"
                        type="button"
                        aria-label="Guardar cambios"
                        title="Guardar"
                        :disabled="loading"
                        @click="saveEdit"
                      >
                        <BaseIcon name="check" size="sm" decorative />
                      </button>
                      <button
                        class="base-table__icon-button"
                        type="button"
                        aria-label="Cancelar edición"
                        title="Cancelar"
                        :disabled="loading"
                        @click="cancelEdit"
                      >
                        <BaseIcon name="close" size="sm" decorative />
                      </button>
                    </div>
                  </template>
                  <slot
                    v-else
                    :name="`cell-${column.key}`"
                    :row="row"
                    :value="resolveValue(row, column)"
                    :row-index="absoluteRowIndex(visibleIndex)"
                    :column="column"
                    :start-edit="
                      () => startEdit(row, absoluteRowIndex(visibleIndex))
                    "
                    :delete-row="() => deleteRow(row)"
                  >
                    <template v-if="column.key === 'actions' && hasRowActions">
                      <div class="base-table__row-actions">
                        <button
                          v-if="editable"
                          class="base-table__icon-button"
                          type="button"
                          :disabled="loading || editingRowKey !== null"
                          :aria-label="`Editar fila ${resolveRowKey(
                            row,
                            absoluteRowIndex(visibleIndex)
                          )}`"
                          title="Editar"
                          @click="
                            startEdit(row, absoluteRowIndex(visibleIndex))
                          "
                        >
                          <BaseIcon name="edit" size="sm" decorative />
                        </button>
                        <button
                          v-if="deletable"
                          class="base-table__icon-button"
                          type="button"
                          :disabled="loading || editingRowKey !== null"
                          :aria-label="`Eliminar fila ${resolveRowKey(
                            row,
                            absoluteRowIndex(visibleIndex)
                          )}`"
                          title="Eliminar"
                          @click="deleteRow(row)"
                        >
                          <BaseIcon name="trash" size="sm" decorative />
                        </button>
                      </div>
                    </template>
                    <template v-else>
                      {{
                        formatValue(row, column, absoluteRowIndex(visibleIndex))
                      }}
                    </template>
                  </slot>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>

    <nav
      v-if="paginationStyle === 'floating'"
      v-show="totalItems"
      class="base-table__floating-pagination"
      aria-label="Paginación de la tabla"
    >
      <button
        class="base-table__floating-button"
        type="button"
        :disabled="loading || currentPage === 1"
        aria-label="Ir a la página anterior"
        @click="goToPage(currentPage - 1)"
      >
        <BaseIcon name="chevronLeft" size="sm" decorative />
      </button>
      <p class="base-table__floating-summary" aria-live="polite">
        <slot
          name="pagination-summary"
          :start="summaryStart"
          :end="summaryEnd"
          :visible-count="visibleCount"
          :total-items="totalItems"
        >
          {{ summaryStart }}–{{ summaryEnd }} de {{ totalItems }}
        </slot>
      </p>
      <button
        class="base-table__floating-button"
        type="button"
        :disabled="loading || currentPage === totalPages"
        aria-label="Ir a la página siguiente"
        @click="goToPage(currentPage + 1)"
      >
        <BaseIcon name="chevronRight" size="sm" decorative />
      </button>
    </nav>

    <footer v-else class="base-table__footer">
      <div class="base-table__summaries">
        <p class="base-table__summary" aria-live="polite">
          <slot
            name="pagination-summary"
            :start="summaryStart"
            :end="summaryEnd"
            :visible-count="visibleCount"
            :total-items="totalItems"
          >
            Mostrando {{ visibleCount }} de {{ totalItems }} elementos
          </slot>
        </p>

        <p
          v-if="selectable"
          class="base-table__selection-summary"
          aria-live="polite"
        >
          <slot name="selection-summary" :selected-count="selectedCount">
            {{ selectedCount }} seleccionados
          </slot>
        </p>
      </div>

      <nav
        v-if="totalItems"
        class="base-table__pagination"
        aria-label="Paginación de la tabla"
      >
        <button
          class="base-table__page-button"
          type="button"
          :disabled="loading || currentPage === 1"
          aria-label="Ir a la página anterior"
          @click="goToPage(currentPage - 1)"
        >
          <BaseIcon name="chevronLeft" size="sm" decorative />
        </button>

        <template v-for="item in paginationItems" :key="item.key">
          <span
            v-if="item.type === 'ellipsis'"
            class="base-table__ellipsis"
            aria-hidden="true"
          >
            …
          </span>
          <button
            v-else
            class="base-table__page-button"
            :class="{
              'base-table__page-button--active': item.page === currentPage,
            }"
            type="button"
            :disabled="loading"
            :aria-current="item.page === currentPage ? 'page' : undefined"
            :aria-label="`Ir a la página ${item.page}`"
            @click="goToPage(item.page)"
          >
            {{ item.page }}
          </button>
        </template>

        <button
          class="base-table__page-button"
          type="button"
          :disabled="loading || currentPage === totalPages"
          aria-label="Ir a la página siguiente"
          @click="goToPage(currentPage + 1)"
        >
          <BaseIcon name="chevronRight" size="sm" decorative />
        </button>
      </nav>
    </footer>
  </div>
</template>

<style scoped src="../styles/BaseTable.css"></style>
