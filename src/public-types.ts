import type { Component, DefineComponent, Directive } from "vue";

export type LoadingDirective = Directive<HTMLElement, boolean>;

export type Size = "sm" | "md" | "lg";
export type FieldState = "default" | "error" | "success";
export type Tone = "default" | "inverse";
export type InfoType = "" | "primary" | "secondary" | "success" | "danger";
export type SelectValue =
  string | number | boolean | Record<string, unknown> | null;
export type DateValue = Date | string | number | Record<string, unknown> | null;
export type DateRangeValue = [Date | string, Date | string] | null;
export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "inverse"
  | "danger"
  | "ghost-danger";
export type ButtonSize = Size | "icon";

export interface CommonFieldProps {
  id?: string;
  label?: string;
  info?: string;
  infoAriaLabel?: string;
  infoType?: InfoType;
  size?: Size;
  state?: FieldState;
  help?: string;
  error?: string;
  success?: string;
  required?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  tone?: Tone;
}

export interface BaseButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  type?: "button" | "submit" | "reset";
  loading?: boolean;
  disabled?: boolean;
  block?: boolean;
}
export interface BaseLinkProps {
  href: string;
  target?: string;
  rel?: string;
  variant?: "brand" | "body" | "muted" | "inverse";
  size?: Size;
  underline?: "always" | "hover" | "none";
}
export interface BaseIconProps {
  name: string;
  size?: "sm" | "md" | "lg" | "xl";
  label?: string;
  decorative?: boolean;
}
export interface BaseFormSectionProps {
  title?: string;
  description?: string;
  stretch?: boolean;
  titleAs?: "h2" | "h3" | "h4";
}
export interface BaseFormColumnsProps {}
export interface BaseFormRowProps {
  columns?: 1 | 2 | 3 | 4;
  columnWidths?: readonly string[];
  alignItems?: "start" | "center" | "end" | "stretch";
}
export interface BaseCardProps {
  as?: "div" | "section" | "article" | "aside" | "details";
  surface?: "page" | "inverse" | "primary";
  padding?: "comfortable" | "compact" | "none";
  radius?: "md" | "lg";
  elevation?: "none" | "sm" | "md";
  outlined?: boolean;
  title?: string;
  titlePosition?: "inside" | "outside";
  titleIcon?: string;
  titleAs?: "h2" | "h3" | "h4";
}
export interface BaseAlertProps {
  title?: string;
  description?: string;
  tone?: "danger" | "warning" | "info" | "primary" | "secondary";
  icon?: string;
  dismissible?: boolean;
  closeLabel?: string;
}
export interface BaseToastProps {
  open?: boolean;
  title?: string;
  description?: string;
  tone?: "success" | "info" | "warning" | "danger";
  icon?: string;
  dismissible?: boolean;
  closeLabel?: string;
  duration?: number;
  pauseOnHover?: boolean;
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
}
export interface BaseDialogProps {
  open?: boolean;
  title: string;
  description?: string;
  size?: "sm" | "md";
  form?: boolean;
  loading?: boolean;
  closeLabel?: string;
  closeDisabled?: boolean;
}
export interface BaseConfirmDialogProps {
  open?: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  buttonSize?: Size;
  loading?: boolean;
  tone?: "danger" | "primary";
}
export interface BaseHeadingProps {
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span";
  variant?: "hero" | "lg" | "md" | "sm" | "xs";
  color?: "heading" | "body" | "inverse" | "brand";
  align?: "left" | "center" | "right";
}
export interface BaseTextProps {
  as?: "p" | "span" | "div" | "small" | "li";
  variant?: "md" | "sm" | "label" | "xl";
  color?:
    | "body"
    | "muted"
    | "heading"
    | "inverse"
    | "inverse-muted"
    | "brand"
    | "danger"
    | "warning"
    | "inherit";
  weight?: "regular" | "medium" | "semibold" | "bold";
}
export type BaseBadgeTone =
  | "neutral"
  | "info"
  | "success"
  | "warning"
  | "error"
  | "critical"
  | "progress"
  | "violet";
