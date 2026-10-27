# Tema y tokens CSS

## Principio

Los componentes solo consumen tokens CSS públicos. El paquete no fija una paleta ni detecta el modo
oscuro con JavaScript. Un portal activa su variante aplicando sus valores a `:root`, una clase o un
atributo, por ejemplo `:root[data-theme='dark']`.

El layout de formularios usa `--bs-form-field-gap` entre controles, `--bs-form-section-gap` entre
la cabecera y el contenido de una sección, y `--bs-field-gap` entre la etiqueta y el control.
`--bs-choice-field-min-height` define la altura estructural mínima de radios y switches para
mantener un ritmo visual consistente con los controles de formulario.
`--bs-field-message-min-height` reserva el espacio de mensajes para evitar saltos al mostrar
errores. Las aplicaciones pueden sobrescribir estos tokens en su tema, por ejemplo para un iframe
más compacto:

```css
:root {
  --bs-form-field-gap: 0.75rem;
  --bs-form-section-gap: 1.5rem;
  --bs-form-label-color: var(--bs-color-text-muted);
  --bs-form-value-color: var(--bs-color-text-heading);
  --bs-form-label-size: var(--text-label-size);
}
```

`--bs-form-label-color` controla el color de las etiquetas auxiliares y
`--bs-form-value-color` el de los valores introducidos o seleccionables. Ambos tokens son
independientes de los colores globales de texto, para que cada proyecto pueda ajustar la jerarquia
visual de sus formularios. `--bs-form-label-size` permite ajustar el tamaño tipografico de esas
etiquetas sin modificar el resto de textos con variante `label`.

El paquete incluye los temas `@alon16/components-ui-base/themes/violet.css` y
`@alon16/components-ui-base/themes/dark-example.css` como referencia y punto de partida. Son opcionales:
un portal puede importarlos o definir su propio archivo de tema.

El tema violeta usa un primario violeta (`#7c3aed`) con texto blanco encima y un secundario ciruela
(`#2e1065`) para títulos, superficies invertidas y acciones secundarias. El tema oscuro de ejemplo
aclara el primario (`#a78bfa`) y usa texto oscuro sobre él para conservar el contraste.

## Tokens compartidos de controles

Los controles de formulario y sus menús (`BaseInput`, `BaseTextarea`, `BaseSelect`,
`BaseAutocomplete`, `BaseDatePicker`, `BasePhoneInput`, `BaseSearchQL` y `BaseDropdownMenu`)
comparten estos tokens visuales:

| Token                                                    | Uso                                             |
| -------------------------------------------------------- | ----------------------------------------------- |
| `--bs-control-background`                                | Fondo normal de controles de formulario.        |
| `--bs-control-focus-background`                          | Fondo del control mientras tiene el foco.       |
| `--bs-overlay-background`                                | Fondo de menús y capas desplegables.            |
| `--bs-control-border`                                    | Borde normal de controles y capas desplegables. |
| `--bs-control-disabled-background`                       | Fondo de controles deshabilitados.              |
| `--bs-control-disabled-border`                           | Borde de controles deshabilitados.              |
| `--bs-control-hover-border`                              | Borde al pasar el puntero.                      |
| `--bs-control-focus-border`, `--bs-control-focus-shadow` | Borde y halo de foco.                           |

El tema violeta y el oscuro los derivan de las superficies y bordes globales. Un tema propio puede
sobrescribirlos sin modificar los componentes. Los tokens de error, éxito, selección y checked
siguen siendo específicos cuando representan un estado semántico distinto.

Los elementos auxiliares también exponen tokens centralizados: `--bs-dialog-backdrop-background`,
`--bs-loading-overlay-background` y `--bs-tooltip-border`.

## Tema mínimo

