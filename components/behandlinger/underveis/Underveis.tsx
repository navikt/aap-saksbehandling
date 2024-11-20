'use client';

import { formaterDatoForVisning } from '@navikt/aap-felles-utils-client';
import { Table } from '@navikt/ds-react';
import { UnderveisGrunnlag } from 'lib/types/types';

type Props = {
  grunnlag: UnderveisGrunnlag[];
};

const Perioderad = ({ periode }: { periode: UnderveisGrunnlag }) => (
  <Table.Row>
    <Table.DataCell>{periode.avslagsårsak}</Table.DataCell>
    <Table.DataCell>
      <div>Gradering: {periode.gradering.gradering}</div>
      <div>Andel arbeid: {periode.gradering.andelArbeid}</div>
      <div>Grenseverdi: {periode.gradering.grenseverdi}</div>
      <div>Fastsatt arbeidsevne: {periode.gradering.fastsattArbeidsevne}</div>
    </Table.DataCell>
    <Table.DataCell>
      {formaterDatoForVisning(periode.meldePeriode.fom)} - {formaterDatoForVisning(periode.meldePeriode.tom)}
    </Table.DataCell>
    <Table.DataCell>
      {formaterDatoForVisning(periode.periode.fom)} - {formaterDatoForVisning(periode.periode.tom)}
    </Table.DataCell>
    <Table.DataCell>{periode.trekk.antall}</Table.DataCell>
    <Table.DataCell>{periode.utfall}</Table.DataCell>
  </Table.Row>
);

export const Underveis = ({ grunnlag }: Props) => {
  return (
    <Table>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Avslagsårsak</Table.HeaderCell>
          <Table.HeaderCell>Gradering</Table.HeaderCell>
          <Table.HeaderCell>Meldeperiode</Table.HeaderCell>
          <Table.HeaderCell>Periode</Table.HeaderCell>
          <Table.HeaderCell>Trekk</Table.HeaderCell>
          <Table.HeaderCell>Utfall</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {grunnlag.map((periode, index) => (
          <Perioderad key={index} periode={periode} />
        ))}
      </Table.Body>
    </Table>
  );
};
