import { InntektTabell } from 'components/inntekttabell/InntektTabell';
import { Label, Table } from '@navikt/ds-react';

import { formaterTilG } from 'lib/utils/string';
import { YrkesskadeGrunnlag } from 'lib/types/types';

import styles from '../Visning.module.css';
import { YrkesskadeBeregningTabell } from 'components/yrkesskadeberegningtabell/YrkesskadeBeregningTabell';

interface Props {
  grunnlag?: YrkesskadeGrunnlag;
}

export const YrkesskadeVisning = ({ grunnlag }: Props) => {
  if (!grunnlag) {
    throw new Error('Kunne ikke finne påkrevd grunnlag for yrkesskade');
  }

  const foersteAar = grunnlag.inntekter.at(0)?.år;
  const sisteAar = grunnlag.inntekter.at(-1)?.år;

  return (
    <div className={styles.visning}>
      <InntektTabell
        inntekter={grunnlag.inntekter}
        gjennomsnittSiste3år={grunnlag.gjennomsnittligInntektSiste3år}
        yrkesevneNedsattÅr={grunnlag.nedsattArbeidsevneÅr}
      />
      <YrkesskadeBeregningTabell grunnlag={grunnlag} visning="YRKESSKADE" />
      <div className={'flex-column'}>
        <Label size={'medium'}>Innbyggers grunnlag er satt til det gunstigste av følgende:</Label>
        <Table size={'medium'}>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Beskrivelse</Table.HeaderCell>
              <Table.HeaderCell align={'right'}>Grunnlag</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <Table.Row>
              <Table.DataCell>{`§ 11-19 Gjennomsnitt inntekt siste 3 år ${foersteAar} - ${sisteAar}`}</Table.DataCell>
              <Table.DataCell align={'right'}>{formaterTilG(grunnlag.gjennomsnittligInntektSiste3år)}</Table.DataCell>
            </Table.Row>
            <Table.Row>
              <Table.DataCell>§ 11-19 Inntekt siste år ({grunnlag.inntektSisteÅr.år})</Table.DataCell>
              <Table.DataCell align={'right'}>{formaterTilG(grunnlag.inntektSisteÅr.justertTilMaks6G)}</Table.DataCell>
            </Table.Row>
            <Table.Row>
              <Table.DataCell>§§ 11-19 / 11-22 Grunnlag med yrkesskadefordel</Table.DataCell>
              <Table.DataCell align={'right'}>{formaterTilG(grunnlag.yrkesskadeGrunnlag)}</Table.DataCell>
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
