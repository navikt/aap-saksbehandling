'use client';

import { BodyShort, Table, VStack } from '@navikt/ds-react';
import { formaterDatoForVisning } from '@navikt/aap-felles-utils-client';
import { Periode } from 'lib/types/types';
import { ValuePair } from '@navikt/aap-felles-react';

interface Props {
  tidligereVurdering: TidligereVurdering;
}
export interface TidligereVurdering {
  periode: Periode;
  vurdertAvIdent: string;
  vurdertDato: string;
  felter: ValuePair[];
  erGjeldende: boolean;
}
export const TidligereVurderingV2 = ({ tidligereVurdering }: Props) => {
  return (
    <Table.ExpandableRow
      content={
        <VStack gap={'3'}>
          {tidligereVurdering.felter.map((vurdering, index) => (
            <BodyShort size={'small'} key={index}>
              {vurdering.label} {'  '} {vurdering.value}
            </BodyShort>
          ))}
        </VStack>
      }
      togglePlacement="right"
      expandOnRowClick
    >
      <Table.DataCell style={{ display: 'flex', flexDirection: 'row', gap: '1rem' }}>
        <span
          style={{ marginLeft: '0.25rem', textDecoration: tidligereVurdering.erGjeldende ? 'none' : 'line-through' }}
        >
          {tidligereVurdering.periode.fom} {' - '} {tidligereVurdering.periode.tom}
        </span>
      </Table.DataCell>
      <Table.DataCell align="right">
        ({tidligereVurdering.vurdertAvIdent}) {formaterDatoForVisning(tidligereVurdering.vurdertDato)}
      </Table.DataCell>
    </Table.ExpandableRow>
  );
};
