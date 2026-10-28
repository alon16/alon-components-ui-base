# Tema y tokens CSS

## Principio

Los componentes solo consumen tokens CSS públicos. El paquete no fija una paleta ni detecta el modo
oscuro con JavaScript. Un portal activa su variante aplicando sus valores a `:root`, una clase o un
atributo, por ejemplo `:root[data-theme='dark']`.

Todos los tokens semánticos usan el prefijo `--ui-`.

## Migración desde `--bs-*`

Las versiones anteriores usaban el prefijo `--bs-`, que coincide con el de las variables de
Bootstrap 5. El prefijo pasó a ser `--ui-` sin alias de compatibilidad: un tema que siga
declarando `--bs-*` deja de aplicarse sin mostrar errores. Los nombres conservan el resto de su
estructura, así que basta con reemplazar el prefijo en los temas y estilos del portal:

```bash
# Revisa el resultado con git diff antes de confirmar.
grep -rl -- "--bs-" src | xargs sed -i 's/--bs-/--ui-/g'
```

Si el portal también usa Bootstrap, limita el reemplazo a los archivos del tema de esta biblioteca
para no modificar las variables propias de Bootstrap. La hoja interna `bs-tokens-contract.css` se
renombró a `ui-tokens-contract.css`; no forma parte de las exportaciones del paquete, por lo que no
requiere cambios en los portales.

El layout de formularios usa `--ui-form-field-gap` entre controles, `--ui-form-section-gap` entre
la cabecera y el contenido de una sección, y `--ui-field-gap` entre la etiqueta y el control.
`--ui-choice-field-min-height` define la altura estructural mínima de radios y switches para
mantener un ritmo visual consistente con los controles de formulario.
`--ui-field-message-min-height` reserva el espacio de mensajes para evitar saltos al mostrar
errores. Las aplicaciones pueden sobrescribir estos tokens en su tema, por ejemplo para un iframe
más compacto:

```css
:root {
  --ui-form-field-gap: 0.75rem;
  --ui-form-section-gap: 1.5rem;
  --ui-form-label-color: var(--ui-color-text-muted);
  --ui-form-value-color: var(--ui-color-text-heading);
  --ui-form-label-size: var(--text-label-size);
}
```

`--ui-form-label-color` controla el color de las etiquetas auxiliares y
`--ui-form-value-color` el de los valores introducidos o seleccionables. Ambos tokens son
independientes de los colores globales de texto, para que cada proyecto pueda ajustar la jerarquia
visual de sus formularios. `--ui-form-label-size` permite ajustar el tamaño tipografico de esas
etiquetas sin modificar el resto de textos con variante `label`.

El paquete incluye los temas `@alon16/alon-components-ui-base/themes/violet.css` y
`@alon16/alon-components-ui-base/themes/dark-example.css` como referencia y punto de partida. Son opcionales:
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
| `--ui-control-background`                                | Fondo normal de controles de formulario.        |
| `--ui-control-focus-background`                          | Fondo del control mientras tiene el foco.       |
| `--ui-overlay-background`                                | Fondo de menús y capas desplegables.            |
| `--ui-control-border`                                    | Borde normal de controles y capas desplegables. |
| `--ui-control-disabled-background`                       | Fondo de controles deshabilitados.              |
| `--ui-control-disabled-border`                           | Borde de controles deshabilitados.              |
| `--ui-control-hover-border`                              | Borde al pasar el puntero.                      |
| `--ui-control-focus-border`, `--ui-control-focus-shadow` | Borde y halo de foco.                           |

El tema violeta y el oscuro los derivan de las superficies y bordes globales. Un tema propio puede
sobrescribirlos sin modificar los componentes. Los tokens de error, éxito, selección y checked
siguen siendo específicos cuando representan un estado semántico distinto.

Los elementos auxiliares también exponen tokens centralizados: `--ui-dialog-backdrop-background`,
`--ui-loading-overlay-background` y `--ui-tooltip-border`.

