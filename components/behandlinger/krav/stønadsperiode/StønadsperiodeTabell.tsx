'use client';

import { BodyShort, Label, Table, Tag, VStack } from '@navikt/ds-react';
import type { AkselColorRole } from '@navikt/ds-tokens/types';
import { StønadsperiodeGrunnlag, StønadsperiodeVurdering } from 'lib/types/types';
import { formaterDatoForFrontend } from 'lib/utils/date';
import { getJaEllerNei } from 'lib/utils/form';

import { TableStyled } from 'components/tablestyled/TableStyled';

type Rad = StønadsperiodeVurdering & { status: string };
export const StønadsperiodeTabell = ({ grunnlag }: { grunnlag: StønadsperiodeGrunnlag }) => {
  const rader = [
    ...grunnlag.vedtatteVurderinger.map((vedtatt) => ({ status: 'Vedtatt', ...vedtatt })),
    ...grunnlag.nyeVurderinger.map((ny) => ({ status: 'Ny', ...ny })),
  ] as Rad[];

  return (
    <>
      <TableStyled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell></Table.HeaderCell>
            <Table.HeaderCell></Table.HeaderCell>
            <Table.HeaderCell>Relevant krav</Table.HeaderCell>
            <Table.HeaderCell>Type</Table.HeaderCell>
            <Table.HeaderCell>Vurdert av</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {rader.map((rad) => (
            <Table.ExpandableRow key={rad.status + rad.referanse} content={innhold(rad)}>
              <Table.DataCell>{rad.status}</Table.DataCell>
              <Table.DataCell>{rad.referanse}</Table.DataCell>
              <Table.DataCell>{tag(rad.relevantKravType)}</Table.DataCell>
              <Table.DataCell>{`${rad.vurdertAv} (${formaterDatoForFrontend(rad.opprettet)})`}</Table.DataCell>
            </Table.ExpandableRow>
          ))}
        </Table.Body>
      </TableStyled>
    </>
  );
};

function innhold(rad: Rad) {
  return (
    <VStack gap={'space-16'}>
      <div>
        <Label>Vilkårsvurdering</Label>
        <BodyShort>{rad.begrunnelse}</BodyShort>
      </div>
      <div>
        <Label>Har gjenværende kvote</Label>
        <BodyShort>{getJaEllerNei(rad.harGjenværendeKvote)}</BodyShort>
      </div>
      <div>
        <Label>Har hatt ordinær siste 52 uker</Label>
        <BodyShort>{getJaEllerNei(rad.harHattOrdinærSiste52Uker)}</BodyShort>
      </div>
    </VStack>
  );
}

function tag(type: StønadsperiodeVurdering['relevantKravType']) {
  const [farge, tekst] = ((): [AkselColorRole, string] => {
    switch (type) {
      case 'AVSLAG':
        return ['danger', 'Avslag § 12'];
      case 'GJENINNTREDEN_ETTER_OPPHØR':
        return ['info', 'Gjeninntreden etter opphør'];
      case 'GJENOPPTAK_ETTER_STANS':
        return ['meta-purple', 'Gjenopptak etter stans'];
      case 'NY_STØNADSPERIODE':
        return ['success', 'Krav om ny stønadsperiode'];
    }
  })();

  return (
    <Tag size="small" data-color={farge}>
      {tekst}
    </Tag>
  );
}
