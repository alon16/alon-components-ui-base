<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from "vue";

import {
  BaseAutocomplete,
  BaseAlert,
  BaseBadge,
  BaseBreadcrumb,
  BaseButton,
  BaseCard,
  BaseCheckbox,
  BaseConfirmDialog,
  BaseDateInput,
  BaseDatePicker,
  BaseDateTimeInput,
  BaseDialog,
  BaseDropdownMenu,
  BaseFieldInfo,
  BaseFormColumns,
  BaseFormRow,
  BaseFormSection,
  BaseIcon,
  BaseHeading,
  BaseInput,
  BaseLink,
  BasePhoneInput,
  BaseMonthInput,
  BaseRadio,
  BaseRadioGroup,
  BaseSelect,
  BaseSearchQL,
  BaseSignature,
  BaseStepper,
  BaseSwitch,
  BaseTable,
  BaseTabs,
  BaseText,
  BaseTextarea,
  BaseToast,
  BaseYearInput,
  loading as vLoading,
  type BaseTableColumn,
  type BaseTableRow,
  type BaseTableSort,
  type BaseSearchQLChange,
  type DateRangeValue,
} from "../src/index";

type Theme = "light" | "dark";

const requestedTheme = new URLSearchParams(window.location.search).get("theme");
const theme = ref<Theme>(
  requestedTheme === "dark" || requestedTheme === "light"
    ? requestedTheme
    : window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light",
);
const activeTab = ref("overview");
const breadcrumbs = [
  { name: "Inicio", to: { name: "home" } },
  { name: "Configuración", to: { path: "/settings" } },
  { name: "Direcciones", to: { name: "address-book", query: { page: 1 } } },
  { name: "Editar dirección" },
];
const currentStep = ref("details");
const dialogOpen = ref(false);
const confirmOpen = ref(false);
const toastOpen = ref(false);
type ToastTone = "success" | "info" | "warning" | "danger";
const toastTone = ref<ToastTone>("success");
const toastTitle = ref("Cambios guardados");
const toastDescription = ref("Tu información se actualizó correctamente.");
const loadingExample = ref(false);
const lastAction = ref("Todavía no hay eventos registrados.");

const name = ref("Ada Lovelace");
const password = ref("secreto");
const phone = ref("+34612345678");
const phoneWithoutFlags = ref("+50588888888");
const phoneCountries = [
  { name: "España", prefix: "+34", iso2: "ES", flag: "🇪🇸" },
  { name: "Nicaragua", prefix: "+505", iso2: "NI", flag: "🇳🇮" },
  { name: "Estados Unidos", prefix: "+1", iso2: "US", flag: "🇺🇸" },
];
const notes = ref("Los componentes pueden probarse sin publicar el paquete.");
const accepted = ref(true);
const indeterminate = ref(false);
const notificationType = ref("email");
const radioGroupValue = ref("email");
const radioPositionExample = ref("end");
const radioSizeExample = ref("sm");
const notifications = ref(true);
const smallSwitchExample = ref(false);
const mediumSwitchExample = ref(true);
const smallCheckboxExample = ref(false);
const mediumCheckboxExample = ref(true);
const spacingRadio = ref("radio");
const spacingSwitch = ref(false);
const iconNames = [
  "logo",
  "menu",
  "moreVertical",
  "settings",
  "close",
  "search",
  "clipboard",
  "copy",
  "printer",
  "send",
  "support",
  "building",
  "home",
  "map",
  "arrowLeft",
  "arrowRight",
  "download",
  "plus",
  "trash",
  "facebook",
  "twitter",
  "loader",
  "chevronDown",
  "chevronLeft",
  "chevronRight",
  "sort",
  "check",
  "location",
  "weight",
  "edit",
  "grid",
  "list",
  "shield",
  "user",
  "circleUser",
  "bolt",
  "clock",
  "package",
  "truck",
  "circleCheck",
  "circleX",
  "alertTriangle",
  "calendar",
  "tag",
  "info",
  "lock",
  "eye",
  "eyeOff",
  "help",
  "receipt",
  "piggyBank",
  "camera",
  "monitor",
  "smartphone",
  "card",
  "cart",
  "bank",
  "bell",
  "mail",
  "message",
];
const country = ref("ni");
const selectedCountries = ref<string[]>([
  "ni",
  "cr",
  "sv",
  "hn",
  "pa",
  "mx",
  "co",
]);
const selectedCountriesNoCreate = ref<string[]>(["ni", "cr"]);
const city = ref<unknown>(null);
const signature = ref<string | null>(null);
const searchQLSelection = ref<BaseSearchQLChange[]>([]);
function createSearchQLPreset(): BaseSearchQLChange[] {
  return [
    { name: "reference", value: "HTK-1042" },
    { name: "customer", value: ".*Ada.*" },
    { name: "status", value: "pending" },
  ];
}
const searchQLModelSelection = ref<BaseSearchQLChange[]>(
  createSearchQLPreset(),
);
const searchQLOptionalDateRange = ref<DateRangeValue>(null);
const searchQLToday = new Date();
const searchQLOneWeekAgo = new Date(searchQLToday);
searchQLOneWeekAgo.setDate(searchQLOneWeekAgo.getDate() - 7);
const searchQLDateRange = ref<DateRangeValue>([
  searchQLOneWeekAgo,
  searchQLToday,
]);
function loadSearchQLPreset() {
  searchQLModelSelection.value = createSearchQLPreset();
  searchQLOptionalDateRange.value = [
    new Date(searchQLOneWeekAgo),
    new Date(searchQLToday),
  ];
}

