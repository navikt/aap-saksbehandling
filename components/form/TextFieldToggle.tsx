import { BodyShort, Button, HStack, TextField, VStack } from '@navikt/ds-react';
import React, { useState } from 'react';
import { PencilIcon } from '@navikt/aksel-icons';
import { Controller, RegisterOptions, UseFormReturn } from 'react-hook-form';
import { FieldPath, FieldValues } from 'react-hook-form/dist/types';

interface Props<FormFieldIds extends FieldValues> {
  form: UseFormReturn<FormFieldIds, any, any>;
  name: FieldPath<FormFieldIds>;
  label?: string;
  buttonLabel?: string;
  rules?: RegisterOptions<FormFieldIds> | undefined;
  readOnly?: boolean;
}

export const TextFieldToggle = <FormFieldIds extends FieldValues>({
  form,
  name,
  label,
  buttonLabel,
  rules,
  readOnly,
}: Props<FormFieldIds>) => {
  const [editing, setEditing] = useState(false);

  if (readOnly) {
    return <BodyShort size="small">{form.watch(name)}</BodyShort>;
  }

  return (
    <VStack gap="2">
      <Controller
        name={name}
        control={form.control}
        rules={rules}
        render={({ field: { name, value, onChange }, fieldState: { error } }) => (
          <TextField
            id={name}
            name={name}
            label={label}
            size="small"
            error={error?.message}
            value={value || ''}
            onChange={onChange}
            hidden={!editing}
            readOnly={readOnly}
          />
        )}
      />

      {editing ? (
        <HStack gap="2">
          <Button
            type="button"
            variant="secondary"
            size="small"
            onClick={async () => {
              const valid = await form.trigger(name);

              if (valid) setEditing(false);
            }}
          >
            Lagre
          </Button>

          <Button
            type="button"
            variant="tertiary"
            size="small"
            onClick={() => {
              setEditing(false);
              form.resetField(name);
            }}
          >
            Avbryt
          </Button>
        </HStack>
      ) : (
        <>
          <BodyShort size="small">{form.watch(name)}</BodyShort>

          <div>
            <Button
              type="button"
              variant="tertiary"
              icon={<PencilIcon />}
              size="small"
              onClick={() => setEditing(true)}
            >
              {buttonLabel || 'Endre'}
            </Button>
          </div>
        </>
      )}
    </VStack>
  );
};
