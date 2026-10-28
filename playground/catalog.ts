import type { Localized } from "./i18n";

export interface DemoEntry {
  example: string;
  title: Localized;
  description?: Localized;
  layout?: "row" | "stack" | "grid" | "block";
  themed?: boolean;
}

export interface CatalogEntry {
  id: string;
  name: Localized;
  description: Localized;
  imports?: string[];
  status?: Localized;
  demos: DemoEntry[];
}

export interface CatalogGroup {
  id: string;
  label: Localized;
  icon: string;
  items: CatalogEntry[];
}

const basicUsage = { es: "Uso básico", en: "Basic usage" };
const variants = { es: "Variantes", en: "Variants" };
const sizes = { es: "Tamaños", en: "Sizes" };
const tones = { es: "Tonos", en: "Tones" };
const states = { es: "Estados", en: "States" };

export const catalog: CatalogGroup[] = [
  {
    id: "content",
    label: { es: "Contenido", en: "Content" },
    icon: "list",
    items: [
      {
        id: "base-text",
        name: { es: "BaseText y BaseHeading", en: "BaseText and BaseHeading" },
        imports: ["BaseHeading", "BaseText"],
        description: {
          es: "Escala tipográfica del tema: títulos semánticos y texto con variantes, colores y pesos.",
          en: "The theme's type scale: semantic headings and text with variants, colors and weights.",
        },
        demos: [
          {
            example: "text/Typography",
            title: { es: "Escala tipográfica", en: "Type scale" },
            description: {
              es: "Usa `as` para elegir la etiqueta y `variant` para el tamaño.",
              en: "Use `as` to choose the tag and `variant` for the size.",
            },
            layout: "stack",
          },
        ],
      },
      {
        id: "base-card",
        name: "BaseCard",
        description: {
          es: "Superficie contenedora con variantes de fondo, relleno, radio, elevación y título opcional.",
          en: "Container surface with background, padding, radius and elevation variants, plus an optional title.",
        },
        demos: [
          {
            example: "card/Surfaces",
            title: { es: "Superficies", en: "Surfaces" },
            layout: "grid",
          },
          {
            example: "card/WithTitle",
            title: { es: "Con título e icono", en: "With title and icon" },
            description: {
              es: "El título puede ir dentro de la tarjeta o encima de ella.",
              en: "The title can go inside the card or above it.",
            },
            layout: "grid",
          },
        ],
      },
      {
        id: "base-badge",
        name: "BaseBadge",
        description: {
          es: "Insignias de estado con tonos tematizables y ancho fijo para tablas.",
          en: "Status badges with themeable tones and a fixed width for tables.",
        },
        demos: [
          { example: "badge/Tones", title: tones },
          {
            example: "badge/Sizes",
            title: { es: "Tamaños y ancho", en: "Sizes and width" },
          },
        ],
      },
      {
        id: "base-icon",
        name: "BaseIcon",
        description: {
          es: "Iconografía SVG integrada. Marca como `decorative` los iconos que acompañan a un texto visible.",
          en: "Built-in SVG icons. Mark icons that accompany visible text as `decorative`.",
        },
        demos: [
          { example: "icon/Sizes", title: sizes },
          {
            example: "icon/Catalog",
            title: { es: "Catálogo", en: "Catalog" },
            layout: "block",
          },
        ],
      },
      {
        id: "base-alert",
        name: "BaseAlert",
        description: {
          es: "Avisos en línea con tono, icono, título y cierre opcional.",
          en: "Inline notices with tone, icon, title and optional dismiss.",
        },
        demos: [
          { example: "alert/Tones", title: tones, layout: "stack" },
          {
            example: "alert/Dismissible",
            title: { es: "Descartable", en: "Dismissible" },
            description: {
              es: "Escucha `dismiss` para ocultarlo.",
              en: "Listen to `dismiss` to hide it.",
            },
            layout: "stack",
          },
        ],
      },
      {
        id: "base-toast",
        name: "BaseToast",
        description: {
          es: "Mensajes emergentes temporales controlados con `v-model:open`.",
          en: "Temporary pop-up messages controlled with `v-model:open`.",
        },
        demos: [{ example: "toast/Tones", title: tones }],
      },
      {
        id: "base-field-info",
        name: "BaseFieldInfo",
        description: {
          es: "Tooltip de ayuda accesible por ratón y teclado.",
          en: "Help tooltip accessible by mouse and keyboard.",
        },
        demos: [
          {
            example: "field-info/Basic",
            title: { es: "Ayuda contextual", en: "Contextual help" },
          },
        ],
      },
    ],
  },
  {
    id: "actions",
    label: { es: "Acciones", en: "Actions" },
    icon: "bolt",
    items: [
      {
        id: "base-button",
        name: "BaseButton",
        description: {
          es: "Botón con variantes, tamaños y estados de carga y deshabilitado.",
          en: "Button with variants, sizes, and loading and disabled states.",
        },
        demos: [
          { example: "button/Variants", title: variants },
          { example: "button/Sizes", title: sizes },
          { example: "button/States", title: states },
          {
            example: "button/IconOnly",
            title: { es: "Solo icono", en: "Icon only" },
            description: {
              es: "Toda acción sin texto visible necesita `aria-label`.",
              en: "Every action without visible text needs an `aria-label`.",
            },
          },
          {
            example: "button/Inverse",
            title: { es: "Sobre superficie inversa", en: "On inverse surface" },
          },
        ],
      },
      {
        id: "base-link",
        name: "BaseLink",
        description: {
          es: "Enlaces con variantes de color y subrayado.",
          en: "Links with color and underline variants.",
        },
        demos: [{ example: "link/Variants", title: variants }],
      },
      {
        id: "base-dropdown-menu",
        name: "BaseDropdownMenu",
        description: {
          es: "Menú de acciones agrupadas con colores, tooltips y opciones deshabilitadas.",
          en: "Menu of grouped actions with colors, tooltips and disabled options.",
        },
        demos: [
          {
            example: "dropdown-menu/Groups",
            title: { es: "Grupos de acciones", en: "Action groups" },
          },
        ],
      },
      {
        id: "base-dialog",
        name: "BaseDialog",
        description: {
          es: "Diálogo modal con modo formulario y slot de acciones.",
          en: "Modal dialog with a form mode and an actions slot.",
        },
        demos: [
          {
            example: "dialog/FormDialog",
            title: { es: "Diálogo con formulario", en: "Form dialog" },
          },
        ],
      },
      {
        id: "base-confirm-dialog",
        name: "BaseConfirmDialog",
        description: {
          es: "Confirmación de acciones con textos configurables.",
          en: "Action confirmation with configurable texts.",
        },
        demos: [
          {
            example: "confirm-dialog/Danger",
            title: { es: "Acción destructiva", en: "Destructive action" },
          },
        ],
      },
      {
        id: "v-loading",
        name: "v-loading",
        imports: ["loading"],
        status: { es: "Directiva", en: "Directive" },
        description: {
          es: "Superpone un indicador de carga sobre cualquier elemento.",
          en: "Overlays a loading indicator on any element.",
        },
        demos: [
          {
            example: "loading/Directive",
            title: basicUsage,
            layout: "stack",
          },
        ],
      },
    ],
  },
  {
    id: "forms",
    label: { es: "Formularios", en: "Forms" },
    icon: "edit",
    items: [
      {
        id: "base-input",
        name: "BaseInput",
        description: {
          es: "Campo de texto con etiqueta, ayuda, validación y modo lectura.",
          en: "Text field with label, help text, validation and read-only mode.",
        },
        demos: [
          { example: "input/Basic", title: basicUsage, layout: "stack" },
          { example: "input/States", title: states, layout: "grid" },
          {
            example: "input/Password",
            title: { es: "Contraseña", en: "Password" },
            layout: "stack",
          },
        ],
      },
      {
        id: "base-textarea",
        name: "BaseTextarea",
        description: {
          es: "Texto multilínea con contador de caracteres opcional.",
          en: "Multi-line text with an optional character counter.",
        },
        demos: [
          {
            example: "textarea/Counter",
            title: { es: "Con contador", en: "With counter" },
            layout: "stack",
          },
        ],
      },
      {
        id: "base-phone-input",
        name: "BasePhoneInput",
        description: {
          es: "Teléfono internacional con selector de país buscable.",
          en: "International phone number with a searchable country picker.",
        },
        demos: [
          {
            example: "phone-input/Countries",
            title: { es: "Países", en: "Countries" },
            layout: "grid",
          },
        ],
      },
      {
        id: "base-select",
        name: "BaseSelect",
        description: {
          es: "Selección simple o múltiple, con creación opcional de valores.",
          en: "Single or multiple selection, with optional value creation.",
        },
        demos: [
          {
            example: "select/Single",
            title: { es: "Selección simple", en: "Single selection" },
            layout: "stack",
          },
          {
            example: "select/Multiple",
            title: { es: "Selección múltiple", en: "Multiple selection" },
            layout: "stack",
          },
        ],
      },
      {
        id: "base-autocomplete",
        name: "BaseAutocomplete",
        description: {
          es: "Búsqueda con sugerencias y estado sin resultados.",
          en: "Search with suggestions and a no-results state.",
        },
        demos: [
          {
            example: "autocomplete/Basic",
            title: basicUsage,
            layout: "grid",
          },
        ],
      },
      {
        id: "base-checkbox",
        name: "BaseCheckbox",
        description: {
          es: "Casilla con tipos, estado indeterminado, error y etiqueta por slot.",
          en: "Checkbox with types, indeterminate state, error and slot label.",
        },
        demos: [
          { example: "checkbox/Variants", title: variants, layout: "stack" },
          { example: "checkbox/Sizes", title: sizes },
        ],
      },
      {
        id: "base-radio",
        name: {
          es: "BaseRadio y BaseRadioGroup",
          en: "BaseRadio and BaseRadioGroup",
        },
        imports: ["BaseRadio", "BaseRadioGroup"],
        description: {
          es: "Opciones excluyentes individuales o agrupadas en un fieldset.",
          en: "Mutually exclusive options, standalone or grouped in a fieldset.",
        },
        demos: [
          { example: "radio/Basic", title: "BaseRadio", layout: "stack" },
          {
            example: "radio-group/Orientation",
            title: "BaseRadioGroup",
            layout: "stack",
          },
        ],
      },
      {
        id: "base-switch",
        name: "BaseSwitch",
        description: {
          es: "Interruptor booleano con tamaños, posición de etiqueta y error.",
          en: "Boolean toggle with sizes, label position and error.",
        },
        demos: [
          { example: "switch/Variants", title: variants, layout: "stack" },
        ],
      },
      {
        id: "base-signature",
        name: "BaseSignature",
        description: {
          es: "Área de firma para ratón, lápiz o pantalla táctil.",
          en: "Signature pad for mouse, pen or touchscreen.",
        },
        demos: [
          { example: "signature/Basic", title: basicUsage, layout: "block" },
        ],
      },
      {
        id: "base-form-layout",
        name: { es: "Layout de formularios", en: "Form layout" },
        imports: ["BaseFormSection", "BaseFormRow", "BaseFormColumns"],
        description: {
          es: "Secciones, filas de 1 a 4 columnas y columnas paralelas.",
          en: "Sections, rows of 1 to 4 columns, and parallel columns.",
        },
        demos: [
          {
            example: "form-layout/FormRow",
            title: "BaseFormSection + BaseFormRow",
            layout: "block",
          },
          {
            example: "form-layout/FormColumns",
            title: "BaseFormColumns",
            layout: "block",
          },
        ],
      },
      {
        id: "base-search-ql",
        name: "BaseSearchQL",
        description: {
          es: "Buscador con filtros de texto, filtros predefinidos y rango de fechas.",
          en: "Search bar with text filters, predefined filters and a date range.",
        },
        demos: [
          {
            example: "search-ql/Basic",
            title: { es: "Rango obligatorio", en: "Required range" },
            description: {
              es: "Escucha `change` y `date-change`.",
              en: "Listen to `change` and `date-change`.",
            },
            layout: "stack",
          },
          {
            example: "search-ql/Model",
            title: {
              es: "Filtros controlados con v-model",
              en: "Filters controlled with v-model",
            },
            description: {
              es: "Carga o limpia los filtros desde la página.",
              en: "Load or clear the filters from the page.",
            },
            layout: "stack",
          },
        ],
      },
    ],
  },
  {
    id: "date-time",
    label: { es: "Fecha y hora", en: "Date and time" },
    icon: "calendar",
    items: [
      {
        id: "base-date-input",
        name: "BaseDateInput",
        description: {
          es: "Selector de fecha sin hora. Requiere `@vuepic/vue-datepicker`.",
          en: "Date picker without time. Requires `@vuepic/vue-datepicker`.",
        },
        demos: [
          {
            example: "date/DateInput",
            title: basicUsage,
            layout: "grid",
            themed: true,
          },
        ],
      },
      {
        id: "base-date-time-input",
        name: "BaseDateTimeInput",
        description: {
          es: "Selector de fecha y hora.",
          en: "Date and time picker.",
        },
        demos: [
          {
            example: "date/DateTimeInput",
            title: basicUsage,
            layout: "grid",
            themed: true,
          },
        ],
      },
      {
        id: "base-month-year-input",
        name: {
          es: "BaseMonthInput y BaseYearInput",
          en: "BaseMonthInput and BaseYearInput",
        },
        imports: ["BaseMonthInput", "BaseYearInput"],
        description: {
          es: "Selectores de mes y de año.",
          en: "Month and year pickers.",
        },
        demos: [
          {
            example: "date/MonthYear",
            title: { es: "Mes y año", en: "Month and year" },
            layout: "grid",
            themed: true,
          },
        ],
      },
      {
        id: "base-date-picker",
        name: "BaseDatePicker",
        description: {
          es: "Wrapper de bajo nivel que acepta configuración mediante `pickerProps`.",
          en: "Low-level wrapper that accepts configuration through `pickerProps`.",
        },
        demos: [
          {
            example: "date/DatePicker",
            title: basicUsage,
            layout: "grid",
            themed: true,
          },
        ],
      },
    ],
  },
  {
    id: "navigation",
    label: { es: "Navegación", en: "Navigation" },
    icon: "map",
    items: [
      {
        id: "base-breadcrumb",
        name: "BaseBreadcrumb",
        description: {
          es: "Ruta de navegación compatible con objetos de `RouterLink`.",
          en: "Navigation trail compatible with `RouterLink` objects.",
        },
        demos: [{ example: "breadcrumb/Basic", title: basicUsage }],
      },
      {
        id: "base-tabs",
        name: "BaseTabs",
        description: {
          es: "Pestañas accesibles con flechas, Inicio y Fin.",
          en: "Accessible tabs with arrow, Home and End keys.",
        },
        demos: [{ example: "tabs/Basic", title: basicUsage, layout: "stack" }],
      },
      {
        id: "base-stepper",
        name: "BaseStepper",
        description: {
          es: "Progreso por pasos en variantes circles, bars, pills y vertical.",
          en: "Step progress in circles, bars, pills and vertical variants.",
        },
        demos: [
          {
            example: "stepper/Variants",
            title: { es: "Variantes horizontales", en: "Horizontal variants" },
            layout: "stack",
          },
          {
            example: "stepper/Vertical",
            title: { es: "Variante vertical", en: "Vertical variant" },
            layout: "stack",
          },
        ],
      },
    ],
  },
  {
    id: "data",
    label: { es: "Datos", en: "Data" },
    icon: "grid",
    items: [
      {
        id: "base-table",
        name: "BaseTable",
        description: {
          es: "Tabla con ordenamiento, selección, paginación y CRUD local.",
          en: "Table with sorting, selection, pagination and local CRUD.",
        },
        imports: ["BaseTable", "type BaseTableColumn", "type BaseTableRow"],
        demos: [
          {
            example: "table/Crud",
            title: { es: "CRUD local", en: "Local CRUD" },
            layout: "block",
          },
        ],
      },
    ],
  },
];
