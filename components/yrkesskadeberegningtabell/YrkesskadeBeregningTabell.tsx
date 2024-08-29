import { Label, ReadMore, Table } from '@navikt/ds-react';
import { formaterTilG, formaterTilNok, formaterTilProsent } from 'lib/utils/string';
import React from 'react';
import { YrkesskadeGrunnlag } from 'lib/types/types';

interface Props {
  grunnlag: YrkesskadeGrunnlag;
}

export const YrkesskadeBeregningTabell = ({ grunnlag }: Props) => {
  return (
    <div className={'flex-column'}>
      <Label size={'medium'}>Beregning av grunnlag som følge av yrkesskade</Label>
      <ReadMore header={'Se detaljer om beregningen for innbygger med yrkesskade'}>
        Der yrkesskade er medvirkende årsak til redusert arbeidsevne skal det beregnes et grunnlag basert på anslått
        inntekt for det året yrkesskaden inntraff. Innbygger skal få det gunstigste grunnlaget av: 1) standard
        grunnlagsberegning, og 2) beregning av den antatte inntekten ved yrkesskadetidspunkt. Anslått inntekt ved
        yrkesskadetidspunk benyttes kun for den andelen av redusert arbeidsevne som skyldes yrkesskaden. Resterende
        andel regnes ut etter standard beregning. Hvis yrkesskaden er mer enn 70% årsak til redusert arbeidsevne skal
        hele beregningen gjøres etter gunstigste inntektsgrunnlag. Maks grunnlag er 6 G.{' '}
      </ReadMore>
      <Table size={'medium'}>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Beskrivelse</Table.HeaderCell>
            <Table.HeaderCell align={'right'}>Inntekt i G</Table.HeaderCell>
            <Table.HeaderCell align={'right'}>Andel av grunnlag</Table.HeaderCell>
            <Table.HeaderCell align={'right'}>Inntekt i kr</Table.HeaderCell>
            <Table.HeaderCell align={'right'}>Justert til maks 6G</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.DataCell>Anslått inntekt yrkesskade ({grunnlag.inntektSisteÅr.år})</Table.DataCell>
            <Table.DataCell align={'right'}>
              {formaterTilG(grunnlag.yrkesskadeinntekt.antattÅrligInntektIGYrkesskadeTidspunktet)}
            </Table.DataCell>
            <Table.DataCell align={'right'}>
              {formaterTilProsent(grunnlag.yrkesskadeinntekt.prosentVekting)}
            </Table.DataCell>
            <Table.DataCell align={'right'}>
              {formaterTilNok(grunnlag.yrkesskadeinntekt.antattÅrligInntektIKronerYrkesskadeTidspunktet)}
            </Table.DataCell>
            <Table.DataCell align={'right'}>{formaterTilG(grunnlag.yrkesskadeinntekt.justertTilMaks6G)}</Table.DataCell>
          </Table.Row>
          <Table.Row>
            <Table.DataCell>Grunnlag standard beregnet</Table.DataCell>
            <Table.DataCell align={'right'}>{formaterTilG(grunnlag.standardBeregning.inntektIG)}</Table.DataCell>
            <Table.DataCell align={'right'}>
              {formaterTilProsent(grunnlag.yrkesskadeinntekt.prosentVekting)}
            </Table.DataCell>
            <Table.DataCell align={'center'}>-</Table.DataCell>
            <Table.DataCell align={'right'}>{formaterTilG(grunnlag.standardBeregning.justertTilMaks6G)}</Table.DataCell>
          </Table.Row>
          <Table.Row>
            <Table.HeaderCell scope={'row'}>Yrkesskade grunnlag</Table.HeaderCell>
            <Table.DataCell align={'right'} colSpan={4}>
              <b>{formaterTilG(grunnlag.yrkesskadeGrunnlag)}</b>
            </Table.DataCell>
          </Table.Row>
        </Table.Body>
      </Table>
    </div>
  );
};