function clearSearchQLPreset() {
  searchQLModelSelection.value = [];
  searchQLOptionalDateRange.value = null;
}
const searchQLTextFilters = [
  { name: "reference", label: "Referencia", regex: false },
  { name: "customer", label: "Cliente", regex: true },
  { name: "email", label: "Correo electrónico", regex: true },
];
const searchQLDefaultFilters = [
  {
    name: "status",
    label: "Estado",
    options: [
      { value: "pending", label: "Pendiente" },
      { value: "transit", label: "En tránsito" },
      { value: "delivered", label: "Entregado" },
    ],
  },
  {
    name: "type",
    label: "Tipo de envío",
    options: [
      { value: "standard", label: "Estándar" },
      { value: "express", label: "Exprés" },
    ],
  },
  {
    name: "paymentStatus",
    label: "Estado de pago",
    options: [
      { value: "unpaid", label: "Por pagar" },
      { value: "paid", label: "Pagado" },
    ],
  },
];

const date = ref<Date | null>(new Date());
const dateTime = ref<Date | null>(new Date());
const month = ref<{ month: number; year: number } | null>(null);
const year = ref<number | null>(new Date().getFullYear());
const lowLevelDate = ref<Date | null>(null);

const page = ref(1);
const sort = ref<BaseTableSort | null>(null);
const selectedRows = ref<BaseTableRow[]>([]);
const rows = ref<BaseTableRow[]>([
  {
    id: 1,
    reference: "HTK-1042",
    customer: "María López",
    status: "En tránsito",
  },
  {
    id: 2,
    reference: "HTK-1043",
    customer: "Carlos Pérez",
    status: "Entregado",
  },
  { id: 3, reference: "HTK-1044", customer: "Ana Ruiz", status: "Pendiente" },
  {
    id: 4,
    reference: "HTK-1045",
    customer: "Luis Gómez",
    status: "En tránsito",
  },
  { id: 5, reference: "HTK-1046", customer: "Elena Díaz", status: "Entregado" },
]);

const columns: BaseTableColumn[] = [
  { key: "reference", label: "Referencia", sortable: true, required: true },
  { key: "customer", label: "Cliente", sortable: true, required: true },
  { key: "status", label: "Estado", sortable: true },
];

const countries = [
  { label: "Nicaragua", value: "ni" },
  { label: "Costa Rica", value: "cr" },
  { label: "El Salvador", value: "sv" },
  { label: "Honduras", value: "hn" },
  { label: "Panamá", value: "pa" },
  { label: "México", value: "mx" },
  { label: "Colombia", value: "co" },
  { label: "Guatemala", value: "gt", disabled: true },
];

const cities = [
  { label: "Managua", value: "managua" },
  { label: "León", value: "leon" },
  { label: "Granada", value: "granada" },
  { label: "Masaya", value: "masaya" },
];

const notificationOptions = [
  { value: "email", label: "Correo electrónico" },
  { value: "sms", label: "SMS" },
  { value: "push", label: "Push no disponible", disabled: true },
];

const tabs = [
  { label: "Resumen", value: "overview" },
  { label: "Actividad", value: "activity" },
  { label: "Deshabilitada", value: "disabled", disabled: true },
];

const steps = [
  { value: "details", label: "Datos", description: "Información principal" },
  { value: "shipping", label: "Envío", description: "Método de entrega" },
  { value: "review", label: "Revisión", description: "Confirma los datos" },
  {
    value: "done",
    label: "Final",
    description: "Paso no disponible",
    disabled: true,
  },
];

const menuGroups = [
  [
    { label: "Editar", event: "edit" },
    { label: "Duplicar", event: "duplicate", color: "info" as const },
  ],
  [
    { label: "Archivar", event: "archive", color: "success" as const },
    {
      label: "Eliminar",
      event: "delete",
      color: "danger" as const,
      tooltip: "Acción irreversible",
    },
    { label: "No disponible", event: "disabled", disabled: true },
  ],
];

const currentValues = computed(() =>
  JSON.stringify(
    {
      name: name.value,
      accepted: accepted.value,
      notificationType: notificationType.value,
      radioGroupValue: radioGroupValue.value,
      radioPositionExample: radioPositionExample.value,
      notifications: notifications.value,
      spacingRadio: spacingRadio.value,
      spacingSwitch: spacingSwitch.value,
      country: country.value,
      city: city.value,
      activeTab: activeTab.value,
      currentStep: currentStep.value,
    },
    null,
    2,
  ),
);

watch(
  theme,
  (value) => {
    if (value === "dark") document.documentElement.dataset.theme = "dark";
    else delete document.documentElement.dataset.theme;
  },
  { immediate: true },
);

onBeforeUnmount(() => {
  delete document.documentElement.dataset.theme;
});

function recordAction(message: string) {
  lastAction.value = message;
}

