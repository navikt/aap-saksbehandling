'use client';

import { BodyShort, Label, Table, VStack } from '@navikt/ds-react';
import { formaterDatoForVisning } from '@navikt/aap-felles-utils-client';
import { ÅpenPeriode } from 'lib/types/types';
import { ValuePair } from '@navikt/aap-felles-react';

interface Props {
  tidligereVurdering: TidligereVurdering;
}
export interface TidligereVurdering {
  periode: ÅpenPeriode;
  vurdertAvIdent: string;
  vurdertDato: string;
  felter: ValuePair[];
  erGjeldendeVurdering: boolean;
}
export const TidligereVurderingV2 = ({ tidligereVurdering }: Props) => {
  return (
    <Table.ExpandableRow
      content={
        <VStack gap={'3'}>
          {tidligereVurdering.felter.map((vurdering, index) => (
            <VStack gap={'1'} key={index}>
              <Label size={'small'}>{vurdering.label}</Label>
              <BodyShort size={'small'}>{vurdering.value}</BodyShort>
            </VStack>
          ))}
        </VStack>
      }
      togglePlacement="right"
      expandOnRowClick
    >
      <Table.DataCell style={{ display: 'flex', flexDirection: 'row', gap: '1rem' }}>
        <span
          style={{
            marginLeft: '0.25rem',
            textDecoration: tidligereVurdering.erGjeldendeVurdering ? 'none' : 'line-through',
          }}
        >
          {formaterDatoForVisning(tidligereVurdering.periode.fom)}
          {' - '}
          {tidligereVurdering.periode.tom && formaterDatoForVisning(tidligereVurdering.periode.tom)}
        </span>
      </Table.DataCell>
      <Table.DataCell align="right">
        ({tidligereVurdering.vurdertAvIdent}) {formaterDatoForVisning(tidligereVurdering.vurdertDato)}
      </Table.DataCell>
    </Table.ExpandableRow>
  );
};
