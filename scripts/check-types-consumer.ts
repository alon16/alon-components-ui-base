import {
  BaseButton,
  BaseBreadcrumb,
  BaseRadio,
  BaseSearchQL,
  BaseSelect,
  BaseStepper,
  BaseTabs,
  loading,
} from "@alon16/components-ui-base";
import type {
  BaseButtonProps,
  BaseBreadcrumbItem,
  BaseBreadcrumbProps,
  BaseRadioProps,
  BaseSearchQLChange,
  BaseSearchQLProps,
  BaseSelectProps,
  BaseStepperProps,
  BaseStepperStep,
  BaseTabsProps,
  LoadingDirective,
} from "@alon16/components-ui-base";

const buttonProps: BaseButtonProps = {
  variant: "secondary",
  size: "md",
  type: "submit",
};
void buttonProps;

const breadcrumbItems: BaseBreadcrumbItem[] = [
  { name: "Inicio", to: { name: "home" } },
  {
    name: "Pedido",
    to: { name: "order-detail", params: { id: "NP-1042" } },
  },
  { name: "Editar pedido" },
];
const breadcrumbProps: BaseBreadcrumbProps = {
  value: breadcrumbItems,
  divider: ">",
  ariaLabel: "Migas de pan",
};
void breadcrumbProps;

const radioProps: BaseRadioProps = {
  id: "choice-a",
  name: "choice",
  value: "a",
  label: "A",
};
void radioProps;

const selectProps: BaseSelectProps = {
  options: [{ label: "A", value: "a" }],
};
void selectProps;

const searchQLProps: BaseSearchQLProps = {
  modelValue: [
    { name: "customer.name", value: ".*Ada.*" },
    { name: "status", value: "delivered" },
  ],
  filters: [{ name: "customer.name", label: "Cliente", regex: true }],
  defaultFilters: [
    {
      name: "status",
      label: "Estado",
      multiple: true,
      options: [{ value: "delivered", label: "Entregado" }],
    },
  ],
};
const searchQLChange: BaseSearchQLChange[] = [
  { name: "customer.name", value: ".*Ada.*" },
  { name: "status", value: "delivered" },
];
void searchQLProps;
void searchQLChange;

const tabsProps: BaseTabsProps = {
  tabs: [{ label: "General", value: "general" }],
  modelValue: "general",
};
void tabsProps;

const stepperSteps: BaseStepperStep[] = [
  { value: "order", label: "Pedido", description: "Identifica tu pedido." },
  { value: "shipping", label: "Envío", disabled: true },
];
const stepperProps: BaseStepperProps = {
  modelValue: "order",
  steps: stepperSteps,
  variant: "vertical",
  navigable: true,
};
void stepperProps;

// @ts-expect-error Component variants are intentionally restricted.
const invalidButton: BaseButtonProps = { variant: "unknown" };
void invalidButton;

// @ts-expect-error BaseRadio requires id, name, value and label.
const invalidRadio: BaseRadioProps = { id: "missing" };
void invalidRadio;

const invalidStepper: BaseStepperProps = {
  modelValue: "order",
  steps: stepperSteps,
  // @ts-expect-error Stepper variants are intentionally restricted.
  variant: "unknown",
};
void invalidStepper;

void BaseButton;
void BaseBreadcrumb;
void BaseRadio;
void BaseSearchQL;
void BaseSelect;
void BaseStepper;
void BaseTabs;

const loadingDirective: LoadingDirective = loading;
void loadingDirective;