export interface BaseBadgeProps {
  label?: string;
  tone?: BaseBadgeTone;
  size?: "sm" | "md";
  width?: "auto" | "fixed";
}
export type BaseBreadcrumbRouteLocation = string | object;
export interface BaseBreadcrumbItem {
  name: string;
  to?: BaseBreadcrumbRouteLocation;
}
export interface BaseBreadcrumbProps {
  value: readonly BaseBreadcrumbItem[];
  divider?: string;
  size?: "sm" | "md" | "label" | "xl";
  weight?: "regular" | "medium" | "semibold" | "bold";
  ariaLabel?: string;
}
export interface BaseFieldInfoProps {
  text?: string;
  type?: InfoType;
  ariaLabel?: string;
}
export type BaseDropdownMenuColor = "default" | "danger" | "success" | "info";
export interface BaseDropdownMenuItem {
  label: string;
  event: string;
  color?: BaseDropdownMenuColor;
  disabled?: boolean;
  tooltip?: string;
}
export type BaseDropdownMenuGroup = BaseDropdownMenuItem[];
export interface BaseDropdownMenuProps {
  icon?: string;
  groups?: BaseDropdownMenuGroup[];
}
export interface BaseSearchQLTextFilter {
  name: string;
  label: string;
  regex?: boolean;
}
export interface BaseSearchQLDefaultFilterOption {
  value: SelectValue;
  label: string;
}
export interface BaseSearchQLDefaultFilter {
  name: string;
  label: string;
  options: BaseSearchQLDefaultFilterOption[];
  /** @deprecated Retained for compatibility; each field now allows one option. */
  multiple?: boolean;
}
export type BaseSearchQLChange = { name: string; value: SelectValue };
export interface BaseSearchQLTexts {
  placeholder?: string;
  searchAriaLabel?: string;
  searchSuggestionPrefix?: string;
  searchSuggestionConnector?: string;
  defaultFiltersLabel?: string;
  removeFilterAriaLabel?: string;
  noResultsText?: string;
  dateRangeLabel?: string;
  dateRangeAriaLabel?: string;
  acceptDateRangeLabel?: string;
  dateRangePlaceholder?: string;
  dateFromLabel?: string;
  dateToLabel?: string;
  dateLocale?: string;
}
export interface BaseSearchQLProps {
  id?: string;
  size?: Size;
  modelValue?: BaseSearchQLChange[];
  filters?: BaseSearchQLTextFilter[];
  defaultFilters?: BaseSearchQLDefaultFilter[];
  texts?: BaseSearchQLTexts;
  placeholder?: string;
  searchAriaLabel?: string;
  searchSuggestionPrefix?: string;
  searchSuggestionConnector?: string;
  defaultFiltersLabel?: string;
  removeFilterAriaLabel?: string;
  noResultsText?: string;
  showDateRange?: boolean;
  dateRangeRequired?: boolean;
  dateValue?: DateRangeValue;
  dateRangeLabel?: string;
  dateRangeAriaLabel?: string;
  acceptDateRangeLabel?: string;
  dateRangePlaceholder?: string;
  dateFromLabel?: string;
  dateToLabel?: string;
  disabled?: boolean;
}
export interface TabOption {
  label?: string;
  title?: string;
  value?: string | number;
  id?: string;
  panelId?: string;
  disabled?: boolean;
}
export interface BaseTabsProps {
  modelValue?: string | number;
  tabs: TabOption[];
  ariaLabel?: string;
}

export type StepperValue = string | number;
export type BaseStepperVariant = "circles" | "bars" | "pills" | "vertical";
export type StepperDescriptionPosition = "top" | "bottom";

export interface BaseStepperStep {
  value: StepperValue;
  label: string;
  description?: string;
  disabled?: boolean;
}

