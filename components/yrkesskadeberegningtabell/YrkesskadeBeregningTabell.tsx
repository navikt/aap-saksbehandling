import { Detail, Label, ReadMore, Table } from '@navikt/ds-react';
import { formaterTilG, formaterTilNok, formaterTilProsent } from 'lib/utils/string';
import React from 'react';
import { YrkesskadeGrunnlag } from 'lib/types/types';

interface Props {
  grunnlag: YrkesskadeGrunnlag;
  visning: 'YRKESSKADE' | 'YRKESSKADE_UFØR';
}

export const YrkesskadeBeregningTabell = ({ grunnlag, visning }: Props) => {
  return (
    <div className={'flex-column'}>
      <Label size={'medium'}>Grunnlagsberegning § 11-19, jf. grunnlag ved yrkesskadefordel etter § 11-22</Label>
      <Detail>
        {`Anslått inntekt ved yrkesskadetidspunktet (${grunnlag.inntektSisteÅr.år}) er oppgitt til å være ${formaterTilNok(grunnlag.yrkesskadeinntekt.antattÅrligInntektIKronerYrkesskadeTidspunktet)} (${formaterTilG(grunnlag.yrkesskadeinntekt.antattÅrligInntektIGYrkesskadeTidspunktet)}) Yrkesskaden er
        oppgitt å ha ${formaterTilProsent(grunnlag.yrkesskadeinntekt.prosentVekting)} årsakssammenheng med nedsatt arbeidsevne.`}
      </Detail>
      <ReadMore header={'Se detaljer om beregningen for innbygger med yrkesskade'}>
        Der yrkesskade er medvirkende årsak til redusert arbeidsevne skal det beregnes et grunnlag basert på anslått
        inntekt for det året yrkesskaden inntraff. Innbygger skal få det gunstigste grunnlaget av: 1) standard
        grunnlagsberegning, og 2) beregning av den antatte inntekten ved yrkesskadetidspunkt. Anslått inntekt ved
        yrkesskadetidspunk benyttes kun for den andelen av redusert arbeidsevne som skyldes yrkesskaden. Resterende
        andel regnes ut etter standard beregning. Hvis yrkesskaden er mer enn 70% årsak til redusert arbeidsevne skal
        hele beregningen gjøres etter gunstigste inntektsgrunnlag. Maks grunnlag er 6 G.
      </ReadMore>
      <Table size={'medium'}>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Beskrivelse</Table.HeaderCell>
            <Table.HeaderCell align={'right'}>Inntekt</Table.HeaderCell>
            <Table.HeaderCell align={'right'}>Andel av grunnlag</Table.HeaderCell>
            <Table.HeaderCell align={'right'}>Andel*inntekt</Table.HeaderCell>
            <Table.HeaderCell align={'right'}>Inntektsgrunnlag (maks 6 G)</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.DataCell>Anslått inntekt yrkesskade ({grunnlag.inntektSisteÅr.år})</Table.DataCell>
            <Table.DataCell align={'right'}>
              {formaterTilNok(grunnlag.yrkesskadeinntekt.antattÅrligInntektIKronerYrkesskadeTidspunktet)} (
              {formaterTilG(grunnlag.yrkesskadeinntekt.antattÅrligInntektIGYrkesskadeTidspunktet)})
            </Table.DataCell>
            <Table.DataCell align={'right'}>
              {formaterTilProsent(grunnlag.yrkesskadeinntekt.prosentVekting)}
            </Table.DataCell>
            <Table.DataCell align={'right'}>
              {formaterTilG(grunnlag.yrkesskadeinntekt.andelGangerInntektIG)}
            </Table.DataCell>
            <Table.DataCell align={'right'}>{formaterTilG(grunnlag.yrkesskadeinntekt.justertTilMaks6G)}</Table.DataCell>
          </Table.Row>
          <Table.Row>
            <Table.DataCell>
              {visning === 'YRKESSKADE'
                ? 'Høyeste grunnlag beregnet etter § 11-19'
                : 'Høyeste grunnlag beregnet etter §§ 11-19 / 11-28'}
            </Table.DataCell>
            <Table.DataCell align={'right'}>{formaterTilG(grunnlag.standardBeregning.inntektIG)}</Table.DataCell>
            <Table.DataCell align={'right'}>
              {formaterTilProsent(grunnlag.standardBeregning.prosentVekting)}
            </Table.DataCell>
            <Table.DataCell align={'right'}>
              {formaterTilG(grunnlag.standardBeregning.andelGangerInntektIG)}
            </Table.DataCell>
            <Table.DataCell align={'right'}>TODO G</Table.DataCell>
          </Table.Row>
          <Table.Row>
            <Table.DataCell>
              + {visning === 'YRKESSKADE' ? 'Resterende andel § 11-19' : 'Resterende andel §§ 11-19 / 11-28'}
            </Table.DataCell>
            <Table.DataCell align={'right'}>TODO G</Table.DataCell>
            <Table.DataCell align={'right'}>TODO %</Table.DataCell>
            <Table.DataCell align={'right'}>TODO G</Table.DataCell>
            <Table.DataCell align={'right'}>+ TODO G</Table.DataCell>
          </Table.Row>
          <Table.Row>
            <Table.DataCell>= Totalt grunnlag beregnet med yrkesskadefordel</Table.DataCell>
            <Table.DataCell align={'right'} colSpan={4}>
              = {formaterTilG(grunnlag.yrkesskadeGrunnlag)}
            </Table.DataCell>
          </Table.Row>
        </Table.Body>
      </Table>
    </div>
  );
};