function showToast(tone: ToastTone) {
  const messages = {
    success: {
      title: "Cambios guardados",
      description: "Tu información se actualizó correctamente.",
    },
    info: {
      title: "Nuevo envío disponible",
      description: "Puedes consultar el seguimiento desde tu cuenta.",
    },
    warning: {
      title: "Revisa los datos",
      description: "Hay campos pendientes de completar.",
    },
    danger: {
      title: "No se pudo guardar",
      description: "Comprueba tu conexión e inténtalo de nuevo.",
    },
  };
  toastTone.value = tone;
  toastTitle.value = messages[tone].title;
  toastDescription.value = messages[tone].description;
  toastOpen.value = true;
}

function handleMenuSelect(payload: { item: { label: string; event: string } }) {
  recordAction(`Menú: ${payload.item.label} (${payload.item.event})`);
}

function handleSearchQLChange(filters: BaseSearchQLChange[]) {
  searchQLSelection.value = filters;
}

function handleSearchQLDateChange(value: DateRangeValue) {
  searchQLDateRange.value = value;
}

function handleTableAdd(row: BaseTableRow, resetDraft: () => void) {
  rows.value = [...rows.value, { ...row, id: Date.now() }];
  resetDraft();
  recordAction("Tabla: fila agregada");
}

function handleTableEdit(row: BaseTableRow, finishEditing: () => void) {
  rows.value = rows.value.map((currentRow) =>
    currentRow.id === row.id ? row : currentRow,
  );
  finishEditing();
  recordAction("Tabla: fila editada");
}

function handleTableDelete(rowToDelete: BaseTableRow) {
  rows.value = rows.value.filter((row) => row.id !== rowToDelete.id);
  selectedRows.value = selectedRows.value.filter(
    (row) => row.id !== rowToDelete.id,
  );
  recordAction("Tabla: fila eliminada");
}
</script>

