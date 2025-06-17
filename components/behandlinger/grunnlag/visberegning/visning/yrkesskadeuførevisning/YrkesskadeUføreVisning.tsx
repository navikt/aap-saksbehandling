import React from 'react';
import { GjeldendeGrunnbeløp, Inntekt, YrkesskadeUføreGrunnlag } from 'lib/types/types';

import styles from '../Visning.module.css';
import { InntektTabell } from 'components/inntekttabell/InntektTabell';
import { UføreInntektTabell } from 'components/uføreinntekttabell/UføreInntektTabell';
import { YrkesskadeBeregningTabell } from 'components/yrkesskadeberegningtabell/YrkesskadeBeregningTabell';
import { BodyShort, Table } from '@navikt/ds-react';
import { formaterTilG } from 'lib/utils/string';
import { sorterEtterÅrIStigendeRekkefølge } from 'lib/utils/arrays';
import { formaterBeregnetGrunnlag } from 'lib/utils/grunnlagsberegning';

interface Props {
  grunnlag?: YrkesskadeUføreGrunnlag;
  gjeldendeGrunnbeløp: GjeldendeGrunnbeløp;
}

export const YrkesskadeUføreVisning = ({ grunnlag, gjeldendeGrunnbeløp }: Props) => {
  if (!grunnlag) {
    throw new Error('Kunne ikke finne påkrevd grunnlag for uføre og yrkesskade');
  }

  const sorterteInntekterYS = sorterEtterÅrIStigendeRekkefølge(grunnlag.yrkesskadeGrunnlag.inntekter);
  const sorterteInntekterUføre = sorterEtterÅrIStigendeRekkefølge(grunnlag.uføreGrunnlag.uføreInntekter);

  return (
    <div className={styles.visning}>
      <InntektTabell
        inntekter={sorterteInntekterYS}
        gjennomsnittSiste3år={grunnlag?.yrkesskadeGrunnlag.gjennomsnittligInntektSiste3år}
        yrkesevneNedsattÅr={grunnlag?.uføreGrunnlag.nedsattArbeidsevneÅr}
      />

      <UføreInntektTabell
        inntekter={sorterteInntekterUføre}
        gjennomsnittSiste3år={grunnlag.uføreGrunnlag.gjennomsnittligInntektSiste3årUfør}
        ytterligereNedsattArbeidsevneÅr={grunnlag.uføreGrunnlag.ytterligereNedsattArbeidsevneÅr}
      />

      <YrkesskadeBeregningTabell grunnlag={grunnlag.yrkesskadeGrunnlag} visning="YRKESSKADE_UFØR" />

      <div className={'flex-column'}>
        <BodyShort size={'small'} weight={'semibold'}>
          Brukers grunnlag er satt til det mest gunstig av følgende
        </BodyShort>
        <Table size={'medium'}>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Beskrivelse</Table.HeaderCell>
              <Table.HeaderCell align={'right'}>Grunnlag</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <Table.Row>
              <Table.DataCell>
                § 11-19 {formaterLabelForInntekter(grunnlag.yrkesskadeGrunnlag.inntekter)}
              </Table.DataCell>
              <Table.DataCell align={'right'}>
                {formaterTilG(grunnlag.yrkesskadeGrunnlag.gjennomsnittligInntektSiste3år)}
              </Table.DataCell>
            </Table.Row>
            <Table.Row>
              <Table.DataCell>
                § 11-19 Inntekt siste år ({grunnlag.yrkesskadeGrunnlag.inntektSisteÅr.år})
              </Table.DataCell>
              <Table.DataCell align={'right'}>
                {formaterTilG(grunnlag.yrkesskadeGrunnlag.inntektSisteÅr.justertTilMaks6G)}
              </Table.DataCell>
            </Table.Row>

            <Table.Row>
              <Table.DataCell>
                §§ 11-19 / 11-28 {formaterLabelForInntekter(grunnlag.uføreGrunnlag.uføreInntekter)}
              </Table.DataCell>
              <Table.DataCell align={'right'}>
                {formaterTilG(grunnlag.uføreGrunnlag.gjennomsnittligInntektSiste3årUfør)}
              </Table.DataCell>
            </Table.Row>
            <Table.Row>
              <Table.DataCell>
                §§ 11-19 / 11-28 Inntekt siste år ({grunnlag.uføreGrunnlag.inntektSisteÅrUfør.år})
              </Table.DataCell>
              <Table.DataCell align={'right'}>
                {formaterTilG(grunnlag.uføreGrunnlag.inntektSisteÅrUfør.justertTilMaks6G)}
              </Table.DataCell>
            </Table.Row>
            <Table.Row>
              <Table.DataCell>§§ 11-19 / 11-22 Grunnlag med yrkesskadefordel</Table.DataCell>
              <Table.DataCell align={'right'}>
                {formaterTilG(grunnlag.yrkesskadeGrunnlag.yrkesskadeGrunnlag)}
              </Table.DataCell>
            </Table.Row>
            <Table.Row>
              <Table.DataCell>
                <b>Fastsatt grunnlag</b>
              </Table.DataCell>
              <Table.DataCell align={'right'}>
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

function formaterLabelForInntekter(inntekt: Array<Inntekt>): string {
  const sortedInntekt = inntekt.sort((a, b) => Number(a.år) - Number(b.år));
  const firstYear = sortedInntekt[0].år;
  const lastYear = sortedInntekt[sortedInntekt.length - 1].år;

  return `Gjennomsnitt inntekt siste 3 år (${firstYear} - ${lastYear})`;
}
