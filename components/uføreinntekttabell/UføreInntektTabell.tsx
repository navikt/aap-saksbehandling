import { Label, ReadMore, Table } from '@navikt/ds-react';
import { UføreInntekt } from 'lib/types/types';

import { formaterTilG, formaterTilNok, formaterTilProsent } from 'lib/utils/string';

interface Props {
  inntekter: Array<UføreInntekt>;
  gjennomsnittSiste3år: number;
}

export const UføreInntektTabell = ({ inntekter, gjennomsnittSiste3år }: Props) => {
  return (
    <div className={'flex-column'}>
      <Label size={'medium'}>Grunnlagsberegning ytterligere nedsatt arbeidsevne ved ufør</Label>
      <ReadMore header={'Se detaljer for beregning ved uføre'}>
        Der innbygger har gradert uføre skal det beregningen benytte gunstigste av: 1) Tidspunktet da innbyggers
        arbeidsevne ble redusert med minst 50%. Typisk uføretidspunktet for gradert uføretrygd. 2) Tidspunktet da
        arbeidsevne ble ytterligere nedsatt. Typisk når innbygger får ytterligere redusert arbeidsevne. I det siste
        tilfellet skal inntekt fra deltidsstilling oppjusteres til 100 % stilling basert på uføregraden. Uføretrygd er
        ikke pensjonsgivende inntekt. Maks grunnlag er 6 G.
      </ReadMore>
      <Table size={'medium'}>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Periode</Table.HeaderCell>
            <Table.HeaderCell align={'right'}>Uføregrad</Table.HeaderCell>
            <Table.HeaderCell align={'right'}>Inntekt</Table.HeaderCell>
            <Table.HeaderCell align={'right'}>Justert for uføregrad</Table.HeaderCell>
            <Table.HeaderCell align={'right'}>Inntekt i G</Table.HeaderCell>
            <Table.HeaderCell align={'right'}>Justert til maks 6G</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {inntekter.map((inntekt) => (
            <Table.Row key={inntekt.år}>
              <Table.DataCell>{inntekt.år}</Table.DataCell>
              <Table.DataCell align={'right'}>{formaterTilProsent(inntekt.uføreGrad)}</Table.DataCell>
              <Table.DataCell align={'right'}>{formaterTilNok(inntekt.inntektIKroner)}</Table.DataCell>
              <Table.DataCell align={'right'}>{formaterTilNok(inntekt.justertForUføreGrad)}</Table.DataCell>
              <Table.DataCell align={'right'}>{formaterTilG(inntekt.inntektIG)}</Table.DataCell>
              <Table.DataCell align={'right'}>{formaterTilG(inntekt.justertTilMaks6G)}</Table.DataCell>
            </Table.Row>
          ))}
          <Table.Row>
            <Table.DataCell>Gjennomsnitt siste 3 år før ytterligere nedsatt</Table.DataCell>
            <Table.DataCell align={'right'} colSpan={5}>
              {formaterTilG(gjennomsnittSiste3år)}
            </Table.DataCell>
          </Table.Row>
          <Table.Row>
            <Table.DataCell>Grunnlag ytterligere nedsatt</Table.DataCell>
            <Table.DataCell align={'right'} colSpan={5}>
              {formaterTilG(gjennomsnittSiste3år)}
            </Table.DataCell>
          </Table.Row>
        </Table.Body>
      </Table>
    </div>
  );
};
