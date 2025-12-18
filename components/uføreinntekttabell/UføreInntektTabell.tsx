import { BodyShort, Table, VStack } from '@navikt/ds-react';
import { GjeldendeGrunnbeløp, UføreInntekt } from 'lib/types/types';

import { formaterTilG, formaterTilNok } from 'lib/utils/string';
import { TableStyled } from 'components/tablestyled/TableStyled';
import { Veiledning } from 'components/veiledning/Veiledning';
import { formaterDatoMedKunDagOgMånedForFrontend } from 'lib/utils/date';
import styles from './UføreInntektTabell.module.css';

interface Props {
  inntekter: Array<UføreInntekt>;
  gjennomsnittSiste3år: number;
  ytterligereNedsattArbeidsevneÅr: string;
  gjeldendeGrunnbeløp: GjeldendeGrunnbeløp;
}

export const UføreInntektTabell = ({
  inntekter,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  gjennomsnittSiste3år, // TODO AAP-1377 Avklar behovet for denne
  ytterligereNedsattArbeidsevneÅr,
  gjeldendeGrunnbeløp,
}: Props) => {
  const inntektsårListe = inntekter.map((inntekt) => inntekt.år);
  const alleInntektsgrunnlag = inntekter.map((inntekt) => inntekt.justertTilMaks6G);
  const gjennomsnittligGrunnlag =
    alleInntektsgrunnlag.reduce((inntekt1, inntekt2) => inntekt1 + inntekt2) / alleInntektsgrunnlag.length;

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
              Pensjonsgivende inntekt
            </Table.HeaderCell>
            <Table.HeaderCell align={'right'} textSize={'small'}>
              Oppjustert 100%
            </Table.HeaderCell>
            <Table.HeaderCell align={'right'} textSize={'small'}>
              Inntektsgrunnlag (maks 6 G)
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {inntekter.map((inntekt) => {
            return inntekt.inntektsPerioder.map((periode, currIndex) => {
              const { justertTilMaks6G, år } = inntekt;
              const { inntektJustertForUføregrad, inntektIKroner, uføregrad } = periode;
              const { fom, tom } = periode.periode;
              const perioderIGjeldendeÅr = inntekt.inntektsPerioder;
              const erSistePeriodeIGjeldendeÅr = currIndex == perioderIGjeldendeÅr.length - 1;

              return (
                <>
                  <Table.Row key={fom} className={styles.rad}>
                    <Table.DataCell textSize={'small'}>
                      {år} ({formaterDatoMedKunDagOgMånedForFrontend(fom)} {'- '}
                      {formaterDatoMedKunDagOgMånedForFrontend(tom)})
                    </Table.DataCell>
                    <Table.DataCell align={'right'} textSize={'small'}>
                      {`${uføregrad} %`}
                    </Table.DataCell>
                    <Table.DataCell align={'right'} textSize={'small'}>
                      {formaterTilNok(inntektJustertForUføregrad.verdi)}
                      {formaterInntektTilG(inntektJustertForUføregrad.verdi, gjeldendeGrunnbeløp)}
                    </Table.DataCell>
                    <Table.DataCell align={'right'} textSize={'small'}>
                      {formaterTilNok(inntektIKroner.verdi)}
                      {formaterInntektTilG(inntektIKroner.verdi, gjeldendeGrunnbeløp)}
                    </Table.DataCell>
                    <Table.DataCell align={'right'} textSize={'small'}>
                      {formaterTilG(justertTilMaks6G / inntekt.inntektsPerioder.length)}
                    </Table.DataCell>
                  </Table.Row>
                  {erSistePeriodeIGjeldendeÅr && (
                    <Table.Row className={`${styles.rad} ${styles.footer}`}>
                      <Table.DataCell textSize={'small'} className={styles.fetSkrift}>
                        Sum inntektsgrunnlag {år}
                      </Table.DataCell>
                      <Table.DataCell></Table.DataCell>
                      <Table.DataCell></Table.DataCell>
                      <Table.DataCell></Table.DataCell>
                      <Table.DataCell align={'right'} textSize={'small'} className={styles.fetSkrift}>
                        {formaterTilG(justertTilMaks6G)}
                      </Table.DataCell>
                    </Table.Row>
                  )}
                </>
              );
            });
          })}
          {inntekter.length > 1 && (
            <Table.Row className={`${styles.rad} ${styles.footer}`}>
              <Table.DataCell textSize={'small'} className={styles.fetSkrift}>
                Gjennomsnitt {inntektsårListe.at(0)} - {inntektsårListe.at(-1)}
              </Table.DataCell>
              <Table.DataCell></Table.DataCell>
              <Table.DataCell></Table.DataCell>
              <Table.DataCell></Table.DataCell>
              <Table.DataCell align={'right'} textSize={'small'} className={styles.fetSkrift}>
                {formaterTilG(gjennomsnittligGrunnlag)}
              </Table.DataCell>
            </Table.Row>
          )}
        </Table.Body>
      </TableStyled>
    </div>
  );
};

function formaterInntektTilG(inntekt: number, gjeldendeGrunnbeløp: GjeldendeGrunnbeløp): string {
  const grunnbeløp = gjeldendeGrunnbeløp?.grunnbeløp;
  return grunnbeløp != null ? ` (${formaterTilG(inntekt / grunnbeløp)})` : '';
}