export interface BaseStepperChangeEvent {
  value: StepperValue;
  previousValue: StepperValue;
  step: BaseStepperStep;
  index: number;
}

export interface BaseStepperProps {
  modelValue: StepperValue;
  steps: BaseStepperStep[];
  variant?: BaseStepperVariant;
  navigable?: boolean;
  showStepDescriptions?: boolean;
  description?: string;
  descriptionPosition?: StepperDescriptionPosition;
  ariaLabel?: string;
  stepDescriptionAriaLabel?: string;
}

export type BaseTableAlignment = "left" | "center" | "right";
export type BaseTableSortDirection = "asc" | "desc";
export type BaseTableRow = Record<string, any>;

export interface BaseTableColumn {
  key: string;
  label: string;
  field?: string | ((row: BaseTableRow) => unknown);
  formatter?: (value: unknown, row: BaseTableRow, rowIndex: number) => unknown;
  sortable?: boolean;
  required?: boolean;
  requiredMessage?: string;
  align?: BaseTableAlignment;
  headerAlign?: BaseTableAlignment;
}

export interface BaseTableSort {
  key: string;
  direction: BaseTableSortDirection;
}

export interface BaseTableProps {
  rows: BaseTableRow[];
  columns: BaseTableColumn[];
  totalItems: number;
  pageSize: number;
  page?: number;
  paginationMode?: "local" | "remote";
  paginationStyle?: "default" | "floating";
  rowKey?: string | ((row: BaseTableRow, index?: number) => string | number);
  loading?: boolean;
  caption?: string;
  emptyText?: string;
  sort?: BaseTableSort | null;
  selectable?: boolean;
  selectedRows?: BaseTableRow[];
  clearSelectionOnPageChange?: boolean;
  addable?: boolean;
  editable?: boolean;
  deletable?: boolean;
}

