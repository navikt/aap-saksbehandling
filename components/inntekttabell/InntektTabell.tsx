import { BodyShort, Table, VStack } from '@navikt/ds-react';
import { Inntekt } from 'lib/types/types';

import { formaterTilG, formaterTilNok } from 'lib/utils/string';
import { TableStyled } from 'components/tablestyled/TableStyled';
import { Veiledning } from 'components/veiledning/Veiledning';

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
      <VStack gap={'1'}>
        <BodyShort size={'small'} weight={'semibold'}>
          Grunnlagsberegning § 11-19
        </BodyShort>
        <BodyShort size={'small'}>Bruker fikk arbeidsevnen nedsatt i {yrkesevneNedsattÅr}</BodyShort>
        <Veiledning
          header={'Se detaljer om standard grunnlagsberegning'}
          tekst={
            'Inntekter er hentet fra skatteetaten og a-inntekt. Inntekt i G er justert for G-verdi for relevant år. Grunnlaget for AAP beregnes basert på brukers inntekt de siste tre årene før arbeidsevne ble redusert. Beregningen benytter den gunstigste av siste år og gjennomsnitt siste tre år. Maks grunnlag er 6 G.'
          }
        ></Veiledning>
      </VStack>
      <TableStyled size={'medium'}>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell textSize={'small'}>Periode</Table.HeaderCell>
            <Table.HeaderCell align={'right'} textSize={'small'}>
              Pensjonsgivende inntekt
            </Table.HeaderCell>
            <Table.HeaderCell align={'right'} textSize={'small'}>
              Inntektsgrunnlag (maks 6 G)
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {inntekter.map((inntekt) => (
            <Table.Row key={inntekt.år}>
              <Table.DataCell textSize={'small'}>{inntekt.år}</Table.DataCell>
              <Table.DataCell align={'right'} textSize={'small'}>
                {formaterTilNok(inntekt.inntektIKroner)} ({formaterTilG(inntekt.inntektIG)})
              </Table.DataCell>
              <Table.DataCell align={'right'} textSize={'small'}>
                {formaterTilG(inntekt.justertTilMaks6G)}
              </Table.DataCell>
            </Table.Row>
          ))}
          <Table.Row>
            <Table.DataCell textSize={'small'}>
              <b>{`Gjennomsnitt ${foersteAar} - ${sisteAar}`}</b>
            </Table.DataCell>
            <Table.DataCell align={'right'} colSpan={3} textSize={'small'}>
              <b>{formaterTilG(gjennomsnittSiste3år)}</b>
            </Table.DataCell>
          </Table.Row>
        </Table.Body>
      </TableStyled>
    </div>
  );
};
