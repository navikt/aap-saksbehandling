import React, { HTMLInputAutoCompleteAttribute, ReactNode } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FieldValues } from 'react-hook-form/dist/types';

import { FormFieldType } from './FormHook';
import { TextFieldWrapper } from './textfieldwrapper/TextFieldWrapper';
import { TextAreaWrapper } from './textareawrapper/TextAreaWrapper';
import { DateWrapper } from './datewrapper/DateWrapper';
import { SelectWrapper } from './selectwrapper/SelectWrapper';
import { CheckboxWrapper } from './checkboxwrapper/CheckboxWrapper';
import { Checkbox, Radio } from '@navikt/ds-react';
import { RadioGroupWrapper } from './radiogroupwrapper/RadioGroupWrapper';
import { ComboboxWrapper } from './comboboxwrapper/ComboboxWrapper';
import { MultipleComboboxWrapper } from './multiplecomboboxwrapper/MultipleComboboxWrapper';
import { DateInputWrapper } from './dateinputwrapper/DateInputWrapper';

export interface ValuePair<Enum = string> {
  value: Enum;
  label: string;
}

interface Props<FormFieldIds extends FieldValues> {
  form: UseFormReturn<FormFieldIds>;
  formField: FormFieldType<FormFieldIds>;
  children?: ReactNode;
  horizontalRadio?: boolean;
  size?: 'small' | 'medium';
  className?: string;
  autocomplete?: HTMLInputAutoCompleteAttribute;
}

export const FormField = <FormFieldIds extends FieldValues>(props: Props<FormFieldIds>) => {
  const { formField, form, children, className, horizontalRadio, size, autocomplete = 'off' } = props;

  return (
    <>
      {(formField.type === 'text' || formField.type === 'number') && (
        <TextFieldWrapper
          name={formField.name}
          label={formField.label}
          type={formField.type}
          control={form.control}
          rules={formField.rules}
          size={size}
          hideLabel={formField.hideLabel}
          description={formField.description}
          readOnly={formField.readOnly}
          className={className}
          autocomplete={autocomplete}
        />
      )}
      {formField.type === 'textarea' && (
        <TextAreaWrapper
          name={formField.name}
          label={formField.label}
          control={form.control}
          rules={formField.rules}
          size={size}
          hideLabel={formField.hideLabel}
          description={formField.description}
          readOnly={formField.readOnly}
          className={className}
          autocomplete={autocomplete}
        />
      )}
      {formField.type === 'radio' && (
        <RadioGroupWrapper
          name={formField.name}
          control={form.control}
          label={formField.label}
          hideLabel={formField.hideLabel}
          description={formField.description}
          className={className}
          rules={formField.rules}
          size={size}
          horisontal={horizontalRadio}
          readOnly={formField.readOnly}
        >
          {formField.options.map((option) => (
            <Radio key={option.value} value={option.value} description={option.description}>
              {option.label}
            </Radio>
          ))}
        </RadioGroupWrapper>
      )}
      {formField.type === 'date' && (
        <DateWrapper
          name={formField.name}
          label={formField.label}
          control={form.control}
          rules={formField.rules}
          size={size}
          hideLabel={formField.hideLabel}
          description={formField.description}
          fromDate={formField.fromDate}
          toDate={formField.toDate}
          disableWeekend={formField.disableWeekends}
          selected={form.getValues(formField.name)}
          readOnly={formField.readOnly}
          strategy={formField.strategy}
        />
      )}
      {formField.type === 'date_input' && (
        <DateInputWrapper
          name={formField.name}
          label={formField.label}
          control={form.control}
          rules={formField.rules}
          size={size}
          hideLabel={formField.hideLabel}
          description={formField.description}
          readOnly={formField.readOnly}
          className={className}
          autocomplete={autocomplete}
        />
      )}
      {formField.type === 'checkbox' && (
        <CheckboxWrapper
          name={formField.name}
          label={formField.label}
          hideLabel={formField.hideLabel}
          control={form.control}
          rules={formField.rules}
          size={size}
          description={formField.description}
          readOnly={formField.readOnly}
          className={className}
        >
          {formField.options.map(mapToValuePair).map((option) => (
            <Checkbox value={option.value} key={option.value}>
              {option.label}
            </Checkbox>
          ))}
        </CheckboxWrapper>
      )}
      {formField.type === 'select' && (
        <SelectWrapper
          name={formField.name}
          label={formField.label}
          description={formField.description}
          hideLabel={formField.hideLabel}
          control={form.control}
          rules={formField.rules}
          size={size}
          readOnly={formField.readOnly}
          className={className}
          autocomplete={autocomplete}
        >
          {formField.options.map(mapToValuePair).map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </SelectWrapper>
      )}
      {formField.type === 'checkbox_nested' && (
        <CheckboxWrapper
          name={formField.name}
          label={formField.label}
          hideLabel={formField.hideLabel}
          description={formField.description}
          control={form.control}
          rules={formField.rules}
          size={size}
          readOnly={formField.readOnly}
          className={className}
        >
          {children}
        </CheckboxWrapper>
      )}

      {formField.type === 'radio_nested' && (
        <RadioGroupWrapper
          name={formField.name}
          label={formField.label}
          description={formField.description}
          control={form.control}
          rules={formField.rules}
          size={size}
          hideLabel={formField.hideLabel}
          readOnly={formField.readOnly}
          className={className}
        >
          {children}
        </RadioGroupWrapper>
      )}

      {formField.type === 'combobox' && (
        <ComboboxWrapper
          name={formField.name}
          label={formField.label}
          control={form.control}
          hideLabel={formField.hideLabel}
          rules={formField.rules}
          size={size}
          description={formField.description}
          readOnly={formField.readOnly}
          options={formField.options.map((option) => mapToValuePair(option))}
        />
      )}

      {formField.type === 'combobox_multiple' && (
        <MultipleComboboxWrapper
          name={formField.name}
          label={formField.label}
          control={form.control}
          hideLabel={formField.hideLabel}
          rules={formField.rules}
          size={size}
          description={formField.description}
          readOnly={formField.readOnly}
          options={formField.options.map((option) => mapToValuePair(option))}
        />
      )}
    </>
  );
};

export function mapToValuePair(option: string | ValuePair) {
  return typeof option == 'string' ? { label: option, value: option } : option;
}
