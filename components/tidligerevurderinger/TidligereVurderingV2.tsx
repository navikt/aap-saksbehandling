'use client';

import { BodyShort, Label, Table, VStack } from '@navikt/ds-react';
import { ÅpenPeriode } from 'lib/types/types';
import { ValuePair } from 'components/form/FormField';
import { formaterDatoForFrontend } from 'lib/utils/date';

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
          {formaterDatoForFrontend(tidligereVurdering.periode.fom)}
          {' - '}
          {tidligereVurdering.periode.tom && formaterDatoForFrontend(tidligereVurdering.periode.tom)}
        </span>
      </Table.DataCell>
      <Table.DataCell align="right">
        ({tidligereVurdering.vurdertAvIdent}) {formaterDatoForFrontend(tidligereVurdering.vurdertDato)}
      </Table.DataCell>
    </Table.ExpandableRow>
  );
};
