'use client';

import { Heading, Table, VStack } from '@navikt/ds-react';
import { StønadsperiodeGrunnlag } from 'lib/types/types';
import { VilkårsKort } from 'components/vilkårskort/Vilkårskort';
import { TableStyled } from 'components/tablestyled/TableStyled';
import { formaterDatoForFrontend } from 'lib/utils/date';

interface Props {
  behandlingVersjon: number;
  grunnlag: StønadsperiodeGrunnlag;
  readOnly: boolean;
}

export const Stønadsperiode = ({ grunnlag }: Props) => {
  return (
    <VilkårsKort heading={'Forskrift om AAP § 12. Ny stønadsperiode'} steg={'AVKLAR_STØNADSPERIODE'}>
      <VStack gap={'space-16'}>
        <VStack gap={'space-8'}>
          <Heading size={'xsmall'}>Tidligere AAP rettigheter</Heading>
          <TableStyled size={'small'}>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Kilde</Table.HeaderCell>
                <Table.HeaderCell>Status</Table.HeaderCell>
                <Table.HeaderCell>Maksdato / opphørt / stanset dato</Table.HeaderCell>
                <Table.HeaderCell>Maksdato</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {grunnlag.vedtatteVurderinger.map((rad, index) => (
                <Table.Row key={index}>
                  <Table.DataCell>{rad.vurdertAv}</Table.DataCell>
                  <Table.DataCell>{rad.relevantKravType.type}</Table.DataCell>
                  <Table.DataCell>{rad.startDato}</Table.DataCell>
                  <Table.DataCell>{formaterDatoForFrontend(rad.startDato)}</Table.DataCell>
                </Table.Row>
              ))}
            </Table.Body>
          </TableStyled>
        </VStack>

        <VStack gap={'space-8'}>
          <Heading size={'xsmall'}>Brukerens krav om AAP</Heading>
          <TableStyled size={'small'}>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Relevant krav</Table.HeaderCell>
                <Table.HeaderCell>Type</Table.HeaderCell>
                <Table.HeaderCell>Vurderes fra</Table.HeaderCell>
                <Table.HeaderCell>Vurdert av (dato)</Table.HeaderCell>
                <Table.HeaderCell>Valg</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {grunnlag.vedtatteVurderinger.map((rad, index) => (
                <Table.Row key={index}>
                  <Table.DataCell>{rad.referanse}</Table.DataCell>
                  <Table.DataCell>{rad.relevantKravType.type}</Table.DataCell>
                  <Table.DataCell>{rad.startDato}</Table.DataCell>
                  <Table.DataCell>{formaterDatoForFrontend(rad.startDato)}</Table.DataCell>
                </Table.Row>
              ))}
            </Table.Body>
          </TableStyled>
        </VStack>
      </VStack>
    </VilkårsKort>
  );
};