## Tema mínimo

```css
:root {
  --ui-color-surface-page: #ffffff;
  --ui-color-surface-subtle: #faf9fc;
  --ui-color-surface-muted: #f4f2f8;
  --ui-color-surface-inverse: #2e1065;
  --ui-color-surface-inverse-hover: rgb(255 255 255 / 6%);
  --ui-color-surface-highlight: #ede9fe;
  --ui-color-text-heading: #2e1065;
  --ui-color-text-body: #3a3448;
  --ui-color-text-muted: #6e6780;
  --ui-color-text-inverse: #ffffff;
  --ui-color-text-inverse-muted: #d6d0e0;
  --ui-color-text-on-primary: #ffffff;
  --ui-color-border-default: #e9e5f0;
  --ui-color-border-strong: #d6d0e0;
  --ui-color-border-inverse: rgb(255 255 255 / 14%);
  --ui-color-brand-primary: #7c3aed;
  --ui-color-brand-primary-hover: #6d28d9;
  --ui-color-brand-secondary: #2e1065;
  --ui-color-brand-secondary-hover: #3b1580;
  --ui-color-action-primary: var(--ui-color-brand-primary);
  --ui-color-action-primary-hover: var(--ui-color-brand-primary-hover);
  --ui-color-action-secondary: var(--ui-color-brand-secondary);
  --ui-color-action-danger: #c73535;
  --ui-color-action-danger-hover: #ae2f2f;
  --ui-color-focus-ring: var(--ui-color-brand-primary);
  --ui-color-focus-shadow: rgb(124 58 237 / 22%);
  --ui-color-state-error: #c73535;
  --ui-color-state-error-surface: #fdecec;
  --ui-color-state-success: #157347;
  --ui-color-state-success-surface: #e9f7ef;
  --ui-signature-canvas-background: var(--ui-color-surface-page);
  --ui-signature-guide-color: #a29bb0;
  --ui-signature-ink-color: #2a2535;
  --ui-field-info-hover-background: var(--ui-color-surface-subtle);
  --ui-field-info-focus-border: var(--ui-color-border-strong);
  --ui-field-info-focus-shadow: rgb(110 103 128 / 18%);
  --ui-field-info-tooltip-border: var(--ui-color-border-default);
  --ui-alert-danger-background: var(--ui-color-state-error-surface);
  --ui-alert-danger-border: var(--ui-color-state-error);
  --ui-alert-danger-text: var(--ui-color-state-error);
  --ui-alert-warning-background: var(--ui-color-surface-highlight);
  --ui-alert-warning-border: var(--ui-color-state-warning);
  --ui-alert-warning-text: var(--ui-color-state-warning);
  --ui-alert-info-background: var(--ui-color-surface-subtle);
  --ui-alert-info-border: var(--ui-color-status-info-text);
  --ui-alert-info-text: var(--ui-color-status-info-text);
  --ui-alert-primary-background: var(--ui-color-surface-highlight);
  --ui-alert-primary-border: var(--ui-color-brand-primary);
  --ui-alert-primary-text: var(--ui-color-brand-secondary);
  --ui-alert-secondary-background: var(--ui-color-surface-muted);
  --ui-alert-secondary-border: var(--ui-color-brand-secondary);
  --ui-alert-secondary-text: var(--ui-color-brand-secondary);
  --ui-alert-close-hover-background: var(--ui-color-surface-muted);
  --ui-breadcrumb-gap-block: var(--space-1);
  --ui-breadcrumb-gap-inline: var(--space-2);
  --ui-breadcrumb-transition: var(--transition-fast);
  --ui-breadcrumb-underline-offset: var(--space-1);
  --ui-breadcrumb-focus-radius: var(--radius-sm);
  --ui-breadcrumb-focus-width: var(--focus-outline-width);
  --ui-breadcrumb-focus-offset: var(--focus-outline-offset);
}
```