```css
:root {
  --bs-color-surface-page: #ffffff;
  --bs-color-surface-subtle: #faf9fc;
  --bs-color-surface-muted: #f4f2f8;
  --bs-color-surface-inverse: #2e1065;
  --bs-color-surface-inverse-hover: rgb(255 255 255 / 6%);
  --bs-color-surface-highlight: #ede9fe;
  --bs-color-text-heading: #2e1065;
  --bs-color-text-body: #3a3448;
  --bs-color-text-muted: #6e6780;
  --bs-color-text-inverse: #ffffff;
  --bs-color-text-inverse-muted: #d6d0e0;
  --bs-color-text-on-primary: #ffffff;
  --bs-color-border-default: #e9e5f0;
  --bs-color-border-strong: #d6d0e0;
  --bs-color-border-inverse: rgb(255 255 255 / 14%);
  --bs-color-brand-primary: #7c3aed;
  --bs-color-brand-primary-hover: #6d28d9;
  --bs-color-brand-secondary: #2e1065;
  --bs-color-brand-secondary-hover: #3b1580;
  --bs-color-action-primary: var(--bs-color-brand-primary);
  --bs-color-action-primary-hover: var(--bs-color-brand-primary-hover);
  --bs-color-action-secondary: var(--bs-color-brand-secondary);
  --bs-color-action-danger: #c73535;
  --bs-color-action-danger-hover: #ae2f2f;
  --bs-color-focus-ring: var(--bs-color-brand-primary);
  --bs-color-focus-shadow: rgb(124 58 237 / 22%);
  --bs-color-state-error: #c73535;
  --bs-color-state-error-surface: #fdecec;
  --bs-color-state-success: #157347;
  --bs-color-state-success-surface: #e9f7ef;
  --bs-signature-canvas-background: var(--bs-color-surface-page);
  --bs-signature-guide-color: #a29bb0;
  --bs-signature-ink-color: #2a2535;
  --bs-field-info-hover-background: var(--bs-color-surface-subtle);
  --bs-field-info-focus-border: var(--bs-color-border-strong);
  --bs-field-info-focus-shadow: rgb(110 103 128 / 18%);
  --bs-field-info-tooltip-border: var(--bs-color-border-default);
  --bs-alert-danger-background: var(--bs-color-state-error-surface);
  --bs-alert-danger-border: var(--bs-color-state-error);
  --bs-alert-danger-text: var(--bs-color-state-error);
  --bs-alert-warning-background: var(--bs-color-surface-highlight);
  --bs-alert-warning-border: var(--bs-color-state-warning);
  --bs-alert-warning-text: var(--bs-color-state-warning);
  --bs-alert-info-background: var(--bs-color-surface-subtle);
  --bs-alert-info-border: var(--bs-color-status-info-text);
  --bs-alert-info-text: var(--bs-color-status-info-text);
  --bs-alert-primary-background: var(--bs-color-surface-highlight);
  --bs-alert-primary-border: var(--bs-color-brand-primary);
  --bs-alert-primary-text: var(--bs-color-brand-secondary);
  --bs-alert-secondary-background: var(--bs-color-surface-muted);
  --bs-alert-secondary-border: var(--bs-color-brand-secondary);
  --bs-alert-secondary-text: var(--bs-color-brand-secondary);
  --bs-alert-close-hover-background: var(--bs-color-surface-muted);
  --bs-breadcrumb-gap-block: var(--space-1);
  --bs-breadcrumb-gap-inline: var(--space-2);
  --bs-breadcrumb-transition: var(--transition-fast);
  --bs-breadcrumb-underline-offset: var(--space-1);
  --bs-breadcrumb-focus-radius: var(--radius-sm);
  --bs-breadcrumb-focus-width: var(--focus-outline-width);
  --bs-breadcrumb-focus-offset: var(--focus-outline-offset);
}
```

Los estilos del paquete deben incluir los tokens estructurales de espaciado, radios, sombras,
tipografÃ­a, transiciones y `--layer-loading`, que controla la superposiciÃ³n visual de los estados de carga.
tipografía y transiciones. El portal solo proporciona los valores visuales y las variantes de
componente que correspondan a su identidad.

