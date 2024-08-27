import { InntektTabell } from 'components/inntekttabell/InntektTabell';
import { Label, Table } from '@navikt/ds-react';

import styles from '../Visning.module.css';
import { Grunnlag1119 } from 'lib/types/types';
import { formaterTilG } from 'lib/utils/string';

interface Props {
  grunnlag?: Grunnlag1119;
}

export const Grunnlag1119Visning = ({ grunnlag }: Props) => {
  if (!grunnlag) {
    throw new Error('Kunne ikke finne påkrevd grunnlag for 11-19');
  }

  return (
    <div className={styles.visning}>
      <InntektTabell
        label={'Standard grunnlagsberegning basert på pensjonsgivende inntekt siste 3 år før redusert arbeidsevne'}
        inntekter={grunnlag.inntekter}
        gjennomsnittSiste3år={grunnlag.gjennomsnittligInntektSiste3år}
        grunnlagBeregnet={grunnlag.grunnlag}
      />
      <div className={'flex-column'}>
        <Label size={'medium'}>Innbyggers grunnlag er satt til gunstigste av følgende</Label>
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
