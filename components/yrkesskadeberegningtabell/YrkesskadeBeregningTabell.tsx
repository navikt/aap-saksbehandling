import { Label, Table } from '@navikt/ds-react';
import { formaterTilG, formaterTilNok, formaterTilProsent } from 'lib/utils/string';
import React from 'react';
import { YrkesskadeGrunnlag } from 'lib/types/types';

interface Props {
  grunnlag: YrkesskadeGrunnlag;
}

export const YrkesskadeBeregningTabell = ({ grunnlag }: Props) => {
  return (
    <div className={'flex-column'}>
      <Label size={'medium'}>Yrkesskade grunnlagsberegning § 11-22</Label>
      <Table size={'medium'}>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Beskrivelse</Table.HeaderCell>
            <Table.HeaderCell align={'right'}>Andel vekting</Table.HeaderCell>
            <Table.HeaderCell align={'right'}>Inntekt i kr</Table.HeaderCell>
            <Table.HeaderCell align={'right'}>Inntekt i G</Table.HeaderCell>
            <Table.HeaderCell align={'right'}>Justert til maks 6G</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.DataCell>Anslått inntekt yrkesskade</Table.DataCell>
            <Table.DataCell align={'right'}>
              {formaterTilProsent(grunnlag.yrkesskadeinntekt.prosentVekting)}
            </Table.DataCell>
            <Table.DataCell align={'right'}>
              {formaterTilNok(grunnlag.yrkesskadeinntekt.antattÅrligInntektIKronerYrkesskadeTidspunktet)}
            </Table.DataCell>
            <Table.DataCell align={'right'}>
              {formaterTilG(grunnlag.yrkesskadeinntekt.antattÅrligInntektIGYrkesskadeTidspunktet)}
            </Table.DataCell>
            <Table.DataCell align={'right'}>{formaterTilG(grunnlag.yrkesskadeinntekt.justertTilMaks6G)}</Table.DataCell>
          </Table.Row>
          <Table.Row>
            <Table.DataCell>Høyeste grunnlag standard beregning</Table.DataCell>
            <Table.DataCell align={'right'}>
              {formaterTilProsent(grunnlag.yrkesskadeinntekt.prosentVekting)}
            </Table.DataCell>
            <Table.DataCell align={'center'}>-</Table.DataCell>
            <Table.DataCell align={'right'}>{formaterTilG(grunnlag.standardBeregning.inntektIG)}</Table.DataCell>
            <Table.DataCell align={'right'}>{formaterTilG(grunnlag.standardBeregning.justertTilMaks6G)}</Table.DataCell>
          </Table.Row>
          <Table.Row>
            <Table.DataCell>
              <b>Yrkesskade grunnlag</b>
            </Table.DataCell>
            <Table.DataCell></Table.DataCell>
            <Table.DataCell></Table.DataCell>
            <Table.DataCell></Table.DataCell>
            <Table.DataCell align={'right'}>
              <b>{formaterTilG(grunnlag.yrkesskadeGrunnlag)}</b>
            </Table.DataCell>
          </Table.Row>
        </Table.Body>
      </Table>
    </div>
  );
};
