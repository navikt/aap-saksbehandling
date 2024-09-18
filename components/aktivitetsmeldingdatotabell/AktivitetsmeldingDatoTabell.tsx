import { Button, Table } from '@navikt/ds-react';

import { FieldArrayWithId, UseFieldArrayRemove, UseFormReturn } from 'react-hook-form';
import { TrashIcon } from '@navikt/aksel-icons';
import { TextFieldWrapper } from '@navikt/aap-felles-react';
import { AktivitetspliktFormFields } from 'components/aktivitetsplikt/Aktivitetsplikt';
import { parseDatoFraDatePicker } from 'lib/utils/date';

interface Props {
  form: UseFormReturn<AktivitetspliktFormFields>;
  fields: FieldArrayWithId<AktivitetspliktFormFields, 'perioder'>[];
  remove: UseFieldArrayRemove;
}

export const AktivitetsmeldingDatoTabell = ({ form, fields, remove }: Props) => {
  return (
    <>
      <Table size={'small'}>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell textSize={'small'} scope={'col'}>
              Dato
            </Table.HeaderCell>
            <Table.HeaderCell textSize={'small'} scope={'col'}>
              Til og med dato
            </Table.HeaderCell>
            <Table.HeaderCell textSize={'small'} scope={'col'}>
              Type
            </Table.HeaderCell>
            <Table.HeaderCell textSize={'small'} scope={'col'}>
              Handling
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {fields.map((field, index) => (
            <Table.Row key={field.id}>
              <Table.DataCell className={'navds-table__data-cell--align-top'}>
                <TextFieldWrapper
                  label={field.type === 'enkeltdag' ? 'dato' : 'fra og med dato'}
                  control={form.control}
                  type={'text'}
                  name={field.type === 'enkeltdag' ? `perioder.${index}.dato` : `perioder.${index}.fom`}
                  rules={{
                    validate: (value) => validerDato(value as string),
                  }}
                />
              </Table.DataCell>
              {field.type === 'periode' ? (
                <Table.DataCell>
                  <TextFieldWrapper
                    label={'til og med dato'}
                    control={form.control}
                    type={'text'}
                    name={`perioder.${index}.tom`}
                    rules={{ validate: (value) => validerDato(value as string) }}
                  />
                </Table.DataCell>
              ) : (
                <Table.DataCell />
              )}
              <Table.DataCell>{field.type === 'periode' ? 'Periode' : 'Enkeltdato'}</Table.DataCell>
              <Table.DataCell>
                <Button
                  type={'button'}
                  size={'small'}
                  variant={'tertiary'}
                  icon={<TrashIcon />}
                  onClick={() => remove(index)}
                >
                  Slett
                </Button>
              </Table.DataCell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </>
  );
};

function validerDato(value?: string) {
  if (!value) {
    return 'Du må sette en dato';
  }
  const inputDato = parseDatoFraDatePicker(value);
  if (!inputDato) {
    return 'Dato format er ikke gyldig';
  }
}
