'use client';

import { Checkbox, Table } from '@navikt/ds-react';
import { AktivitetDto } from 'lib/types/types';
import { grunnOptions } from 'app/sak/[saksId]/aktivitet/page';

export interface Props {
  aktivitet: AktivitetDto;
}

export const AktivitetsTabellRad = ({ aktivitet }: Props) => {
  return (
    <Table.Row>
      <Table.DataCell textSize={'small'}>{grunnOptions.find((e) => e.value === aktivitet?.type)?.label}</Table.DataCell>
      <Table.DataCell textSize={'small'}>{aktivitet?.dato}</Table.DataCell>
      <Table.DataCell textSize={'small'}>
        <Checkbox size={'small'} hideLabel value={'forhåndsvarsel'}>
          Sendt forhåndsvarsel
        </Checkbox>
      </Table.DataCell>
      <Table.DataCell textSize={'small'}>
        <Checkbox size={'small'} hideLabel value={'vedtak'}>
          Sendt vedtak
        </Checkbox>
      </Table.DataCell>
    </Table.Row>
  );
};
