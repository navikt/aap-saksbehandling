import React from 'react';
import { GjeldendeGrunnbeløp, UføreGrunnlag } from 'lib/types/types';
import { InntektTabell } from 'components/inntekttabell/InntektTabell';
import { BodyShort, Table } from '@navikt/ds-react';
import { formaterTilG } from 'lib/utils/string';
import { UføreInntektTabell } from 'components/uføreinntekttabell/UføreInntektTabell';
import { sorterEtterÅrIStigendeRekkefølge } from 'lib/utils/arrays';
import { formaterBeregnetGrunnlag } from 'lib/utils/grunnlagsberegning';

interface Props {
  grunnlag?: UføreGrunnlag;
  gjeldendeGrunnbeløp: GjeldendeGrunnbeløp;
}

export const UføreVisning = ({ grunnlag, gjeldendeGrunnbeløp }: Props) => {
  if (!grunnlag) {
    throw new Error('Kunne ikke finne påkrevd grunnlag for uføre');
  }

  const sorterteInntekter = sorterEtterÅrIStigendeRekkefølge(grunnlag.inntekter);
  const sorterteUføreinntekter = sorterEtterÅrIStigendeRekkefølge(grunnlag.uføreInntekter);

  const foersteAar = sorterteInntekter.at(0)?.år;
  const sisteAar = sorterteInntekter.at(-1)?.år;

  const uføreFørsteÅr = sorterteUføreinntekter.at(0)?.år;
  const uføreSisteÅr = sorterteUføreinntekter.at(-1)?.år;

  return (
    <div className={'flex-column'}>
      <InntektTabell
        inntekter={grunnlag.inntekter}
        gjennomsnittSiste3år={grunnlag.gjennomsnittligInntektSiste3år}
        yrkesevneNedsattÅr={grunnlag.nedsattArbeidsevneÅr}
      />

      <UføreInntektTabell
        inntekter={grunnlag.uføreInntekter}
        gjennomsnittSiste3år={grunnlag.gjennomsnittligInntektSiste3årUfør}
        ytterligereNedsattArbeidsevneÅr={grunnlag.ytterligereNedsattArbeidsevneÅr}
      />

      <div className={'flex-column'}>
        <BodyShort size={'small'} weight={'semibold'}>
          Brukers grunnlag er satt til det gunstigste av følgende
        </BodyShort>
        <Table size={'medium'}>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell textSize={'small'}>Beskrivelse</Table.HeaderCell>
              <Table.HeaderCell align={'right'} textSize={'small'}>
                Grunnlag
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <Table.Row>
              <Table.DataCell
                textSize={'small'}
              >{`§ 11-19 Gjennomsnitt inntekt siste 3 år (${foersteAar} - ${sisteAar})`}</Table.DataCell>
              <Table.DataCell align={'right'} textSize={'small'}>
                {formaterTilG(grunnlag.gjennomsnittligInntektSiste3år)}
              </Table.DataCell>
            </Table.Row>
            <Table.Row>
              <Table.DataCell textSize={'small'}>
                § 11-19 Inntekt siste år ({grunnlag.inntektSisteÅr.år})
              </Table.DataCell>
              <Table.DataCell align={'right'} textSize={'small'}>
                {formaterTilG(grunnlag.inntektSisteÅr.inntektIG)}
              </Table.DataCell>
            </Table.Row>
            <Table.Row>
              <Table.DataCell
                textSize={'small'}
              >{`§§ 11-19 / 11-28 Gjennomsnitt inntekt siste 3 år (${uføreFørsteÅr} - ${uføreSisteÅr})`}</Table.DataCell>
              <Table.DataCell align={'right'} textSize={'small'}>
                {formaterTilG(grunnlag.gjennomsnittligInntektSiste3årUfør)}
              </Table.DataCell>
            </Table.Row>
            <Table.Row>
              <Table.DataCell
                textSize={'small'}
              >{`§§ 11-19 / 11-28 Inntekt siste år (${grunnlag.inntektSisteÅrUfør.år})`}</Table.DataCell>
              <Table.DataCell align={'right'} textSize={'small'}>
                {formaterTilG(grunnlag.inntektSisteÅrUfør.justertForUføreGradiG)}
              </Table.DataCell>
            </Table.Row>
            <Table.Row>
              <Table.HeaderCell scope={'row'} textSize={'small'}>
                Fastsatt grunnlag
              </Table.HeaderCell>
              <Table.DataCell align={'right'} textSize={'small'}>
                ({formaterBeregnetGrunnlag(grunnlag.grunnlag, gjeldendeGrunnbeløp)}){' '}
                <b>{formaterTilG(grunnlag.grunnlag)}</b>
              </Table.DataCell>
            </Table.Row>
          </Table.Body>
        </Table>
      </div>
    </div>
  );
};
