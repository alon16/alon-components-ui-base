import "./styles.css";
import type { Directive } from "vue";

import _BaseAutocomplete from "./components/BaseAutocomplete.vue";
import _BaseAlert from "./components/BaseAlert.vue";
import _BaseToast from "./components/BaseToast.vue";
import _BaseBreadcrumb from "./components/BaseBreadcrumb.vue";
import _BaseButton from "./components/BaseButton.vue";
import _BaseBadge from "./components/BaseBadge.vue";
import _BaseCard from "./components/BaseCard.vue";
import _BaseCheckbox from "./components/BaseCheckbox.vue";
import _BaseConfirmDialog from "./components/BaseConfirmDialog.vue";
import _BaseDateInput from "./components/BaseDateInput.vue";
import _BaseDatePicker from "./components/BaseDatePicker.vue";
import _BaseDateTimeInput from "./components/BaseDateTimeInput.vue";
import _BaseDropdownMenu from "./components/BaseDropdownMenu.vue";
import _BaseDialog from "./components/BaseDialog.vue";
import _BaseFieldInfo from "./components/BaseFieldInfo.vue";
import _BaseFormRow from "./components/BaseFormRow.vue";
import _BaseFormColumns from "./components/BaseFormColumns.vue";
import _BaseFormSection from "./components/BaseFormSection.vue";
import _BaseHeading from "./components/BaseHeading.vue";
import _BaseInput from "./components/BaseInput.vue";
import _BaseIcon from "./components/BaseIcon.vue";
import _BaseLink from "./components/BaseLink.vue";
import _BasePhoneInput from "./components/BasePhoneInput.vue";
import _BaseMonthInput from "./components/BaseMonthInput.vue";
import _BaseRadio from "./components/BaseRadio.vue";
import _BaseRadioGroup from "./components/BaseRadioGroup.vue";
import _BaseSelect from "./components/BaseSelect.vue";
import _BaseSearchQL from "./components/BaseSearchQL.vue";
import _BaseSignature from "./components/BaseSignature.vue";
import _BaseStepper from "./components/BaseStepper.vue";
import _BaseSwitch from "./components/BaseSwitch.vue";
import _BaseTable from "./components/BaseTable.vue";
import _BaseTabs from "./components/BaseTabs.vue";
import _BaseText from "./components/BaseText.vue";
import _BaseTextarea from "./components/BaseTextarea.vue";
import _BaseYearInput from "./components/BaseYearInput.vue";
import { tooltip as tooltipDirective } from "./directives/tooltip";
import { loading as loadingDirective } from "./directives/loading";
import type {
  BaseAutocompleteProps,
  BaseAlertProps,
  BaseToastProps,
  BaseBreadcrumbProps,
  BaseButtonProps,
  BaseBadgeProps,
  BaseCardProps,
  BaseCheckboxProps,
  BaseConfirmDialogProps,
  BaseDateInputProps,
  BaseDateTimeInputProps,
  BaseDropdownMenuProps,
  BaseDialogProps,
  BaseFieldInfoProps,
  BaseFormRowProps,
  BaseFormColumnsProps,
  BaseFormSectionProps,
  BaseHeadingProps,
  BaseInputProps,
  BaseIconProps,
  BaseLinkProps,
  BasePhoneInputProps,
  BaseMonthInputProps,
  BaseRadioProps,
  BaseRadioGroupProps,
  BaseSelectProps,
  BaseSearchQLProps,
  BaseSearchQLTexts,
  BaseSignatureProps,
  BaseStepperProps,
  BaseSwitchProps,
  BaseTableProps,
  BaseTabsProps,
  BaseTextProps,
  BaseTextareaProps,
  BaseYearInputProps,
  DatePickerProps,
  DateRangeValue,
  DateValue,
  LoadingDirective,
  TypedComponent,
} from "./public-types";

export const BaseAutocomplete =
  _BaseAutocomplete as TypedComponent<BaseAutocompleteProps>;
export const BaseAlert = _BaseAlert as TypedComponent<BaseAlertProps>;
export const BaseToast = _BaseToast as TypedComponent<BaseToastProps>;
export const BaseBreadcrumb =
  _BaseBreadcrumb as TypedComponent<BaseBreadcrumbProps>;
export const BaseButton = _BaseButton as TypedComponent<BaseButtonProps>;
export const BaseBadge = _BaseBadge as TypedComponent<BaseBadgeProps>;
export const BaseCard = _BaseCard as TypedComponent<BaseCardProps>;
export const BaseCheckbox = _BaseCheckbox as TypedComponent<BaseCheckboxProps>;
export const BaseDialog = _BaseDialog as TypedComponent<BaseDialogProps>;
export const BaseConfirmDialog =
  _BaseConfirmDialog as TypedComponent<BaseConfirmDialogProps>;
export const BaseDateInput =
  _BaseDateInput as unknown as TypedComponent<BaseDateInputProps>;
export const BaseDatePicker =
  _BaseDatePicker as TypedComponent<DatePickerProps>;
export const BaseDateTimeInput =
  _BaseDateTimeInput as TypedComponent<BaseDateTimeInputProps>;
export const BaseDropdownMenu =
  _BaseDropdownMenu as TypedComponent<BaseDropdownMenuProps>;
export const BaseFieldInfo =
  _BaseFieldInfo as TypedComponent<BaseFieldInfoProps>;
export const BaseFormRow = _BaseFormRow as TypedComponent<BaseFormRowProps>;
export const BaseFormColumns =
  _BaseFormColumns as TypedComponent<BaseFormColumnsProps>;
export const BaseFormSection =
  _BaseFormSection as TypedComponent<BaseFormSectionProps>;
export const BaseHeading = _BaseHeading as TypedComponent<BaseHeadingProps>;
export const BaseInput = _BaseInput as TypedComponent<BaseInputProps>;
export const BaseIcon = _BaseIcon as TypedComponent<BaseIconProps>;
export const BaseLink = _BaseLink as TypedComponent<BaseLinkProps>;
export const BasePhoneInput =
  _BasePhoneInput as TypedComponent<BasePhoneInputProps>;
export const BaseMonthInput =
  _BaseMonthInput as TypedComponent<BaseMonthInputProps>;
export const BaseRadio = _BaseRadio as TypedComponent<BaseRadioProps>;
export const BaseRadioGroup =
  _BaseRadioGroup as TypedComponent<BaseRadioGroupProps>;
export const BaseSelect = _BaseSelect as TypedComponent<BaseSelectProps>;
export const BaseSearchQL =
  _BaseSearchQL as unknown as TypedComponent<BaseSearchQLProps>;
export const BaseSignature =
  _BaseSignature as TypedComponent<BaseSignatureProps>;
export const BaseStepper = _BaseStepper as TypedComponent<BaseStepperProps>;
export const BaseSwitch = _BaseSwitch as TypedComponent<BaseSwitchProps>;
export const BaseTable = _BaseTable as TypedComponent<BaseTableProps>;
export const BaseTabs = _BaseTabs as TypedComponent<BaseTabsProps>;
export const BaseText = _BaseText as TypedComponent<BaseTextProps>;
export const BaseTextarea = _BaseTextarea as TypedComponent<BaseTextareaProps>;
export const BaseYearInput =
  _BaseYearInput as TypedComponent<BaseYearInputProps>;

export const tooltip: Directive = tooltipDirective;
export const loading: LoadingDirective = loadingDirective;

export type * from "./public-types";
