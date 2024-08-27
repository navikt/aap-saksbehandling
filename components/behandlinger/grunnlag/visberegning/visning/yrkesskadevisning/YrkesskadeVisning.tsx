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

  return (
    <div className={styles.visning}>
      <InntektTabell
        inntekter={grunnlag.inntekter}
        gjennomsnittSiste3år={grunnlag.gjennomsnittligInntektSiste3år}
        label={'Standard grunnlagsberegning basert på pensjonsgivende inntekt siste 3 år før redusert arbeidsevne'}
        grunnlagBeregnet={grunnlag.grunnlag}
      />
      <YrkesskadeBeregningTabell grunnlag={grunnlag} />
      <div className={'flex-column'}>
        <Label size={'medium'}>Innbyggers grunnlag er satt til gunstigste av følgende </Label>
        <Table size={'medium'}>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Beskrivelse</Table.HeaderCell>
              <Table.HeaderCell align={'right'}>Grunnlag</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <Table.Row>
              <Table.DataCell>Gjennomsnittlig inntekt siste 3 år</Table.DataCell>
              <Table.DataCell align={'right'}>{formaterTilG(grunnlag.gjennomsnittligInntektSiste3år)}</Table.DataCell>
            </Table.Row>
            <Table.Row>
              <Table.DataCell>Inntekt siste år ({grunnlag.inntektSisteÅr.år})</Table.DataCell>
              <Table.DataCell align={'right'}>{formaterTilG(grunnlag.inntektSisteÅr.justertTilMaks6G)}</Table.DataCell>
            </Table.Row>
            <Table.Row>
              <Table.DataCell>Yrkesskade grunnlag</Table.DataCell>
              <Table.DataCell align={'right'}>{formaterTilG(grunnlag.yrkesskadeGrunnlag)}</Table.DataCell>
            </Table.Row>
            <Table.Row>
              <Table.HeaderCell scope={'row'}>Grunnlag satt til</Table.HeaderCell>
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