## Tokens de BaseCard

`--bs-card-background` controla el fondo de `BaseCard` y permite mantenerlo separado de los
fondos de inputs y menús. `--bs-card-padding-compact` controla el padding de `BaseCard` cuando
`padding="compact"`.
El tema violeta y el oscuro lo establecen en `var(--space-4)`; en pantallas pequeñas el componente
mantiene `var(--space-5)` como ajuste responsive. Un tema propio puede sobrescribir el token, por
ejemplo:

```css
:root {
  --bs-card-padding-compact: var(--space-5);
}
```

## Tokens de capas desplegables

`--bs-overlay-background` controla el fondo de las capas de opciones de `BaseSelect`,
`BaseAutocomplete`, `BaseDropdownMenu`, `BasePhoneInput` y `BaseSearchQL`.

`--bs-control-border` controla el borde de los controles y de las capas de opciones de
`BaseSelect`, `BaseAutocomplete`, `BaseDropdownMenu` y `BaseSearchQL`. Los temas de referencia
incluyen valores propios para mantener ambos elementos visibles también en modo oscuro; un tema
personalizado debe sobrescribir este token directamente si necesita otro contraste.

`--bs-tabs-margin-bottom` controla el margen exterior inferior de `BaseTabs`. Su valor predeterminado
es `0`; el consumidor puede asignar el espacio necesario según la relación entre las pestañas y su
panel.

## Tokens de BaseTable

`--bs-table-cell-leading` controla el interlineado del contenido de las celdas, también el de los
`BaseText` que se pinten dentro. El tema violeta y el oscuro lo establecen en
`var(--line-height-heading)`, más compacto que el de los párrafos, para que una celda con dos líneas
(p. ej. nombre y email) no quede separada. Un tema propio puede sobrescribirlo:

```css
:root {
  --bs-table-cell-leading: var(--line-height-base);
}
```

`BaseTable` expone tokens globales para que sus espacios internos expresen la intención visual en
lugar de depender de nombres numéricos. Los valores predeterminados están en el contrato y cada tema
puede sobrescribirlos:

Los valores predeterminados mantienen la escala usada por el proyecto consumidor anterior:
`0` para los resets, `8px` para separaciones compactas, `4px` para el padding vertical y `16px`
para el padding horizontal.

| Token                                      | Uso                                                                      |
| ------------------------------------------ | ------------------------------------------------------------------------ |
| `--bs-table-sort-icon-gap`                 | Separación entre el texto y el icono de ordenamiento.                    |
| `--bs-table-edit-row-padding-block`        | Padding vertical de las filas de alta y edición.                         |
| `--bs-table-pagination-gap`                | Separación entre los controles de paginación.                            |
| `--bs-table-cell-padding-block`            | Padding vertical de las celdas.                                          |
| `--bs-table-cell-padding-inline`           | Padding horizontal de las celdas.                                        |
| `--bs-table-row-min-height`                | Altura mínima de las filas de datos; el contenido puede hacerlas crecer. |
| `--bs-table-selection-cell-padding-inline` | Padding horizontal de la columna de selección.                           |
| `--bs-table-footer-gap`                    | Separación entre los elementos del footer.                               |
| `--bs-table-footer-padding-block`          | Padding vertical del footer.                                             |
| `--bs-table-footer-padding-inline`         | Padding horizontal del footer.                                           |
| `--bs-table-summary-gap`                   | Separación entre los resúmenes del footer.                               |
| `--bs-table-ellipsis-min-width`            | Ancho mínimo del indicador de elipsis de paginación.                     |
| `--bs-table-control-padding`               | Elimina el padding de controles compactos.                               |
| `--bs-table-control-border`                | Elimina el borde de controles sin borde.                                 |
| `--bs-table-summary-margin`                | Elimina el margen predeterminado de resúmenes.                           |
| `--bs-table-border-spacing`                | Controla la separación interna de la tabla.                              |
| `--bs-table-last-row-border`               | Controla el borde inferior de la última fila.                            |