Los estilos del paquete deben incluir los tokens estructurales de espaciado, radios, sombras,
tipografÃ­a, transiciones y `--layer-loading`, que controla la superposiciÃ³n visual de los estados de carga.
tipografía y transiciones. El portal solo proporciona los valores visuales y las variantes de
componente que correspondan a su identidad.

## Tokens de BaseCard

`--ui-card-background` controla el fondo de `BaseCard` y permite mantenerlo separado de los
fondos de inputs y menús. `--ui-card-padding-compact` controla el padding de `BaseCard` cuando
`padding="compact"`.
El tema violeta y el oscuro lo establecen en `var(--space-4)`; en pantallas pequeñas el componente
mantiene `var(--space-5)` como ajuste responsive. Un tema propio puede sobrescribir el token, por
ejemplo:

```css
:root {
  --ui-card-padding-compact: var(--space-5);
}
```

## Tokens de capas desplegables

`--ui-overlay-background` controla el fondo de las capas de opciones de `BaseSelect`,
`BaseAutocomplete`, `BaseDropdownMenu`, `BasePhoneInput` y `BaseSearchQL`.

`--ui-control-border` controla el borde de los controles y de las capas de opciones de
`BaseSelect`, `BaseAutocomplete`, `BaseDropdownMenu` y `BaseSearchQL`. Los temas de referencia
incluyen valores propios para mantener ambos elementos visibles también en modo oscuro; un tema
personalizado debe sobrescribir este token directamente si necesita otro contraste.

`--ui-tabs-margin-bottom` controla el margen exterior inferior de `BaseTabs`. Su valor predeterminado
es `0`; el consumidor puede asignar el espacio necesario según la relación entre las pestañas y su
panel.

## Tokens de BaseTable

`--ui-table-cell-leading` controla el interlineado del contenido de las celdas, también el de los
`BaseText` que se pinten dentro. El tema violeta y el oscuro lo establecen en
`var(--line-height-heading)`, más compacto que el de los párrafos, para que una celda con dos líneas
(p. ej. nombre y email) no quede separada. Un tema propio puede sobrescribirlo:

```css
:root {
  --ui-table-cell-leading: var(--line-height-base);
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
| `--ui-table-sort-icon-gap`                 | Separación entre el texto y el icono de ordenamiento.                    |
| `--ui-table-edit-row-padding-block`        | Padding vertical de las filas de alta y edición.                         |
| `--ui-table-pagination-gap`                | Separación entre los controles de paginación.                            |
| `--ui-table-cell-padding-block`            | Padding vertical de las celdas.                                          |
| `--ui-table-cell-padding-inline`           | Padding horizontal de las celdas.                                        |
| `--ui-table-row-min-height`                | Altura mínima de las filas de datos; el contenido puede hacerlas crecer. |
| `--ui-table-selection-cell-padding-inline` | Padding horizontal de la columna de selección.                           |
| `--ui-table-footer-gap`                    | Separación entre los elementos del footer.                               |
| `--ui-table-footer-padding-block`          | Padding vertical del footer.                                             |
| `--ui-table-footer-padding-inline`         | Padding horizontal del footer.                                           |
| `--ui-table-summary-gap`                   | Separación entre los resúmenes del footer.                               |
| `--ui-table-ellipsis-min-width`            | Ancho mínimo del indicador de elipsis de paginación.                     |
| `--ui-table-control-padding`               | Elimina el padding de controles compactos.                               |
| `--ui-table-control-border`                | Elimina el borde de controles sin borde.                                 |
| `--ui-table-summary-margin`                | Elimina el margen predeterminado de resúmenes.                           |
| `--ui-table-border-spacing`                | Controla la separación interna de la tabla.                              |
| `--ui-table-last-row-border`               | Controla el borde inferior de la última fila.                            |

## Tokens de BaseAlert

Cada tono define fondo, borde y texto con `--ui-alert-{tono}-{background,border,text}`.
`--ui-alert-close-hover-background` controla el fondo al pasar sobre el botón de cierre. Los temas
violeta y oscuro incluyen los valores de referencia; los temas propios deben definir estos tokens.

## Tokens de BaseBadge

Cada tono de `BaseBadge` expone tokens independientes para texto, fondo y borde:
`--ui-badge-{tone}-text`, `--ui-badge-{tone}-background` y `--ui-badge-{tone}-border`.
Los tonos disponibles son `neutral`, `info`, `success`, `warning`, `error`, `critical`, `progress` y
`violet`.
Los tokens de tamaño incluyen también `--ui-badge-sm-line-height` y `--ui-badge-md-line-height`.
También se pueden ajustar `--ui-badge-sm-padding-*`, `--ui-badge-md-padding-*` y
`--ui-badge-fixed-width`.

## Tokens del breadcrumb

| Token                                                                                         | Uso                                     |
| --------------------------------------------------------------------------------------------- | --------------------------------------- |
| `--ui-breadcrumb-gap-block`, `--ui-breadcrumb-gap-inline`                                     | Separación entre niveles y líneas       |
| `--ui-breadcrumb-transition`, `--ui-breadcrumb-underline-offset`                              | Respuesta visual de los enlaces         |
| `--ui-breadcrumb-focus-radius`, `--ui-breadcrumb-focus-width`, `--ui-breadcrumb-focus-offset` | Contorno de foco visible de los enlaces |

## Tokens del selector de fecha

`BaseDatePicker` traduce estos tokens a las variables privadas `--dp-*` de Vue Datepicker. Los
consumidores nunca necesitan modificar `--dp-*` directamente.

| Familia                                                                                 | Uso                                   |
| --------------------------------------------------------------------------------------- | ------------------------------------- |
| `--ui-date-picker-menu-background`, `-text`, `-muted-text`, `-icon`                     | Superficie y contenido del calendario |
| `--ui-date-picker-menu-hover-background`, `-hover-text`, `-hover-icon`, `-hover-border` | Hover y navegación                    |
| `--ui-date-picker-menu-selected-background`, `-selected-text`, `-selected-disabled`     | Fecha u hora seleccionada             |
| `--ui-date-picker-menu-border`, `-focus-border`                                         | Bordes y foco                         |
| `--ui-date-picker-menu-disabled-background`, `-disabled-text`                           | Elementos no disponibles              |
| `--ui-date-picker-menu-highlight`, `-range-background`, `-range-text`, `-range-border`  | Marcado y rangos                      |
| `--ui-date-picker-menu-success`, `-danger`, `-marker`, `-tooltip-background`            | Estados auxiliares                    |
| `--ui-date-picker-menu-scrollbar-track`, `-scrollbar-thumb`, `-loader`                  | Controles internos                    |

## Modo oscuro

Un tema oscuro debe reemplazar también las superficies de estado. No dejes que `error-surface` y
`success-surface` hereden valores claros. Si el primario del tema claro es oscuro, redefine también
`--ui-color-brand-*`, `--ui-color-action-*`, `--ui-color-focus-*` y `--ui-color-text-on-primary`
para que los botones y el foco mantengan el contraste:

```css
:root[data-theme="dark"] {
  color-scheme: dark;
  --ui-color-brand-primary: #a78bfa;
  --ui-color-action-primary: var(--ui-color-brand-primary);
  --ui-color-text-on-primary: #1e0b3d;
  --ui-color-surface-page: #15121c;
  --ui-color-surface-muted: #2a2536;
  --ui-color-text-body: #e9e5f0;
  --ui-color-state-error: #ff8080;
  --ui-color-state-error-surface: #3b1e24;
  --ui-color-state-success: #69d391;
  --ui-color-state-success-surface: #183627;
}
```
