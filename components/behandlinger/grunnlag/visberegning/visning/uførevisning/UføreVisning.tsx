import React from 'react';
import { UføreGrunnlag } from 'lib/types/types';
import { InntektTabell } from 'components/inntekttabell/InntektTabell';
import { Label, Table } from '@navikt/ds-react';
import { formaterTilG } from 'lib/utils/string';
import { UføreInntektTabell } from 'components/uføreinntekttabell/UføreInntektTabell';
import { sorterEtterÅrIStigendeRekkefølge } from 'lib/utils/arrays';

interface Props {
  grunnlag?: UføreGrunnlag;
}

export const UføreVisning = ({ grunnlag }: Props) => {
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
        <Label size={'medium'}>Brukers grunnlag er satt til det gunstigste av følgende:</Label>
        <Table size={'medium'}>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Beskrivelse</Table.HeaderCell>
              <Table.HeaderCell align={'right'}>Grunnlag</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <Table.Row>
              <Table.DataCell>{`§ 11-19 Gjennomsnitt inntekt siste 3 år (${foersteAar} - ${sisteAar})`}</Table.DataCell>
              <Table.DataCell align={'right'}>{formaterTilG(grunnlag.gjennomsnittligInntektSiste3år)}</Table.DataCell>
            </Table.Row>
            <Table.Row>
              <Table.DataCell>§ 11-19 Inntekt siste år ({grunnlag.inntektSisteÅr.år})</Table.DataCell>
              <Table.DataCell align={'right'}>{formaterTilG(grunnlag.inntektSisteÅr.inntektIG)}</Table.DataCell>
            </Table.Row>
            <Table.Row>
              <Table.DataCell>{`§§ 11-19 / 11-28 Gjennomsnitt inntekt siste 3 år (${uføreFørsteÅr} - ${uføreSisteÅr})`}</Table.DataCell>
              <Table.DataCell align={'right'}>
                {formaterTilG(grunnlag.gjennomsnittligInntektSiste3årUfør)}
              </Table.DataCell>
            </Table.Row>
            <Table.Row>
              <Table.DataCell>{`§§ 11-19 / 11-28 Inntekt siste år (${grunnlag.inntektSisteÅrUfør.år})`}</Table.DataCell>
              <Table.DataCell align={'right'}>{formaterTilG(grunnlag.inntektSisteÅrUfør.justertForUføreGradiG)}</Table.DataCell>
            </Table.Row>
            <Table.Row>
              <Table.HeaderCell scope={'row'}>Fastsatt grunnlag</Table.HeaderCell>
              <Table.DataCell align={'right'}>
                <b>{formaterTilG(grunnlag.grunnlag)}</b>
              </Table.DataCell>
            </Table.Row>
          </Table.Body>
        </Table>
      </div>
    </div>
  );
};
