<script setup lang="ts">
import { ref } from "vue";

import {
  BaseTable,
  BaseText,
  type BaseTableColumn,
  type BaseTableRow,
  type BaseTableSort,
} from "../../../src/index";

const page = ref(1);
const sort = ref<BaseTableSort | null>(null);
const selectedRows = ref<BaseTableRow[]>([]);
const rows = ref<BaseTableRow[]>([
  {
    id: 1,
    reference: "NP-1042",
    customer: "María López",
    status: "En tránsito",
  },
  {
    id: 2,
    reference: "NP-1043",
    customer: "Carlos Pérez",
    status: "Entregado",
  },
  { id: 3, reference: "NP-1044", customer: "Ana Ruiz", status: "Pendiente" },
  {
    id: 4,
    reference: "NP-1045",
    customer: "Luis Gómez",
    status: "En tránsito",
  },
  { id: 5, reference: "NP-1046", customer: "Elena Díaz", status: "Entregado" },
]);

const columns: BaseTableColumn[] = [
  { key: "reference", label: "Referencia", sortable: true, required: true },
  { key: "customer", label: "Cliente", sortable: true, required: true },
  { key: "status", label: "Estado", sortable: true },
];

function handleAdd(row: BaseTableRow, resetDraft: () => void) {
  rows.value = [...rows.value, { ...row, id: Date.now() }];
  resetDraft();
}

function handleEdit(row: BaseTableRow, finishEditing: () => void) {
  rows.value = rows.value.map((current) =>
    current.id === row.id ? row : current,
  );
  finishEditing();
}

function handleDelete(rowToDelete: BaseTableRow) {
  rows.value = rows.value.filter((row) => row.id !== rowToDelete.id);
  selectedRows.value = selectedRows.value.filter(
    (row) => row.id !== rowToDelete.id,
  );
}
</script>

<template>
  <BaseTable
    v-model:page="page"
    v-model:sort="sort"
    v-model:selected-rows="selectedRows"
    :rows="rows"
    :columns="columns"
    :total-items="rows.length"
    :page-size="3"
    row-key="id"
    caption="Envíos de demostración"
    selectable
    addable
    editable
    deletable
    @add="handleAdd"
    @edit="handleEdit"
    @delete="handleDelete"
  >
    <template #cell-reference="{ value }">
      <BaseText color="heading" weight="bold">{{ value }}</BaseText>
    </template>
    <template #selection-summary="{ selectedCount }">
      <BaseText variant="label" color="heading">
        {{ selectedCount }} filas seleccionadas
      </BaseText>
    </template>
  </BaseTable>
</template>
