import { BodyShort, Table, VStack } from '@navikt/ds-react';
import { formaterTilG, formaterTilNok, formaterTilProsent } from 'lib/utils/string';
import React from 'react';
import { YrkesskadeGrunnlag } from 'lib/types/types';
import { Veiledning } from 'components/veiledning/Veiledning';
import { TableStyled } from 'components/tablestyled/TableStyled';

interface Props {
  grunnlag: YrkesskadeGrunnlag;
  visning: 'YRKESSKADE' | 'YRKESSKADE_UFØR';
}

export const YrkesskadeBeregningTabell = ({ grunnlag, visning }: Props) => {
  return (
    <div className={'flex-column'}>
      <VStack gap={'1'}>
        <BodyShort size={'small'} weight={'semibold'}>
          Grunnlagsberegning § 11-19, jf. grunnlag ved yrkesskadefordel etter § 11-22
        </BodyShort>
        <BodyShort
          size={'small'}
          style={{ maxWidth: '90ch' }}
        >{`Anslått inntekt ved yrkesskadetidspunktet (${grunnlag.inntektSisteÅr.år}) er oppgitt til å være ${formaterTilNok(grunnlag.yrkesskadeinntekt.antattÅrligInntektIKronerYrkesskadeTidspunktet)} (${formaterTilG(grunnlag.yrkesskadeinntekt.antattÅrligInntektIGYrkesskadeTidspunktet)}) Yrkesskaden er
        oppgitt å ha ${formaterTilProsent(grunnlag.yrkesskadeinntekt.prosentVekting)} årsakssammenheng med nedsatt arbeidsevne.`}</BodyShort>
        <Veiledning
          header={'Se detaljer om beregningen for bruker med yrkesskade'}
          tekst={
            'Der yrkesskade er medvirkende årsak til redusert arbeidsevne skal det beregnes et grunnlag basert på anslått inntekt for det året yrkesskaden inntraff. Bruker skal få det gunstigste grunnlaget av: 1) standardgrunnlagsberegning, og 2) beregning av den antatte inntekten ved yrkesskadetidspunkt. Anslått inntekt vedyrkesskadetidspunk benyttes kun for den andelen av redusert arbeidsevne som skyldes yrkesskaden. Resterende andel regnes ut etter standard beregning. Hvis yrkesskaden er mer enn 70% årsak til redusert arbeidsevne skal hele beregningen gjøres etter gunstigste inntektsgrunnlag. Maks grunnlag er 6 G.'
          }
        ></Veiledning>
      </VStack>
      <TableStyled size={'medium'}>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell textSize={'small'}>Beskrivelse</Table.HeaderCell>
            <Table.HeaderCell align={'right'} textSize={'small'}>
              Inntekt
            </Table.HeaderCell>
            <Table.HeaderCell align={'right'} textSize={'small'}>
              Andel av grunnlag
            </Table.HeaderCell>
            <Table.HeaderCell align={'right'} textSize={'small'}>
              Andel*inntekt
            </Table.HeaderCell>
            <Table.HeaderCell align={'right'} textSize={'small'}>
              Inntektsgrunnlag (maks 6 G)
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.DataCell textSize={'small'}>
              Anslått inntekt yrkesskade ({grunnlag.inntektSisteÅr.år})
            </Table.DataCell>
            <Table.DataCell align={'right'} textSize={'small'}>
              {formaterTilNok(grunnlag.yrkesskadeinntekt.antattÅrligInntektIKronerYrkesskadeTidspunktet)} (
              {formaterTilG(grunnlag.yrkesskadeinntekt.antattÅrligInntektIGYrkesskadeTidspunktet)})
            </Table.DataCell>
            <Table.DataCell align={'right'} textSize={'small'}>
              {formaterTilProsent(grunnlag.yrkesskadeinntekt.prosentVekting)}
            </Table.DataCell>
            <Table.DataCell align={'right'} textSize={'small'}>
              {formaterTilG(grunnlag.yrkesskadeinntekt.andelGangerInntektIG)}
            </Table.DataCell>
            <Table.DataCell align={'right'} textSize={'small'}>
              {formaterTilG(grunnlag.yrkesskadeinntekt.andelGangerInntektIG)}
            </Table.DataCell>
          </Table.Row>
          <Table.Row>
            <Table.DataCell textSize={'small'}>
              {visning === 'YRKESSKADE'
                ? 'Høyeste grunnlag beregnet etter § 11-19'
                : 'Høyeste grunnlag beregnet etter §§ 11-19 / 11-28'}
            </Table.DataCell>
            <Table.DataCell align={'right'} textSize={'small'}>
              {formaterTilG(grunnlag.standardYrkesskade.inntektIG)}
            </Table.DataCell>
            <Table.DataCell align={'right'} textSize={'small'}>
              {formaterTilProsent(grunnlag.standardYrkesskade.prosentVekting)}
            </Table.DataCell>
            <Table.DataCell align={'right'} textSize={'small'}>
              {formaterTilG(grunnlag.standardYrkesskade.andelGangerInntektIG)}
            </Table.DataCell>
            <Table.DataCell align={'right'} textSize={'small'}>
              {formaterTilG(grunnlag.standardYrkesskade.andelGangerInntektIG)}
            </Table.DataCell>
          </Table.Row>
          <Table.Row>
            <Table.DataCell textSize={'small'}>
              + {visning === 'YRKESSKADE' ? 'Resterende andel § 11-19' : 'Resterende andel §§ 11-19 / 11-28'}
            </Table.DataCell>
            <Table.DataCell align={'right'} textSize={'small'}>
              {formaterTilG(grunnlag.standardBeregning.inntektIG)}
            </Table.DataCell>
            <Table.DataCell align={'right'} textSize={'small'}>
              {formaterTilProsent(grunnlag.standardBeregning.prosentVekting)}
            </Table.DataCell>
            <Table.DataCell align={'right'} textSize={'small'}>
              {formaterTilG(grunnlag.standardBeregning.andelGangerInntektIG)}
            </Table.DataCell>
            <Table.DataCell align={'right'} textSize={'small'}>
              + {formaterTilG(grunnlag.standardBeregning.andelGangerInntektIG)}
            </Table.DataCell>
          </Table.Row>
          <Table.Row>
            <Table.DataCell textSize={'small'}>
              <b>= Totalt grunnlag beregnet med yrkesskadefordel</b>
            </Table.DataCell>
            <Table.DataCell align={'right'} textSize={'small'} colSpan={4}>
              <b>= {formaterTilG(grunnlag.yrkesskadeGrunnlag)}</b>
            </Table.DataCell>
          </Table.Row>
        </Table.Body>
      </TableStyled>
    </div>
  );
};
