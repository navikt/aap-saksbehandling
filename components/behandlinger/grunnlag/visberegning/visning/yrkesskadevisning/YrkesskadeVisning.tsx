import { InntektTabell } from 'components/inntekttabell/InntektTabell';
import { Label, Table } from '@navikt/ds-react';

import { formaterTilG, formaterTilNok, formaterTilProsent } from 'lib/utils/string';
import { YrkesskadeGrunnlag } from 'lib/types/types';

import styles from '../Visning.module.css';

interface Props {
  grunnlag?: YrkesskadeGrunnlag;
}

export const YrkesskadeVisning = ({ grunnlag }: Props) => {
  if (!grunnlag) {
    return <div>Kunne ikke finne påkrevd grunnlag for yrkesskade</div>;
  }

  return (
    <div className={styles.visning}>
      <InntektTabell
        inntekter={grunnlag.inntekter}
        gjennomsnittSiste3år={grunnlag.gjennomsnittligInntektSiste3år}
        label={'Pensjonsgivende inntekt siste 3 år før redusert arbeidsevne'}
      />
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
                {formaterTilProsent(grunnlag.yrkesskadeInntekt.prosentVekting)}
              </Table.DataCell>
              <Table.DataCell align={'right'}>
                {formaterTilNok(grunnlag.yrkesskadeInntekt.antattÅrligInntektIKronerYrkesskadeTidspunktet)}
              </Table.DataCell>
              <Table.DataCell align={'right'}>
                {formaterTilG(grunnlag.yrkesskadeInntekt.antattÅrligInntektIGYrkesskadeTidspunktet)}
              </Table.DataCell>
              <Table.DataCell align={'right'}>
                {grunnlag.yrkesskadeInntekt.justertTilMaks6G
                  ? '6 G'
                  : formaterTilG(grunnlag.yrkesskadeInntekt.antattÅrligInntektIGYrkesskadeTidspunktet)}
              </Table.DataCell>
            </Table.Row>
            <Table.Row>
              <Table.DataCell>Høyeste grunnlag standard beregning</Table.DataCell>
              <Table.DataCell align={'right'}>
                {formaterTilProsent(grunnlag.standardBeregning.prosentVekting)}
              </Table.DataCell>
              <Table.DataCell align={'center'}>-</Table.DataCell>
              <Table.DataCell align={'right'}>{formaterTilG(grunnlag.standardBeregning.inntektIG)}</Table.DataCell>
              <Table.DataCell align={'right'}>
                {grunnlag.standardBeregning.JustertTilMaks6G
                  ? '6 G'
                  : formaterTilG(grunnlag.standardBeregning.inntektIG)}
              </Table.DataCell>
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
      <div className={'flex-column'}>
        <Label size={'medium'}>Faktisk grunnlag er satt til høyeste verdi av følgende</Label>
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
              <Table.DataCell>Inntekt siste år</Table.DataCell>
              <Table.DataCell align={'right'}>{formaterTilG(grunnlag.inntektSisteÅr.inntektIG)}</Table.DataCell>
            </Table.Row>
            <Table.Row>
              <Table.DataCell>Yrkesskade grunnlag</Table.DataCell>
              <Table.DataCell align={'right'}>{formaterTilG(grunnlag.yrkesskadeGrunnlag)}</Table.DataCell>
            </Table.Row>
            <Table.Row>
              <Table.DataCell>
                <b>Faktisk grunnlag</b>
              </Table.DataCell>
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