<template>
  <div class="playground-shell">
    <header class="playground-header">
      <div>
        <BaseText as="span" variant="label" color="brand" weight="bold">
          UI
        </BaseText>
        <BaseHeading as="h1" variant="hero"
          >Playground de componentes</BaseHeading
        >
        <BaseText color="muted">
          Ejemplos interactivos conectados directamente al código fuente de la
          librería.
        </BaseText>
      </div>

      <div class="theme-control" aria-label="Selector de tema">
        <BaseSwitch
          id="dark-theme"
          :model-value="theme === 'dark'"
          label="Tema oscuro"
          @update:model-value="theme = $event ? 'dark' : 'light'"
        />
      </div>
    </header>

    <nav class="section-nav" aria-label="Secciones del playground">
      <a href="#foundations">Contenido</a>
      <a href="#icons">Iconos</a>
      <a href="#actions">Acciones</a>
      <a href="#forms">Formularios</a>
      <a href="#dates">Fechas</a>
      <a href="#navigation">Navegación</a>
      <a href="#data">Datos</a>
    </nav>

    <main>
      <section id="foundations" class="demo-section">
        <div class="section-heading">
          <BaseHeading as="h2" variant="lg"
            >Contenido y superficies</BaseHeading
          >
          <BaseText color="muted"
            >Tipografía, tarjetas y ayuda contextual.</BaseText
          >
        </div>

        <div class="demo-grid demo-grid--three">
          <BaseCard padding="comfortable" elevation="sm" outlined>
            <BaseHeading as="h3" variant="md">Tarjeta de página</BaseHeading>
            <BaseText
              >Superficie predeterminada, borde y elevación suave.</BaseText
            >
          </BaseCard>
          <BaseCard surface="primary" padding="comfortable" radius="lg">
            <BaseHeading as="h3" variant="md">Superficie primaria</BaseHeading>
            <BaseText color="heading"
              >Útil para destacar contenido relevante.</BaseText
            >
          </BaseCard>
          <BaseCard surface="inverse" padding="compact" elevation="md">
            <BaseHeading as="h3" variant="sm" color="inverse"
              >Tarjeta inversa</BaseHeading
            >
            <BaseText color="inverse-muted"
              >Contraste para fondos oscuros o destacados.</BaseText
            >
          </BaseCard>
        </div>

        <div class="demo-grid demo-grid--two">
          <BaseCard
            title="Datos del remitente"
            title-icon="location"
            title-position="inside"
            padding="comfortable"
            outlined
          >
            <BaseText color="muted">Título interno con icono.</BaseText>
          </BaseCard>
          <BaseCard
            title="Conexión con Shopify"
            title-icon="location"
            title-position="outside"
            padding="comfortable"
            outlined
          >
            <BaseText color="muted">Título externo sobre la tarjeta.</BaseText>
          </BaseCard>
        </div>

        <BaseCard padding="comfortable" outlined>
          <BaseHeading as="h3" variant="md">Insignias de estado</BaseHeading>
          <BaseText color="muted"
            >Tonos tematizables, tamaños y ancho fijo para tablas.</BaseText
          >
          <div class="demo-row">
            <BaseBadge label="Neutral" tone="neutral" />
            <BaseBadge label="Información" tone="info" />
            <BaseBadge label="Éxito" tone="success" />
            <BaseBadge label="Advertencia" tone="warning" />
            <BaseBadge label="Error" tone="error" />
            <BaseBadge label="Crítico" tone="critical" />
            <BaseBadge label="En progreso" tone="progress" />
            <BaseBadge label="Violeta" tone="violet" />
            <BaseBadge label="Ancho automático" tone="neutral" width="auto" />
          </div>
          <div class="demo-row">
            <BaseBadge tone="success" size="md">Tamaño mediano</BaseBadge>
            <BaseBadge tone="info" width="fixed">Ancho fijo</BaseBadge>
          </div>
        </BaseCard>

        <BaseCard id="icons" padding="comfortable" outlined>
          <BaseHeading as="h3" variant="md">Catálogo de iconos</BaseHeading>
          <BaseText color="muted"
            >Nombres disponibles para <code>BaseIcon</code> y props como
            <code>BaseDropdownMenu.icon</code>.</BaseText
          >
          <div class="icon-catalog">
            <div
              v-for="iconName in iconNames"
              :key="iconName"
              class="icon-catalog__item"
            >
              <BaseIcon :name="iconName" size="lg" decorative />
              <code>{{ iconName }}</code>
            </div>
          </div>
        </BaseCard>

        <BaseCard class="typography-sample" padding="comfortable" outlined>
          <BaseHeading variant="hero">Título hero</BaseHeading>
          <BaseHeading as="h3" variant="lg" color="brand"
            >Título grande de marca</BaseHeading
          >
          <BaseHeading as="h4" variant="md">Título mediano</BaseHeading>
          <BaseText variant="xl">Texto destacado de tamaño XL.</BaseText>
          <BaseText>Texto de cuerpo para contenidos habituales.</BaseText>
          <BaseText variant="sm" color="muted"
            >Texto pequeño y secundario.</BaseText
          >
          <div class="inline-info">
            <BaseText as="span" variant="label" weight="semibold"
              >Información contextual</BaseText
            >
            <BaseFieldInfo
              text="Este tooltip se abre con hover y también con el teclado."
              type="primary"
              aria-label="Más información sobre el ejemplo"
            />
          </div>
          <BaseHeading as="h3" variant="md">Alertas</BaseHeading>
          <BaseAlert
            tone="danger"
            title="No se pudo guardar"
            description="Comprueba tu conexión e inténtalo de nuevo."
            icon="circleX"
            dismissible
            @dismiss="recordAction('Aviso cerrado')"
          >
            <BaseText as="span" variant="sm"
              >El borrador sigue disponible.</BaseText
            >
          </BaseAlert>
          <BaseAlert tone="info" description="Aviso informativo sin título.">
            <template #icon
              ><BaseIcon name="info" size="md" decorative
            /></template>
          </BaseAlert>
          <div class="demo-grid demo-grid--two">
            <BaseAlert
              tone="warning"
              title="Revisa los datos"
              description="Hay campos pendientes de completar."
              icon="alertTriangle"
            />
            <BaseAlert
              tone="primary"
              title="Nuevo envío disponible"
              description="Puedes consultar el seguimiento desde tu cuenta."
            />
            <BaseAlert
              tone="secondary"
              description="Este aviso usa el tono secundario."
            />
          </div>
          <BaseHeading as="h3" variant="md"
            >Toast / Mensajes emergentes</BaseHeading
          >
          <BaseText color="muted"
            >Prueba cada tono sin recargar la página.</BaseText
          >
          <div class="demo-row">
            <BaseButton @click="showToast('success')">Éxito</BaseButton>
            <BaseButton variant="outline" @click="showToast('info')">
              Información
            </BaseButton>
            <BaseButton variant="outline" @click="showToast('warning')">
              Advertencia
            </BaseButton>
            <BaseButton variant="danger" @click="showToast('danger')">
              Error
            </BaseButton>
          </div>
        </BaseCard>
      </section>

      <section id="actions" class="demo-section">
        <div class="section-heading">
          <BaseHeading as="h2" variant="lg">Botones y acciones</BaseHeading>
          <BaseText color="muted"
            >Variantes, tamaños y estados operativos.</BaseText
          >
        </div>

        <BaseCard padding="comfortable" outlined>
          <div class="demo-row">
            <BaseButton
              variant="primary"
              @click="recordAction('Botón primario')"
              >Primario</BaseButton
            >
            <BaseButton
              variant="secondary"
              @click="recordAction('Botón secundario')"
              >Secundario</BaseButton
            >
            <BaseButton variant="outline">Outline</BaseButton>
            <BaseButton variant="ghost" @click="recordAction('Botón ghost')"
              >Ghost</BaseButton
            >
            <BaseButton variant="danger" @click="confirmOpen = true"
              >Eliminar</BaseButton
            >
            <BaseButton loading>Cargando</BaseButton>
            <BaseButton disabled>Deshabilitado</BaseButton>
          </div>
          <div class="demo-row">
            <BaseButton size="sm">Pequeño</BaseButton>
            <BaseButton size="md">Mediano</BaseButton>
            <BaseButton size="lg">Grande</BaseButton>
            <BaseButton
              size="icon"
              variant="ghost"
              aria-label="Editar elemento"
              title="Editar"
              @click="recordAction('Editar elemento')"
            >
              <BaseIcon name="edit" size="sm" decorative />
            </BaseButton>
            <BaseDropdownMenu
              icon="menu"
              :groups="menuGroups"
              @select="handleMenuSelect"
            />
          </div>
          <div class="demo-row">
            <BaseLink href="#forms">Ir a formularios</BaseLink>
            <BaseLink href="#icons" variant="body" underline="always"
              >Ver iconos</BaseLink
            >
            <BaseLink href="https://example.com" target="_blank" variant="muted"
              >Abrir enlace externo</BaseLink
            >
          </div>
          <div class="inverse-sample">
            <BaseButton variant="inverse">Botón inverso</BaseButton>
          </div>
          <BaseText variant="sm" color="muted" aria-live="polite">{{
            lastAction
          }}</BaseText>
        </BaseCard>

        <BaseCard padding="comfortable" outlined>
          <BaseHeading as="h3" variant="md">Acciones en tablas</BaseHeading>
          <BaseText color="muted"
            >Botones solo con icono para devoluciones, tiendas y
            webhooks.</BaseText
          >
          <div class="action-column-examples">
            <div class="action-column-example">
              <BaseText variant="label" color="heading" weight="bold"
                >Devoluciones</BaseText
              >
              <div class="action-column-example__row">
                <span>DEV-2048</span>
                <div class="demo-row demo-row--compact">
                  <BaseButton
                    size="icon"
                    variant="ghost"
                    aria-label="Ver devolución DEV-2048"
                    title="Ver devolución"
                    @click="recordAction('Ver devolución DEV-2048')"
                    ><BaseIcon name="eye" size="sm" decorative
                  /></BaseButton>
                  <BaseButton
                    size="icon"
                    variant="ghost"
                    aria-label="Editar devolución DEV-2048"
                    title="Editar devolución"
                    @click="recordAction('Editar devolución DEV-2048')"
                    ><BaseIcon name="edit" size="sm" decorative
                  /></BaseButton>
                </div>
              </div>
            </div>
            <div class="action-column-example">
              <BaseText variant="label" color="heading" weight="bold"
                >Tiendas</BaseText
              >
              <div class="action-column-example__row">
                <span>Tienda Managua</span>
                <div class="demo-row demo-row--compact">
                  <BaseButton
                    size="icon"
                    variant="ghost"
                    aria-label="Ver tienda Managua"
                    title="Ver tienda"
                    @click="recordAction('Ver tienda Managua')"
                    ><BaseIcon name="eye" size="sm" decorative
                  /></BaseButton>
                  <BaseButton
                    size="icon"
                    variant="ghost"
                    aria-label="Configurar tienda Managua"
                    title="Configurar tienda"
                    @click="recordAction('Configurar tienda Managua')"
                    ><BaseIcon name="settings" size="sm" decorative
                  /></BaseButton>
                </div>
              </div>
            </div>
            <div class="action-column-example">
              <BaseText variant="label" color="heading" weight="bold"
                >Webhooks</BaseText
              >
              <div class="action-column-example__row">
                <span>Pedidos creados</span>
                <div class="demo-row demo-row--compact">
                  <BaseButton
                    size="icon"
                    variant="ghost"
                    aria-label="Ver webhook de pedidos creados"
                    title="Ver webhook"
                    @click="recordAction('Ver webhook de pedidos creados')"
                    ><BaseIcon name="eye" size="sm" decorative
                  /></BaseButton>
                  <BaseButton
                    size="icon"
                    variant="danger"
                    aria-label="Eliminar webhook de pedidos creados"
                    title="Eliminar webhook"
                    @click="recordAction('Eliminar webhook de pedidos creados')"
                    ><BaseIcon name="trash" size="sm" decorative
                  /></BaseButton>
                </div>
              </div>
            </div>
          </div>
        </BaseCard>

        <BaseCard>
          <div class="field-stack">
            <BaseHeading as="h3" variant="sm">Directiva v-loading</BaseHeading>
            <BaseText>
              Activa la carga para mostrar el indicador sobre el contenido. El
              control permanece fuera de la superficie de carga.
            </BaseText>
            <BaseSwitch
              id="loading-example"
              v-model="loadingExample"
              label="Mostrar carga"
            />
            <section
              id="loading-example-content"
              v-loading="loadingExample"
              aria-label="Contenido de ejemplo de v-loading"
            >
              <BaseCard elevation="none" surface="page">
                <div class="field-stack">
                  <BaseText variant="label" color="heading" weight="bold">
                    Resumen del pedido
                  </BaseText>
                  <BaseText>Pedido HTK-1042 · Envío estándar</BaseText>
                  <BaseText>
                    Esta superficie usa la directiva exportada por la
                    biblioteca.
                  </BaseText>
                </div>
              </BaseCard>
            </section>
          </div>
        </BaseCard>

        <div class="demo-row">
          <BaseButton @click="dialogOpen = true">Abrir diálogo</BaseButton>
          <BaseButton variant="danger" @click="confirmOpen = true"
            >Abrir confirmación</BaseButton
          >
        </div>
      </section>

      <section id="forms" class="demo-section">
        <div class="section-heading">
          <BaseHeading as="h2" variant="lg"
            >Formularios y selección</BaseHeading
          >
          <BaseText color="muted"
            >Modelos reactivos, validación, tamaños y estados.</BaseText
          >
        </div>

        <BaseFormSection
          title="Layout estándar de formulario"
          description="BaseFormRow admite de 1 a 4 columnas. Ajusta sus anchos con valores CSS como 1fr, 2fr o minmax(10rem, 1fr); en pantallas estrechas se apilan."
        >
          <BaseSwitch
            id="spacing-switch"
            v-model="spacingSwitch"
            label="Switch de comparación"
          />
          <BaseInput
            label="Campo a ancho completo"
            model-value="Valor completo"
          />
          <BaseFormRow :columns="3" :column-widths="['1fr', '2fr', '1fr']">
            <BaseInput
              label="Primera columna"
              model-value="Valor de ejemplo"
              error="Texto de ayuda"
            />
            <BaseInput label="Segunda columna" model-value="Otro valor" />
            <BaseInput label="Tercera columna" model-value="Tercer valor" />
          </BaseFormRow>
          <BaseFormRow :columns="2" align-items="center">
            <BaseInput label="Campo con etiqueta" model-value="Valor" />
            <BaseSwitch
              id="aligned-switch"
              label="Control alineado"
              label-position="end"
              v-model="spacingSwitch"
            />
          </BaseFormRow>
          <BaseFormRow :columns="2" align-items="start">
            <BaseTextarea
              label="Alineación al inicio"
              model-value="Valor"
              error="Texto de ayuda"
              :rows="4"
            />
            <BaseSwitch
              id="aligned-start-switch"
              label="Control al inicio"
              label-position="end"
              v-model="spacingSwitch"
            />
          </BaseFormRow>
          <BaseFormRow :columns="2" align-items="end">
            <BaseTextarea
              label="Alineación al final"
              model-value="Valor"
              error="Texto de ayuda"
              :rows="4"
            />
            <BaseSwitch
              id="aligned-end-switch"
              label="Control al final"
              label-position="end"
              v-model="spacingSwitch"
            />
          </BaseFormRow>
          <BaseInput
            label="Campo a ancho completo"
            model-value="Valor completo"
            mode="read"
          />
          <BaseRadioGroup
            v-model="radioGroupValue"
            name="notification-group-example"
            label="Canal de notificación agrupado"
            :options="notificationOptions"
            orientation="horizontal"
            :bordered="true"
            error="Selecciona un canal para continuar."
          />
          <BaseInput
            label="Campo a ancho completo"
            model-value="Valor completo"
          />
          <BaseCheckbox
            label="Opción con error"
            label-position="end"
            type="danger"
            invalid
            error="Texto de error de ejemplo"
          />
          <BaseInput
            label="Campo a ancho completo"
            model-value="Valor completo"
          />
        </BaseFormSection>

        <BaseFormColumns>
          <BaseFormSection title="SecciÃ³n izquierda" stretch>
            <BaseInput label="Campo principal" model-value="Valor de ejemplo" />
          </BaseFormSection>
          <BaseFormSection title="SecciÃ³n derecha" stretch>
            <BaseInput label="Campo secundario" model-value="Otro valor" />
            <BaseInput
              label="Campo adicional"
              model-value="MÃ¡s informaciÃ³n"
            />
          </BaseFormSection>
        </BaseFormColumns>

        <div class="demo-grid demo-grid--two">
          <BaseCard padding="comfortable" outlined>
            <BaseHeading as="h3" variant="sm">Campos de texto</BaseHeading>
            <div class="field-stack">
              <BasePhoneInput
                v-model="phoneWithoutFlags"
                label="Teléfono sin banderas"
                :countries="phoneCountries"
                :show-flags="false"
              />
              <BaseInput
                v-model="name"
                label="Nombre completo"
                placeholder="Escribe un nombre"
                help="Este campo muestra texto de ayuda."
                info="Usa el nombre legal de la persona."
                required
              />
              <BaseInput
                model-value="Ada Lovelace"
                label="Nombre en modo lectura"
                mode="read"
              />
              <BaseInput label="Campo vacío en modo lectura" mode="read" />
              <BaseInput
                v-model="password"
                label="Contraseña"
                type="password"
                size="sm"
                show-password-aria-label="Mostrar contraseña de prueba"
                hide-password-aria-label="Ocultar contraseña de prueba"
              />
              <BasePhoneInput
                v-model="phone"
                label="Teléfono"
                :countries="phoneCountries"
                country-selector-aria-label="Seleccionar país del teléfono"
                help="Busca el país por nombre o prefijo."
              />
              <BaseInput
                model-value="valor inválido"
                label="Campo con error"
                error="Corrige el valor antes de continuar."
                state="error"
              />
              <BaseInput
                model-value="dato@example.com"
                label="Campo válido"
                success="El correo está disponible."
                state="success"
                disabled
              />
              <BaseTextarea
                v-model="notes"
                label="Notas"
                :rows="4"
                :max-length="160"
                max-length-visible
              />
            </div>
          </BaseCard>

          <BaseCard padding="comfortable" outlined>
            <BaseHeading as="h3" variant="sm">Opciones</BaseHeading>
            <div class="field-stack">
              <BaseSelect
                v-model="country"
                label="País"
                placeholder="Selecciona un país"
                :options="countries"
                info="Guatemala está deshabilitada para mostrar ese estado."
              />
              <BaseSelect
                v-model="selectedCountries"
                label="Países favoritos"
                placeholder="Selecciona países"
                :options="countries"
                multiple
                allow-create
              />
              <BaseSelect
                v-model="selectedCountriesNoCreate"
                label="Selección múltiple sin creación"
                placeholder="Selecciona países existentes"
                :options="countries"
                multiple
                :allow-create="false"
              />
              <BaseAutocomplete
                v-model="city"
                label="Ciudad"
                placeholder="Busca una ciudad"
                :options="cities"
                allow-create
                no-results-text="No encontramos coincidencias."
              />
              <BaseAutocomplete
                label="Autocompletado con error"
                placeholder="Busca una ciudad"
                :options="cities"
                error="Selecciona una ciudad válida."
                state="error"
              />
              <BaseCheckbox
                v-model="accepted"
                label="Acepto los términos"
                type="primary"
              />
              <BaseCheckbox v-model="accepted" type="primary">
                <template #label>
                  Acepto las <a href="#">condiciones de devolución</a>
                </template>
              </BaseCheckbox>
              <BaseCheckbox
                v-model="indeterminate"
                label="Selección parcial"
                type="secondary"
                indeterminate
              />
              <BaseCheckbox
                label="Opción con error"
                label-position="end"
                type="danger"
                invalid
              />
              <BaseRadioGroup
                v-model="notificationType"
                name="notification-type"
                label="Canal de notificación"
                :options="notificationOptions"
              />
              <BaseRadio
                id="radio-position-end"
                v-model="radioPositionExample"
                name="radio-position-example"
                value="end"
                label="Radio con label a la derecha"
                label-position="end"
              />
              <BaseRadio
                id="radio-size-sm"
                v-model="radioSizeExample"
                name="radio-size-example"
                value="sm"
                label="Radio pequeño (sm)"
                size="sm"
              />
              <BaseRadio
                id="radio-size-md"
                v-model="radioSizeExample"
                name="radio-size-example"
                value="md"
                label="Radio mediano (md)"
                size="md"
              />
              <BaseRadioGroup
                v-model="radioGroupValue"
                name="notification-group-example"
                label="Canal de notificación agrupado"
                :options="notificationOptions"
                orientation="horizontal"
                :bordered="false"
                error="Selecciona un canal para continuar."
              />
              <BaseCheckbox
                v-model="smallCheckboxExample"
                label="Checkbox pequeño (sm)"
                size="sm"
              />
              <BaseCheckbox
                v-model="mediumCheckboxExample"
                label="Checkbox mediano (md)"
                size="md"
              />
              <BaseSwitch
                id="notifications"
                v-model="notifications"
                label="Recibir notificaciones"
              />
              <BaseSwitch
                id="small-switch-example"
                v-model="smallSwitchExample"
                label="Switch pequeño (sm)"
                size="sm"
              />
              <BaseSwitch
                id="medium-switch-example"
                v-model="mediumSwitchExample"
                label="Switch mediano (md)"
                size="md"
              />
              <BaseSwitch
                id="disabled-switch"
                label="Switch deshabilitado"
                label-position="end"
                disabled
              />
              <BaseSwitch
                id="error-switch"
                label="Switch con error"
                error="Corrige esta opción antes de continuar."
              />
            </div>
          </BaseCard>
        </div>

        <BaseCard padding="comfortable" outlined>
          <BaseHeading as="h3" variant="sm">Firma</BaseHeading>
          <BaseSignature
            v-model="signature"
            label="Firma del remitente"
            help="Dibuja dentro del área usando ratón, lápiz o pantalla táctil."
            clear-aria-label="Borrar la firma de prueba"
            drawing-instructions="Área para dibujar una firma de prueba"
            :height="180"
          />
        </BaseCard>

        <BaseCard padding="comfortable" outlined>
          <BaseHeading as="h3" variant="sm">Búsqueda con filtros</BaseHeading>
          <div class="demo-grid">
            <div class="demo-grid">
              <BaseText>sm · rango obligatorio</BaseText>
              <BaseSearchQL
                size="sm"
                :filters="searchQLTextFilters"
                :default-filters="searchQLDefaultFilters"
                show-date-range
                date-range-required
                :date-value="searchQLDateRange"
                placeholder="Escribe un término y elige un campo"
                @change="handleSearchQLChange"
                @date-change="handleSearchQLDateChange"
              />
            </div>
            <div class="demo-grid">
              <BaseText>md</BaseText>
              <BaseSearchQL
                size="md"
                :filters="searchQLTextFilters"
                :default-filters="searchQLDefaultFilters"
                placeholder="Escribe un término y elige un campo"
                @change="handleSearchQLChange"
              />
            </div>
            <div class="demo-grid">
              <BaseText>lg · filtros precargados y fecha opcional</BaseText>
              <div class="demo-row">
                <BaseButton size="sm" @click="loadSearchQLPreset">
                  Cargar filtros existentes
                </BaseButton>
                <BaseButton
                  size="sm"
                  variant="ghost"
                  @click="clearSearchQLPreset"
                >
                  Limpiar filtros desde la página
                </BaseButton>
              </div>
              <BaseSearchQL
                v-model="searchQLModelSelection"
                size="lg"
                :filters="searchQLTextFilters"
                :default-filters="searchQLDefaultFilters"
                :show-date-range="true"
                :date-range-required="false"
                :date-value="searchQLOptionalDateRange"
                placeholder="Escribe un término y elige un campo"
                @change="handleSearchQLChange"
                @date-change="searchQLOptionalDateRange = $event"
              />
              <pre class="search-ql-output">{{
                JSON.stringify(
                  {
                    filters: searchQLModelSelection,
                    dateRange: searchQLOptionalDateRange,
                  },
                  null,
                  2,
                )
              }}</pre>
            </div>
          </div>
          <pre class="search-ql-output">{{
            JSON.stringify(searchQLSelection, null, 2)
          }}</pre>
        </BaseCard>

        <details class="model-state">
          <summary>Ver modelos actuales</summary>
          <pre>{{ currentValues }}</pre>
        </details>
      </section>

      <section id="dates" class="demo-section">
        <div class="section-heading">
          <BaseHeading as="h2" variant="lg">Fecha y hora</BaseHeading>
          <BaseText color="muted"
            >Wrappers especializados y selector de bajo nivel.</BaseText
          >
        </div>

        <div class="demo-grid demo-grid--two">
          <BaseDateInput
            v-model="date"
            label="Fecha"
            placeholder="Selecciona una fecha"
            :dark="theme === 'dark'"
            help="Selector sin hora."
          />
          <BaseDateTimeInput
            v-model="dateTime"
            label="Fecha y hora"
            placeholder="Selecciona fecha y hora"
            :dark="theme === 'dark'"
          />
          <BaseMonthInput
            v-model="month"
            label="Mes"
            placeholder="Selecciona un mes"
            :dark="theme === 'dark'"
          />
          <BaseYearInput
            v-model="year"
            label="Año"
            placeholder="Selecciona un año"
            :dark="theme === 'dark'"
          />
          <BaseDatePicker
            v-model="lowLevelDate"
            label="BaseDatePicker"
            placeholder="Wrapper de bajo nivel"
            :dark="theme === 'dark'"
            :picker-props="{ autoApply: true }"
            info="Permite pasar configuración compatible mediante pickerProps."
          />
          <BaseDateInput
            label="Fecha deshabilitada"
            placeholder="No editable"
            :dark="theme === 'dark'"
            disabled
          />
        </div>
      </section>

      <section id="navigation" class="demo-section">
        <div class="section-heading">
          <BaseHeading as="h2" variant="lg">Navegación y progreso</BaseHeading>
          <BaseText color="muted"
            >Breadcrumb, tabs accesibles y las cuatro variantes del
            stepper.</BaseText
          >
        </div>

        <BaseCard padding="comfortable" outlined>
          <BaseHeading as="h3" variant="xs">Breadcrumb</BaseHeading>
          <BaseBreadcrumb
            :value="breadcrumbs"
            divider="/"
            size="md"
            weight="semibold"
          />
        </BaseCard>

        <BaseCard padding="comfortable" outlined>
          <BaseTabs
            v-model="activeTab"
            :tabs="tabs"
            aria-label="Ejemplo de pestañas"
          />
          <div class="tab-panel" role="tabpanel">
            <BaseText v-if="activeTab === 'overview'"
              >Contenido del panel Resumen.</BaseText
            >
            <BaseText v-else>Contenido del panel Actividad.</BaseText>
          </div>
        </BaseCard>

        <div class="stepper-stack">
          <BaseCard
            v-for="variant in ['circles', 'bars', 'pills']"
            :key="variant"
            padding="comfortable"
            outlined
          >
            <BaseHeading as="h3" variant="xs"
              >Variante {{ variant }}</BaseHeading
            >
            <BaseStepper
              v-model="currentStep"
              :steps="steps"
              :variant="variant"
              navigable
              show-step-descriptions
              :aria-label="`Stepper ${variant}`"
            />
          </BaseCard>
          <BaseCard padding="comfortable" outlined>
            <BaseHeading as="h3" variant="xs">Variante vertical</BaseHeading>
            <BaseStepper
              v-model="currentStep"
              :steps="steps"
              variant="vertical"
              navigable
              description="Flujo de ejemplo con descripción inferior."
              description-position="bottom"
            />
          </BaseCard>
        </div>
      </section>

      <section id="data" class="demo-section">
        <div class="section-heading">
          <BaseHeading as="h2" variant="lg">Tabla de datos</BaseHeading>
          <BaseText color="muted"
            >Ordenamiento, selección, paginación y CRUD local.</BaseText
          >
        </div>

        <BaseCard padding="comfortable" outlined>
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
            @add="handleTableAdd"
            @edit="handleTableEdit"
            @delete="handleTableDelete"
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
        </BaseCard>
      </section>
    </main>

    <BaseDialog
      :open="dialogOpen"
      title="Editar perfil"
      description="Ejemplo de diálogo con formulario y acciones personalizadas."
      form
      @close="dialogOpen = false"
      @submit="
        dialogOpen = false;
        recordAction('Diálogo enviado');
      "
    >
      <BaseInput label="Correo electrónico" type="email" required />
      <template #actions>
        <BaseButton variant="outline" @click="dialogOpen = false"
          >Cancelar</BaseButton
        >
        <BaseButton type="submit">Guardar</BaseButton>
      </template>
    </BaseDialog>

    <BaseConfirmDialog
      :open="confirmOpen"
      title="Eliminar elemento"
      description="Esta acción se muestra para verificar el diálogo de confirmación."
      confirm-label="Sí, eliminar"
      cancel-label="Conservar"
      button-size="md"
      tone="danger"
      @close="confirmOpen = false"
      @confirm="
        confirmOpen = false;
        recordAction('Acción confirmada');
      "
    />

    <BaseToast
      v-model:open="toastOpen"
      :tone="toastTone"
      :title="toastTitle"
      :description="toastDescription"
      position="top-right"
      @close="recordAction('Toast cerrado')"
    />
  </div>
</template>
