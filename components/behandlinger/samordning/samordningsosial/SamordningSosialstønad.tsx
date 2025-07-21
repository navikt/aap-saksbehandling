'use client';

import { BodyShort, HStack, Table } from '@navikt/ds-react';
import { VilkårsKort } from 'components/vilkårskort/VilkårsKort';
import { RefusjonskravGrunnlag } from 'lib/types/types';
import { formaterDatoForFrontend } from 'lib/utils/date';
import { TableStyled } from 'components/tablestyled/TableStyled';

interface Props {
  grunnlag: RefusjonskravGrunnlag;
}

export const SamordningSosialstønad = ({ grunnlag }: Props) => {
  if (!grunnlag.gjeldendeVurdering?.harKrav) return null;
  const vurderinger = grunnlag.gjeldendeVurderinger;
  return (
    vurderinger && (
      <VilkårsKort heading="§11-29 Refusjonskrav sosialstønad" steg="REFUSJON_KRAV" defaultOpen={true}>
        <BodyShort spacing>
          Vi har funnet perioder med sosialstønad eller tjenestepensjonsordning. Disse kan føre til refusjonskrav på
          etterbetaling.
        </BodyShort>
        <TableStyled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Periode</Table.HeaderCell>
              <Table.HeaderCell>Nav-kontor</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {!vurderinger.length && (
              <Table.Row>
                <Table.DataCell colSpan={4}>Ingen refusjon fra Nav-kontor funnet</Table.DataCell>
              </Table.Row>
            )}
            {vurderinger.map((vurdering, index) => {
              return (
                <Table.Row key={vurdering.navKontor ?? index}>
                  <Table.DataCell textSize="small">
                    <HStack gap={'2'} marginInline={'2'}>
                      {formaterDatoForFrontend(vurdering.fom!!)} - {formaterDatoForFrontend(vurdering.tom!!)}
                    </HStack>
                  </Table.DataCell>
                  <Table.DataCell textSize="small">{vurdering.navKontor}</Table.DataCell>
                </Table.Row>
              );
            })}
          </Table.Body>
        </TableStyled>
      </VilkårsKort>
    )
  );
};
