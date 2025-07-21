import { BodyShort, Table, VStack } from '@navikt/ds-react';
import { UføreInntekt } from 'lib/types/types';

import { formaterTilG, formaterTilNok, formaterTilProsent } from 'lib/utils/string';
import { TableStyled } from 'components/tablestyled/TableStyled';
import { Veiledning } from 'components/veiledning/Veiledning';

interface Props {
  inntekter: Array<UføreInntekt>;
  gjennomsnittSiste3år: number;
  ytterligereNedsattArbeidsevneÅr: string;
}

export const UføreInntektTabell = ({ inntekter, gjennomsnittSiste3år, ytterligereNedsattArbeidsevneÅr }: Props) => {
  const foersteAar = inntekter.at(0)?.år;
  const sisteAar = inntekter.at(-1)?.år;

  return (
    <div className={'flex-column'}>
      <VStack gap={'1'}>
        <BodyShort size={'small'} weight={'semibold'}>
          Grunnlagsberegning § 11-19 etter oppjustering jf. § 11-28 fjerde ledd
        </BodyShort>
        <BodyShort size={'small'}>
          Brukeren fikk ytterligere nedsatt arbeidsevne i {ytterligereNedsattArbeidsevneÅr}
        </BodyShort>
        <Veiledning
          header={'Se detaljer for beregning ved uføre'}
          tekst={
            'Der bruker har gradert uføre skal det beregningen benytte gunstigste av: 1) Tidspunktet da brukers arbeidsevne ble redusert med minst 50%. Typisk uføretidspunktet for gradert uføretrygd. 2) Tidspunktet da arbeidsevne ble ytterligere nedsatt. Typisk når bruker får ytterligere redusert arbeidsevne. I det siste tilfellet skal inntekt fra deltidsstilling oppjusteres til 100 % stilling basert på uføregraden. Uføretrygd er ikke pensjonsgivende inntekt. Maks grunnlag er 6 G.'
          }
        />
      </VStack>
      <TableStyled size={'small'}>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell textSize={'small'}>Periode</Table.HeaderCell>
            <Table.HeaderCell align={'right'} textSize={'small'}>
              Uføregrad
            </Table.HeaderCell>
            <Table.HeaderCell align={'right'} textSize={'small'}>
              Deltidsinntekt
            </Table.HeaderCell>
            <Table.HeaderCell align={'right'} textSize={'small'}>
              Justert for uføregrad
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
                {formaterTilProsent(inntekt.uføreGrad)}
              </Table.DataCell>
              <Table.DataCell align={'right'} textSize={'small'}>
                {formaterTilNok(inntekt.inntektIKroner)} ({formaterTilG(inntekt.inntektIG)})
              </Table.DataCell>
              <Table.DataCell align={'right'} textSize={'small'}>
                {formaterTilNok(inntekt.justertForUføreGrad)} ({formaterTilG(inntekt.justertForUføreGradiG)})
              </Table.DataCell>
              <Table.DataCell align={'right'} textSize={'small'}>
                {formaterTilG(inntekt.justertTilMaks6G)}
              </Table.DataCell>
            </Table.Row>
          ))}
          <Table.Row>
            <Table.DataCell textSize={'small'}>{`Gjennomsnitt ${foersteAar} - ${sisteAar}`}</Table.DataCell>
            <Table.DataCell align={'right'} colSpan={5} textSize={'small'}>
              {formaterTilG(gjennomsnittSiste3år)}
            </Table.DataCell>
          </Table.Row>
        </Table.Body>
      </TableStyled>
    </div>
  );
};
