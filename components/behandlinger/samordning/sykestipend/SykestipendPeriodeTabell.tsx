'use client';

import { useFieldArray, UseFormReturn } from 'react-hook-form';
import { BodyLong, Button, HStack, Label, Table, VStack } from '@navikt/ds-react';
import { TableStyled } from 'components/tablestyled/TableStyled';
import { DateInputWrapper } from 'components/form/dateinputwrapper/DateInputWrapper';
import { validerDato } from 'lib/validation/dateValidation';
import { PlusCircleIcon, TrashIcon } from '@navikt/aksel-icons';
import { SykestipendFormFields } from 'components/behandlinger/samordning/sykestipend/SykestipendVurdering';

interface Props {
  form: UseFormReturn<SykestipendFormFields>;
  readOnly: boolean;
}

export const SykestipendPeriodeTabell = ({ form, readOnly }: Props) => {
  const { fields, append, remove } = useFieldArray({ name: 'perioder', control: form.control });
  function leggTilRad() {
    append({
      fom: '',
      tom: '',
    });
  }
  return (
    <VStack gap={'2'}>
      <Label size={'small'}>Legg periode med sykestipend</Label>

      <VStack gap={'0'}>
        <BodyLong size={'small'}>Legg til perioder der brukeren har rett på sykestipend.</BodyLong>
        <BodyLong size={'small'}>
          Perioder med sykestipend gir ikke rett på AAP etter § 11-14, og vil dermed forskyve virkningsdato.
        </BodyLong>
        <BodyLong size={'small'}>Rettighet etter § 11-14 starter aldri før sykestipendperioden.</BodyLong>
      </VStack>

      <TableStyled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Ytelse</Table.HeaderCell>
            <Table.HeaderCell>Periode</Table.HeaderCell>
            <Table.HeaderCell></Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {fields.map((field, index) => (
            <Table.Row key={`${field.id}-${index}`}>
              <Table.DataCell>Sykestipend</Table.DataCell>
              <Table.DataCell>
                <HStack align={'center'} gap={'1'}>
                  <DateInputWrapper
                    control={form.control}
                    name={`perioder.${index}.fom`}
                    hideLabel={true}
                    rules={{
                      required: 'Du må velge dato for periodestart',
                      validate: (value) => {
                        return validerDato(value as string);
                      },
                    }}
                    readOnly={readOnly}
                  />
                  {'-'}
                  <DateInputWrapper
                    control={form.control}
                    name={`perioder.${index}.tom`}
                    hideLabel={true}
                    rules={{
                      required: 'Du må velge dato for periodeslutt',
                      validate: (value) => {
                        return validerDato(value as string);
                      },
                    }}
                    readOnly={readOnly}
                  />
                </HStack>
              </Table.DataCell>
              <Table.DataCell>
                <Button
                  size={'small'}
                  icon={<TrashIcon title={'Slett'} />}
                  variant={'tertiary'}
                  type={'button'}
                  onClick={() => remove(index)}
                  disabled={readOnly}
                />
              </Table.DataCell>
            </Table.Row>
          ))}
        </Table.Body>
      </TableStyled>
      <HStack>
        <Button
          size={'small'}
          type={'button'}
          variant={'tertiary'}
          icon={<PlusCircleIcon />}
          onClick={leggTilRad}
          disabled={readOnly}
        >
          Legg til
        </Button>
      </HStack>
    </VStack>
  );
};
