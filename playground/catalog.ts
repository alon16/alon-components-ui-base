export interface DemoEntry {
  example: string;
  title: string;
  description?: string;
  layout?: "row" | "stack" | "grid" | "block";
  themed?: boolean;
}

export interface CatalogEntry {
  id: string;
  name: string;
  description: string;
  imports?: string[];
  status?: string;
  demos: DemoEntry[];
}

export interface CatalogGroup {
  label: string;
  icon: string;
  items: CatalogEntry[];
}

export const catalog: CatalogGroup[] = [
  {
    label: "Contenido",
    icon: "list",
    items: [
      {
        id: "base-text",
        name: "BaseText y BaseHeading",
        imports: ["BaseHeading", "BaseText"],
        description:
          "Escala tipográfica del tema: títulos semánticos y texto con variantes, colores y pesos.",
        demos: [
          {
            example: "text/Typography",
            title: "Escala tipográfica",
            description:
              "Usa `as` para elegir la etiqueta y `variant` para el tamaño.",
            layout: "stack",
          },
        ],
      },
      {
        id: "base-card",
        name: "BaseCard",
        description:
          "Superficie contenedora con variantes de fondo, relleno, radio, elevación y título opcional.",
        demos: [
          {
            example: "card/Surfaces",
            title: "Superficies",
            layout: "grid",
          },
          {
            example: "card/WithTitle",
            title: "Con título e icono",
            description:
              "El título puede ir dentro de la tarjeta o encima de ella.",
            layout: "grid",
          },
        ],
      },
      {
        id: "base-badge",
        name: "BaseBadge",
        description:
          "Insignias de estado con tonos tematizables y ancho fijo para tablas.",
        demos: [
          { example: "badge/Tones", title: "Tonos" },
          { example: "badge/Sizes", title: "Tamaños y ancho" },
        ],
      },
      {
        id: "base-icon",
        name: "BaseIcon",
        description:
          "Iconografía SVG integrada. Marca como `decorative` los iconos que acompañan a un texto visible.",
        demos: [
          { example: "icon/Sizes", title: "Tamaños" },
          { example: "icon/Catalog", title: "Catálogo", layout: "block" },
        ],
      },
      {
        id: "base-alert",
        name: "BaseAlert",
        description:
          "Avisos en línea con tono, icono, título y cierre opcional.",
        demos: [
          { example: "alert/Tones", title: "Tonos", layout: "stack" },
          {
            example: "alert/Dismissible",
            title: "Descartable",
            description: "Escucha `dismiss` para ocultarlo.",
            layout: "stack",
          },
        ],
      },
      {
        id: "base-toast",
        name: "BaseToast",
        description:
          "Mensajes emergentes temporales controlados con `v-model:open`.",
        demos: [{ example: "toast/Tones", title: "Tonos" }],
      },
      {
        id: "base-field-info",
        name: "BaseFieldInfo",
        description: "Tooltip de ayuda accesible por ratón y teclado.",
        demos: [{ example: "field-info/Basic", title: "Ayuda contextual" }],
      },
    ],
  },
  {
    label: "Acciones",
    icon: "bolt",
    items: [
      {
        id: "base-button",
        name: "BaseButton",
        description:
          "Botón con variantes, tamaños y estados de carga y deshabilitado.",
        demos: [
          { example: "button/Variants", title: "Variantes" },
          { example: "button/Sizes", title: "Tamaños" },
          { example: "button/States", title: "Estados" },
          {
            example: "button/IconOnly",
            title: "Solo icono",
            description: "Toda acción sin texto visible necesita `aria-label`.",
          },
          { example: "button/Inverse", title: "Sobre superficie inversa" },
        ],
      },
      {
        id: "base-link",
        name: "BaseLink",
        description: "Enlaces con variantes de color y subrayado.",
        demos: [{ example: "link/Variants", title: "Variantes" }],
      },
      {
        id: "base-dropdown-menu",
        name: "BaseDropdownMenu",
        description:
          "Menú de acciones agrupadas con colores, tooltips y opciones deshabilitadas.",
        demos: [
          { example: "dropdown-menu/Groups", title: "Grupos de acciones" },
        ],
      },
      {
        id: "base-dialog",
        name: "BaseDialog",
        description: "Diálogo modal con modo formulario y slot de acciones.",
        demos: [
          { example: "dialog/FormDialog", title: "Diálogo con formulario" },
        ],
      },
      {
        id: "base-confirm-dialog",
        name: "BaseConfirmDialog",
        description: "Confirmación de acciones con textos configurables.",
        demos: [
          { example: "confirm-dialog/Danger", title: "Acción destructiva" },
        ],
      },
      {
        id: "v-loading",
        name: "v-loading",
        imports: ["loading"],
        status: "Directiva",
        description:
          "Superpone un indicador de carga sobre cualquier elemento.",
        demos: [
          {
            example: "loading/Directive",
            title: "Uso básico",
            layout: "stack",
          },
        ],
      },
    ],
  },
  {
    label: "Formularios",
    icon: "edit",
    items: [
      {
        id: "base-input",
        name: "BaseInput",
        description:
          "Campo de texto con etiqueta, ayuda, validación y modo lectura.",
        demos: [
          { example: "input/Basic", title: "Uso básico", layout: "stack" },
          { example: "input/States", title: "Estados", layout: "grid" },
          { example: "input/Password", title: "Contraseña", layout: "stack" },
        ],
      },
      {
        id: "base-textarea",
        name: "BaseTextarea",
        description: "Texto multilínea con contador de caracteres opcional.",
        demos: [
          {
            example: "textarea/Counter",
            title: "Con contador",
            layout: "stack",
          },
        ],
      },
      {
        id: "base-phone-input",
        name: "BasePhoneInput",
        description: "Teléfono internacional con selector de país buscable.",
        demos: [
          { example: "phone-input/Countries", title: "Países", layout: "grid" },
        ],
      },
      {
        id: "base-select",
        name: "BaseSelect",
        description:
          "Selección simple o múltiple, con creación opcional de valores.",
        demos: [
          {
            example: "select/Single",
            title: "Selección simple",
            layout: "stack",
          },
          {
            example: "select/Multiple",
            title: "Selección múltiple",
            layout: "stack",
          },
        ],
      },
      {
        id: "base-autocomplete",
        name: "BaseAutocomplete",
        description: "Búsqueda con sugerencias y estado sin resultados.",
        demos: [
          {
            example: "autocomplete/Basic",
            title: "Uso básico",
            layout: "grid",
          },
        ],
      },
      {
        id: "base-checkbox",
        name: "BaseCheckbox",
        description:
          "Casilla con tipos, estado indeterminado, error y etiqueta por slot.",
        demos: [
          { example: "checkbox/Variants", title: "Variantes", layout: "stack" },
          { example: "checkbox/Sizes", title: "Tamaños" },
        ],
      },
      {
        id: "base-radio",
        name: "BaseRadio y BaseRadioGroup",
        imports: ["BaseRadio", "BaseRadioGroup"],
        description:
          "Opciones excluyentes individuales o agrupadas en un fieldset.",
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
        description:
          "Interruptor booleano con tamaños, posición de etiqueta y error.",
        demos: [
          { example: "switch/Variants", title: "Variantes", layout: "stack" },
        ],
      },
      {
        id: "base-signature",
        name: "BaseSignature",
        description: "Área de firma para ratón, lápiz o pantalla táctil.",
        demos: [
          { example: "signature/Basic", title: "Uso básico", layout: "block" },
        ],
      },
      {
        id: "base-form-layout",
        name: "Layout de formularios",
        imports: ["BaseFormSection", "BaseFormRow", "BaseFormColumns"],
        description: "Secciones, filas de 1 a 4 columnas y columnas paralelas.",
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
        description:
          "Buscador con filtros de texto, filtros predefinidos y rango de fechas.",
        demos: [
          {
            example: "search-ql/Basic",
            title: "Rango obligatorio",
            description: "Escucha `change` y `date-change`.",
            layout: "stack",
          },
          {
            example: "search-ql/Model",
            title: "Filtros controlados con v-model",
            description: "Carga o limpia los filtros desde la página.",
            layout: "stack",
          },
        ],
      },
    ],
  },
  {
    label: "Fecha y hora",
    icon: "calendar",
    items: [
      {
        id: "base-date-input",
        name: "BaseDateInput",
        description:
          "Selector de fecha sin hora. Requiere `@vuepic/vue-datepicker`.",
        demos: [
          {
            example: "date/DateInput",
            title: "Uso básico",
            layout: "grid",
            themed: true,
          },
        ],
      },
      {
        id: "base-date-time-input",
        name: "BaseDateTimeInput",
        description: "Selector de fecha y hora.",
        demos: [
          {
            example: "date/DateTimeInput",
            title: "Uso básico",
            layout: "grid",
            themed: true,
          },
        ],
      },
      {
        id: "base-month-year-input",
        name: "BaseMonthInput y BaseYearInput",
        imports: ["BaseMonthInput", "BaseYearInput"],
        description: "Selectores de mes y de año.",
        demos: [
          {
            example: "date/MonthYear",
            title: "Mes y año",
            layout: "grid",
            themed: true,
          },
        ],
      },
      {
        id: "base-date-picker",
        name: "BaseDatePicker",
        description:
          "Wrapper de bajo nivel que acepta configuración mediante `pickerProps`.",
        demos: [
          {
            example: "date/DatePicker",
            title: "Uso básico",
            layout: "grid",
            themed: true,
          },
        ],
      },
    ],
  },
  {
    label: "Navegación",
    icon: "map",
    items: [
      {
        id: "base-breadcrumb",
        name: "BaseBreadcrumb",
        description:
          "Ruta de navegación compatible con objetos de `RouterLink`.",
        demos: [{ example: "breadcrumb/Basic", title: "Uso básico" }],
      },
      {
        id: "base-tabs",
        name: "BaseTabs",
        description: "Pestañas accesibles con flechas, Inicio y Fin.",
        demos: [
          { example: "tabs/Basic", title: "Uso básico", layout: "stack" },
        ],
      },
      {
        id: "base-stepper",
        name: "BaseStepper",
        description:
          "Progreso por pasos en variantes circles, bars, pills y vertical.",
        demos: [
          {
            example: "stepper/Variants",
            title: "Variantes horizontales",
            layout: "stack",
          },
          {
            example: "stepper/Vertical",
            title: "Variante vertical",
            layout: "stack",
          },
        ],
      },
    ],
  },
  {
    label: "Datos",
    icon: "grid",
    items: [
      {
        id: "base-table",
        name: "BaseTable",
        description:
          "Tabla con ordenamiento, selección, paginación y CRUD local.",
        imports: ["BaseTable", "type BaseTableColumn", "type BaseTableRow"],
        demos: [
          { example: "table/Crud", title: "CRUD local", layout: "block" },
        ],
      },
    ],
  },
];