export interface BaseInputProps extends CommonFieldProps {
  name?: string;
  placeholder?: string;
  type?: string;
  mode?: "edit" | "read";
  suffix?: string;
  maxLength?: number | null;
  maxLengthVisible?: boolean;
  showPasswordAriaLabel?: string;
  hidePasswordAriaLabel?: string;
}
export interface PhoneCountry {
  name: string;
  prefix: string;
  iso2?: string;
  /** Emoji o URI de imagen (por ejemplo, un SVG) para la bandera. */
  flag?: string;
}
export interface BasePhoneInputProps extends CommonFieldProps {
  name?: string;
  countries?: PhoneCountry[];
  defaultCountry?: string;
  placeholder?: string;
  countrySearchPlaceholder?: string;
  noResultsText?: string;
  countrySelectorAriaLabel?: string;
  showFlags?: boolean;
  modelValue?: string;
}
export interface BaseTextareaProps extends CommonFieldProps {
  rows?: number;
  maxLength?: number | null;
  maxLengthVisible?: boolean;
}
export interface BaseCheckboxProps extends CommonFieldProps {
  labelPosition?: "top" | "end";
  name?: string;
  type?: "primary" | "secondary" | "success" | "danger";
  size?: "sm" | "md";
  invalid?: boolean;
  indeterminate?: boolean;
}
export interface BaseRadioProps {
  id: string;
  name: string;
  value: string | number | boolean;
  label?: string;
  labelPosition?: "top" | "end";
  size?: "sm" | "md";
  required?: boolean;
  disabled?: boolean;
  invalid?: boolean;
  modelValue?: string | number | boolean;
}
export interface BaseRadioGroupOption {
  id?: string;
  value: string | number | boolean;
  label: string;
  disabled?: boolean;
}
export interface BaseRadioGroupProps {
  id?: string;
  name: string;
  label?: string;
  options: BaseRadioGroupOption[];
  optionLabelPosition?: "top" | "end";
  orientation?: "vertical" | "horizontal";
  bordered?: boolean;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  modelValue?: string | number | boolean;
}
export interface BaseSwitchProps {
  id: string;
  label?: string;
  labelPosition?: "top" | "end";
  size?: "sm" | "md";
  modelValue?: boolean;
  disabled?: boolean;
  error?: string;
}
export interface SelectOption {
  label?: string;
  value?: SelectValue;
  disabled?: boolean;
  [key: string]: unknown;
}
export interface BaseSelectProps extends CommonFieldProps {
  name?: string;
  placeholder?: string;
  multiple?: boolean;
  allowCreate?: boolean;
  searchPlaceholder?: string;
  createOptionText?: string;
  removeOptionAriaLabel?: string;
  moreSelectedAriaLabel?: string;
  options: Array<SelectValue | SelectOption>;
  modelValue?: SelectValue | SelectValue[];
}
export interface AutocompleteOption {
  label?: string;
  value?: SelectValue;
  disabled?: boolean;
  [key: string]: unknown;
}
export interface BaseAutocompleteProps extends CommonFieldProps {
  options?: Array<SelectValue | AutocompleteOption>;
  fetchOptions?: (
    query: string,
    context: { limit: number; signal: AbortSignal },
  ) => Promise<Array<SelectValue | AutocompleteOption>>;
  allowCreate?: boolean;
  labelKey?: string;
  selectedLabelKey?: string;
  valueKey?: string;
  initialMatchKey?: string;
  initialMatchValue?: string | number;
  minChars?: number;
  debounceMs?: number;
  maxSuggestions?: number;
  clearAriaLabel?: string;
  loadingText?: string;
  noResultsText?: string;
  loadErrorText?: string;
  modelValue?: SelectValue;
}
export interface DatePickerProps extends CommonFieldProps {
  name?: string;
  placeholder?: string;
  clearAriaLabel?: string;
  ariaLabels?: Record<string, string>;
  actionRow?: Record<string, unknown>;
  dayNames?: unknown[] | ((date: Date) => string);
  weekNumbers?: boolean | Record<string, unknown>;
  dark?: boolean;
  clearable?: boolean;
  locale?: string | Record<string, unknown>;
  formats?: Record<string, unknown> | null;
  modelType?: string;
  teleport?: boolean | string | Record<string, unknown>;
  minDate?: Date | string | number;
  maxDate?: Date | string | number;
  disabledDates?: unknown[] | ((date: Date) => boolean);
  allowedDates?: unknown[];
  preventMinMaxNavigation?: boolean;
  filters?: Record<string, unknown>;
  pickerProps?: Record<string, unknown>;
  inputIcon?: "calendar" | "clock";
  modelValue?: DateValue;
}
export interface BaseDateInputProps extends DatePickerProps {
  autoApply?: boolean;
}
export interface BaseDateTimeInputProps extends DatePickerProps {
  autoApply?: boolean;
  minTime?: Record<string, unknown>;
  maxTime?: Record<string, unknown>;
  disabledTimes?: unknown[] | ((time: unknown) => boolean);
  timeConfig?: Record<string, unknown>;
}
export interface BaseMonthInputProps extends DatePickerProps {
  autoApply?: boolean;
}
export interface BaseYearInputProps extends DatePickerProps {
  autoApply?: boolean;
  modelValue?: number | null;
}
export interface BaseSignatureProps {
  id?: string;
  label?: string;
  help?: string;
  error?: string;
  clearAriaLabel?: string;
  drawingInstructions?: string;
  width?: number;
  height?: number;
  required?: boolean;
  disabled?: boolean;
  modelValue?: string | null;
}

export type TypedComponent<Props, Model = never> = DefineComponent<Props> & {
  new (): ComponentPublicInstance<Props, Model>;
};

type ComponentPublicInstance<Props, Model> = Component & {
  $props: Props;
  $emit: (event: string, ...args: any[]) => void;
} & (Model extends never ? {} : Model);
