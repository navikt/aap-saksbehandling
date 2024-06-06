import { Checkbox, Radio } from '@navikt/ds-react';
import React, { ReactNode } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FieldValues } from 'react-hook-form/dist/types';

import { FormFieldType } from 'hooks/FormHook';
import { CheckboxWrapper } from 'components/input/checkboxwrapper/CheckboxWrapper';
import { DateWrapper } from 'components/input/datewrapper/DateWrapper';
import { RadioGroupWrapper } from 'components/input/radiogroupwrapper/RadioGroupWrapper';
import { SelectWrapper } from 'components/input/selectwrapper/SelectWrapper';
import { TextAreaWrapper } from 'components/input/textareawrapper/TextAreaWrapper';
import { TextFieldWrapper } from 'components/input/textfieldwrapper/TextFieldWrapper';

export interface ValuePair<Enum = string> {
  value: Enum;
  label: string;
}

interface Props<FormFieldIds extends FieldValues> {
  form: UseFormReturn<FormFieldIds>;
  formField: FormFieldType<FormFieldIds>;
  children?: ReactNode;
  horizontalRadio?: boolean;
}

export const FormField = <FormFieldIds extends FieldValues>(props: Props<FormFieldIds>) => {
  const { formField, form, children, horizontalRadio } = props;

  return (
    <>
      {(formField.type === 'text' || formField.type === 'number') && (
        <TextFieldWrapper
          name={formField.name}
          label={formField.label}
          type={formField.type}
          control={form.control}
          rules={formField.rules}
          description={formField.description}
          readOnly={formField.readOnly}
        />
      )}
      {formField.type === 'textarea' && (
        <TextAreaWrapper
          name={formField.name}
          label={formField.label}
          control={form.control}
          rules={formField.rules}
          description={formField.description}
          readOnly={formField.readOnly}
        />
      )}
      {formField.type === 'date' && (
        <DateWrapper
          name={formField.name}
          label={formField.label}
          control={form.control}
          rules={formField.rules}
          description={formField.description}
          fromDate={formField.fromDate}
          toDate={formField.toDate}
          disableWeekend={formField.disableWeekends}
          selected={form.getValues(formField.name)}
          readOnly={formField.readOnly}
        />
      )}
      {formField.type === 'radio' && (
        <RadioGroupWrapper
          name={formField.name}
          control={form.control}
          label={formField.label}
          description={formField.description}
          rules={formField.rules}
          horisontal={horizontalRadio}
          readOnly={formField.readOnly}
        >
          {formField.options.map(mapToValuePair).map((option) => (
            <Radio key={option.value} value={option.value}>
              {option.label}
            </Radio>
          ))}
        </RadioGroupWrapper>
      )}
      {formField.type === 'checkbox' && (
        <CheckboxWrapper
          name={formField.name}
          label={formField.label}
          control={form.control}
          rules={formField.rules}
          description={formField.description}
          readOnly={formField.readOnly}
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
          control={form.control}
          rules={formField.rules}
          readOnly={formField.readOnly}
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
          description={formField.description}
          control={form.control}
          rules={formField.rules}
          readOnly={formField.readOnly}
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
          readOnly={formField.readOnly}
        >
          {children}
        </RadioGroupWrapper>
      )}
    </>
  );
};

export function mapToValuePair(option: string | ValuePair) {
  return typeof option == 'string' ? { label: option, value: option } : option;
}
