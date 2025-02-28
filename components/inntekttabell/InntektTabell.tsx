import { Detail, Label, ReadMore, Table } from '@navikt/ds-react';
import { Inntekt } from 'lib/types/types';

import { formaterTilG, formaterTilNok } from 'lib/utils/string';

interface Props {
  inntekter: Array<Inntekt>;
  gjennomsnittSiste3år: number;
  yrkesevneNedsattÅr: string;
}

export const InntektTabell = ({ inntekter, gjennomsnittSiste3år, yrkesevneNedsattÅr }: Props) => {
  const foersteAar = inntekter.at(0)?.år;
  const sisteAar = inntekter.at(-1)?.år;

  return (
    <div className={'flex-column'}>
      <Label size={'medium'}>Grunnlagsberegning § 11-19</Label>
      <Detail>Bruker fikk arbeidsevnen nedsatt i {yrkesevneNedsattÅr}</Detail>
      <ReadMore header={'Se detaljer om standard grunnlagsberegning'} size={'small'}>
        Inntekter er hentet fra skatteetaten og a-inntekt. Inntekt i G er justert for G-verdi for relevant år.
        Grunnlaget for AAP beregnes basert på brukers inntekt de siste tre årene før arbeidsevne ble redusert.
        Beregningen benytter den gunstigste av siste år og gjennomsnitt siste tre år. Maks grunnlag er 6 G.
      </ReadMore>
      <Table size={'medium'}>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Periode</Table.HeaderCell>
            <Table.HeaderCell align={'right'}>Pensjonsgivende inntekt</Table.HeaderCell>
            <Table.HeaderCell align={'right'}>Inntektsgrunnlag (maks 6 G)</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {inntekter.map((inntekt) => (
            <Table.Row key={inntekt.år}>
              <Table.DataCell>{inntekt.år}</Table.DataCell>
              <Table.DataCell align={'right'}>
                {formaterTilNok(inntekt.inntektIKroner)} ({formaterTilG(inntekt.inntektIG)})
              </Table.DataCell>
              <Table.DataCell align={'right'}>{formaterTilG(inntekt.justertTilMaks6G)}</Table.DataCell>
            </Table.Row>
          ))}
          <Table.Row>
            <Table.DataCell>{`Gjennomsnitt ${foersteAar} - ${sisteAar}`}</Table.DataCell>
            <Table.DataCell align={'right'} colSpan={3}>
              {formaterTilG(gjennomsnittSiste3år)}
            </Table.DataCell>
          </Table.Row>
        </Table.Body>
      </Table>
    </div>
  );
};
