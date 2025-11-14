import { HStack } from '@navikt/ds-react';
import { TextFieldWrapper } from 'components/form/textfieldwrapper/TextFieldWrapper';
import React from 'react';
import { Control, FieldValues } from 'react-hook-form';
interface VurderingIdProps<FormFieldValues extends FieldValues> {
  index: number;
  fieldArrayName?: string;
  fieldName?: string;
  control: Control<FormFieldValues>;
}
export const VurderingId = <FormFieldValues extends FieldValues>({
  index,
  fieldArrayName = 'vurderinger',
  fieldName = 'vurderingId',
  control,
}: VurderingIdProps<FormFieldValues>) => {
  return (
    <HStack style={{ display: 'none' }}>
      {
        // @ts-ignore
        <TextFieldWrapper hidden name={`${fieldArrayName}.${index}.${fieldName}`} control={control} type={'text'} />
      }
    </HStack>
  );
};
