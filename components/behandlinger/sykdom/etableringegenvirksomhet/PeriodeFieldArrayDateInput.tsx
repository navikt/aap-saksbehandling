'use client';

import { BodyShort, Button, HStack, Table, VStack } from '@navikt/ds-react';
import { DateInputWrapper } from 'components/form/dateinputwrapper/DateInputWrapper';
import { PlusCircleIcon, TrashIcon } from '@navikt/aksel-icons';
import React from 'react';
import { UseFieldArrayReturn, UseFormReturn } from 'react-hook-form';
import { EtableringAvEgenVirksomhetForm } from 'components/behandlinger/sykdom/etableringegenvirksomhet/EtableringAvEgenVirksomhet';
interface Props {
  form: UseFormReturn<EtableringAvEgenVirksomhetForm>;
  vurderingIndex: number;
  fieldArray: UseFieldArrayReturn<
    EtableringAvEgenVirksomhetForm,
    `vurderinger.${number}.utviklingsperioder` | `vurderinger.${number}.oppstartsperioder`,
    'id'
  >;
}
export const PeriodeFieldArrayDateInput = ({ form, fieldArray, vurderingIndex }: Props) => {
  return (
    <VStack gap={'4'}>
      <Table size="small">
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell scope="col" textSize={'small'}>
              <BodyShort textColor={'subtle'} size={'small'}>
                Periode
              </BodyShort>
            </Table.HeaderCell>
            <Table.HeaderCell />
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {fieldArray.fields.map(({ id }, i) => {
            return (
              <Table.Row key={id}>
                <Table.DataCell>
                  <HStack gap={'2'} align={'center'}>
                    <DateInputWrapper
                      name={`vurderinger.${vurderingIndex}.utviklingsperioder.${i}.fom`}
                      control={form.control}
                    />
                    {'-'}
                    <DateInputWrapper
                      name={`vurderinger.${vurderingIndex}.utviklingsperioder.${i}.tom`}
                      control={form.control}
                    />
                  </HStack>
                </Table.DataCell>
                <Table.DataCell>
                  <Button
                    size={'small'}
                    variant={'secondary'}
                    type={'button'}
                    icon={<TrashIcon />}
                    onClick={() => fieldArray.remove(i)}
                  />
                </Table.DataCell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>
      <HStack>
        <Button
          size={'small'}
          variant={'secondary'}
          type={'button'}
          icon={<PlusCircleIcon />}
          onClick={() => fieldArray.append({ fom: '', tom: '' })}
        >
          Legg til ny periode
        </Button>
      </HStack>
    </VStack>
  );
};
