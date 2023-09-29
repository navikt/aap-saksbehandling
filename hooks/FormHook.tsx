import { DefaultValues, RegisterOptions, useForm, UseFormProps, UseFormReturn } from 'react-hook-form';
import { FieldPath, FieldValues } from 'react-hook-form/dist/types';

import { ValuePair } from '../components/input/formfield/FormField';

export type FormFieldsConfig<FormFieldId extends FieldPath<FormFieldIds>, FormFieldIds extends FieldValues> = Record<
  FormFieldId,
  FormFieldConfig<FormFieldIds>
>;

export type FormFieldConfig<FormFieldIds extends FieldValues> =
  | FormFieldText<FormFieldIds>
  | FormFieldTextArea<FormFieldIds>
  | FormFieldDate<FormFieldIds>
  | FormFieldWithOptions<FormFieldIds>
  | FormFieldWithNestedOptions<FormFieldIds>;

interface BaseFormField<FormFieldIds extends FieldValues> {
  label: string;
  description?: string;
  defaultValue?: string;
  rules?: RegisterOptions<FormFieldIds>;
}

interface FormFieldText<FormFieldIds extends FieldValues> extends BaseFormField<FormFieldIds> {
  type: 'text' | 'number';
}

interface FormFieldTextArea<FormFieldIds extends FieldValues> extends BaseFormField<FormFieldIds> {
  type: 'textarea';
}

interface FormFieldDate<FormFieldIds extends FieldValues> extends BaseFormField<FormFieldIds> {
  type: 'date';
  fromDate?: Date;
  disableWeekends?: boolean;
}

interface FormFieldWithOptions<FormFieldIds extends FieldValues> extends BaseFormField<FormFieldIds> {
  type: 'radio' | 'checkbox' | 'select';
  options: Array<string | ValuePair>;
}

interface FormFieldWithNestedOptions<FormFieldIds extends FieldValues> extends BaseFormField<FormFieldIds> {
  type: 'radio_nested' | 'checkbox_nested';
}

export type FormFields<FormFieldId extends FieldPath<FormFieldIds>, FormFieldIds extends FieldValues> = Record<
  FormFieldId,
  FormFieldType<FormFieldIds>
>;

export type FormFieldType<FormFieldIds extends FieldValues> = FormFieldConfig<FormFieldIds> &
  FormFieldName<FormFieldIds>;

interface FormFieldName<FormFieldIds extends FieldValues> {
  name: FieldPath<FormFieldIds>;
}

export function useConfigForm<FormFieldIds extends FieldValues>(
  config: FormFieldsConfig<FieldPath<FormFieldIds>, FormFieldIds>,
  configForForm?: Omit<UseFormProps<FormFieldIds>, 'defaultValues'>
): {
  formFields: FormFields<FieldPath<FormFieldIds>, FormFieldIds>;
  form: UseFormReturn<FormFieldIds>;
} {
  const defaultValues = {} as DefaultValues<FormFieldIds>[FieldPath<FormFieldIds>];
  const formFields = {} as FormFields<FieldPath<FormFieldIds>, FormFieldIds>;

  const entries = Object.entries(config) as Array<[FieldPath<FormFieldIds>, FormFieldConfig<FormFieldIds>]>;

  entries.forEach(([id, formFieldConfig]) => {
    formFields[id] = { ...formFieldConfig, name: id };

    if (formFieldConfig.defaultValue) {
      defaultValues[id] = formFieldConfig.defaultValue;
    }
  });

  const form = useForm<FormFieldIds>({
    ...configForForm,
    defaultValues,
  });

  return { formFields, form };
}