## Tokens de BaseAlert

Cada tono define fondo, borde y texto con `--bs-alert-{tono}-{background,border,text}`.
`--bs-alert-close-hover-background` controla el fondo al pasar sobre el botón de cierre. Los temas
violeta y oscuro incluyen los valores de referencia; los temas propios deben definir estos tokens.

## Tokens de BaseBadge

Cada tono de `BaseBadge` expone tokens independientes para texto, fondo y borde:
`--bs-badge-{tone}-text`, `--bs-badge-{tone}-background` y `--bs-badge-{tone}-border`.
Los tonos disponibles son `neutral`, `info`, `success`, `warning`, `error`, `critical`, `progress` y
`violet`.
Los tokens de tamaño incluyen también `--bs-badge-sm-line-height` y `--bs-badge-md-line-height`.
También se pueden ajustar `--bs-badge-sm-padding-*`, `--bs-badge-md-padding-*` y
`--bs-badge-fixed-width`.

## Tokens del breadcrumb

| Token                                                                                         | Uso                                     |
| --------------------------------------------------------------------------------------------- | --------------------------------------- |
| `--bs-breadcrumb-gap-block`, `--bs-breadcrumb-gap-inline`                                     | Separación entre niveles y líneas       |
| `--bs-breadcrumb-transition`, `--bs-breadcrumb-underline-offset`                              | Respuesta visual de los enlaces         |
| `--bs-breadcrumb-focus-radius`, `--bs-breadcrumb-focus-width`, `--bs-breadcrumb-focus-offset` | Contorno de foco visible de los enlaces |

## Tokens del selector de fecha

`BaseDatePicker` traduce estos tokens a las variables privadas `--dp-*` de Vue Datepicker. Los
consumidores nunca necesitan modificar `--dp-*` directamente.

| Familia                                                                                 | Uso                                   |
| --------------------------------------------------------------------------------------- | ------------------------------------- |
| `--bs-date-picker-menu-background`, `-text`, `-muted-text`, `-icon`                     | Superficie y contenido del calendario |
| `--bs-date-picker-menu-hover-background`, `-hover-text`, `-hover-icon`, `-hover-border` | Hover y navegación                    |
| `--bs-date-picker-menu-selected-background`, `-selected-text`, `-selected-disabled`     | Fecha u hora seleccionada             |
| `--bs-date-picker-menu-border`, `-focus-border`                                         | Bordes y foco                         |
| `--bs-date-picker-menu-disabled-background`, `-disabled-text`                           | Elementos no disponibles              |
| `--bs-date-picker-menu-highlight`, `-range-background`, `-range-text`, `-range-border`  | Marcado y rangos                      |
| `--bs-date-picker-menu-success`, `-danger`, `-marker`, `-tooltip-background`            | Estados auxiliares                    |
| `--bs-date-picker-menu-scrollbar-track`, `-scrollbar-thumb`, `-loader`                  | Controles internos                    |

## Modo oscuro

Un tema oscuro debe reemplazar también las superficies de estado. No dejes que `error-surface` y
`success-surface` hereden valores claros. Si el primario del tema claro es oscuro, redefine también
`--bs-color-brand-*`, `--bs-color-action-*`, `--bs-color-focus-*` y `--bs-color-text-on-primary`
para que los botones y el foco mantengan el contraste:

```css
:root[data-theme="dark"] {
  color-scheme: dark;
  --bs-color-brand-primary: #a78bfa;
  --bs-color-action-primary: var(--bs-color-brand-primary);
  --bs-color-text-on-primary: #1e0b3d;
  --bs-color-surface-page: #15121c;
  --bs-color-surface-muted: #2a2536;
  --bs-color-text-body: #e9e5f0;
  --bs-color-state-error: #ff8080;
  --bs-color-state-error-surface: #3b1e24;
  --bs-color-state-success: #69d391;
  --bs-color-state-success-surface: #183627;
}
```
