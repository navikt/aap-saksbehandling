import { Label, Table } from '@navikt/ds-react';
import { Inntekt } from 'components/behandlinger/grunnlag/visberegning/VisBeregning';
import { formaterTilG, formaterTilNok } from 'lib/utils/string';

interface Props {
  label: string;
  inntekter: Array<Inntekt>;
  gjennomsnittSiste3år: number;
}

export const InntektTabell = ({ inntekter, gjennomsnittSiste3år, label }: Props) => {
  return (
    <div className={'flex-column'}>
      <Label size={'medium'}>{label}</Label>
      <Table size={'medium'}>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Periode</Table.HeaderCell>
            <Table.HeaderCell align={'right'}>Pensjonsgivende inntekt</Table.HeaderCell>
            <Table.HeaderCell align={'right'}>Inntekt i G</Table.HeaderCell>
            <Table.HeaderCell align={'right'}>Justert til maks 6G</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {inntekter.map((inntekt) => (
            <Table.Row key={inntekt.år}>
              <Table.DataCell>{inntekt.år}</Table.DataCell>
              <Table.DataCell align={'right'}>{formaterTilNok(inntekt.inntektIKroner)}</Table.DataCell>
              <Table.DataCell align={'right'}>{formaterTilG(inntekt.inntektIG)}</Table.DataCell>
              <Table.DataCell align={'right'}>
                {inntekt.justertTilMaks6G ? '6 G' : formaterTilG(inntekt.inntektIG)}
              </Table.DataCell>
            </Table.Row>
          ))}
          <Table.Row>
            <Table.DataCell>
              <b>Gjennomsnitt siste 3 år</b>
            </Table.DataCell>
            <Table.DataCell></Table.DataCell>
            <Table.DataCell></Table.DataCell>
            <Table.DataCell align={'right'}>
              <b>{formaterTilG(gjennomsnittSiste3år)}</b>
            </Table.DataCell>
          </Table.Row>
        </Table.Body>
      </Table>
    </div>
  );
};
