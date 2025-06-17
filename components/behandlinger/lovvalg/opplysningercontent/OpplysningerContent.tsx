import { tilhørighetVurdering } from 'lib/types/types';
import { BodyShort, HStack, VStack } from '@navikt/ds-react';
import { formaterPeriode, sorterEtterNyesteDato } from 'lib/utils/date';
import { formaterTilNok } from 'lib/utils/string';
import { getLandNavn } from 'lib/utils/countries';

import styles from './OpplysningerContent.module.css';

interface Props {
  opplysning: tilhørighetVurdering;
}

export const OpplysningerContent = ({ opplysning }: Props) => {
  if (opplysning.arbeidInntektINorgeGrunnlag) {
    const arbeidInntektINorgeGrunnlag = opplysning.arbeidInntektINorgeGrunnlag;

    return (
      <ul className={styles.inntektListe}>
        <VStack gap={'1'}>
          {arbeidInntektINorgeGrunnlag
            .sort((a, b) => sorterEtterNyesteDato(a.periode.fom, b.periode.fom))
            .map((inntekt, index) => {
              return (
                <li key={index} className={styles.inntektListeElement}>
                  <BodyShort size={'small'}>
                    <b>{formaterPeriode(inntekt.periode.fom, inntekt.periode.tom)}:</b>{' '}
                    {inntekt.virksomhetNavn
                      ? `${inntekt.virksomhetNavn} (org.nr: ${inntekt.virksomhetId})`
                      : `org.nr: ${inntekt.virksomhetId}`}
                    , inntekt {formaterTilNok(inntekt.beloep)}
                  </BodyShort>
                </li>
              );
            })}
        </VStack>
      </ul>
    );
  }

  if (opplysning.mottarSykepengerGrunnlag) {
    const mottarSykepengerGrunnlag = opplysning.mottarSykepengerGrunnlag;

    return (
      <VStack gap={'2'}>
        {mottarSykepengerGrunnlag
          .sort((a, b) => sorterEtterNyesteDato(a.periode.fom, b.periode.fom))
          .map((sykepenger, index) => {
            return (
              <VStack gap={'2'} key={index} className={styles.sideDivider}>
                <LabelValue
                  label={'Periode: '}
                  value={formaterPeriode(sykepenger.periode.fom, sykepenger.periode.tom)}
                />
                {sykepenger.inntektType && <LabelValue label={'Type inntekt:'} value={sykepenger.inntektType} />}
              </VStack>
            );
          })}
      </VStack>
    );
  }

  if (opplysning.oppgittJobbetIUtlandGrunnlag) {
    const oppgittJobbetIUtlandGrunnlag = opplysning.oppgittJobbetIUtlandGrunnlag;

    return (
      <VStack gap={'2'}>
        {oppgittJobbetIUtlandGrunnlag.map((jobb, index) => {
          return (
            <VStack gap={'1'} key={index} className={styles.sideDivider}>
              {jobb.land && <LabelValue label={'Land:'} value={jobb.land} />}
              <LabelValue label={'Periode:'} value={formaterPeriode(jobb.fraDato, jobb.tilDato)} />
            </VStack>
          );
        })}
      </VStack>
    );
  }

  if (opplysning.oppgittUtenlandsOppholdGrunnlag) {
    const oppgittUtenlandsOppholdGrunnlag = opplysning.oppgittUtenlandsOppholdGrunnlag;

    return (
      <VStack gap={'2'}>
        {oppgittUtenlandsOppholdGrunnlag.map((opphold, index) => {
          return (
            <VStack gap={'1'} key={index} className={styles.sideDivider}>
              {opphold.land && <LabelValue label={'Land'} value={opphold.land} />}
              <LabelValue label={'Periode:'} value={formaterPeriode(opphold.fraDato, opphold.tilDato)} />
            </VStack>
          );
        })}
      </VStack>
    );
  }

  if (opplysning.manglerStatsborgerskapGrunnlag) {
    const manglerStatsborgerskapGrunnlag = opplysning.manglerStatsborgerskapGrunnlag;

    return (
      <VStack gap={'2'}>
        {manglerStatsborgerskapGrunnlag.map((manglerStatsborgerskap, index) => {
          const landNavn = getLandNavn(manglerStatsborgerskap.land);
          return (
            <VStack gap={'1'} key={index} className={styles.sideDivider}>
              <LabelValue
                label={landNavn ? 'Land/landkode:' : 'Landkode:'}
                value={landNavn ? `${landNavn.label}, ${manglerStatsborgerskap.land}` : manglerStatsborgerskap.land}
              />
              {manglerStatsborgerskap.gyldigFraOgMed && (
                <LabelValue
                  label={'Periode:'}
                  value={formaterPeriode(manglerStatsborgerskap.gyldigFraOgMed, manglerStatsborgerskap.gyldigTilOgMed)}
                />
              )}
            </VStack>
          );
        })}
      </VStack>
    );
  }
  if (opplysning.utenlandsAddresserGrunnlag) {
    const utenlandsAddresserGrunnlag = opplysning.utenlandsAddresserGrunnlag;

    return (
      <VStack gap={'2'}>
        {utenlandsAddresserGrunnlag.map((utenlandsAdresse, index) => {
          return (
            <VStack gap={'1'} key={index} className={styles.sideDivider}>
              <LabelValue
                label={'Adresse:'}
                value={`${utenlandsAdresse.adresseNavn} ${utenlandsAdresse.landkode} ${utenlandsAdresse.postkode}`}
              />
              {utenlandsAdresse.bySted && <LabelValue label={'By/sted:'} value={utenlandsAdresse.bySted} />}
              <LabelValue
                label={'Periode'}
                value={formaterPeriode(utenlandsAdresse.gyldigFraOgMed, utenlandsAdresse.gyldigTilOgMed)}
              />
            </VStack>
          );
        })}
      </VStack>
    );
  }

  if (opplysning.vedtakImedlGrunnlag) {
    const vedtakImedlGrunnlag = opplysning.vedtakImedlGrunnlag;
    return (
      <VStack gap={'2'}>
        {vedtakImedlGrunnlag
          .sort((a, b) => sorterEtterNyesteDato(a.periode.fom, b.periode.fom))
          .map((vedtak, index) => {
            return (
              <VStack gap={'1'} key={index} className={styles.sideDivider}>
                <LabelValue label={'Periode:'} value={formaterPeriode(vedtak.periode.fom, vedtak.periode.tom)} />
                <LabelValue label={'Grunnlagskode:'} value={vedtak.grunnlag} />
                {vedtak.lovvalgsland && <LabelValue label={'Lovvalgsland:'} value={vedtak.lovvalgsland} />}
                {vedtak.kilde?.kildeNavn && <LabelValue label={'Kilde:'} value={vedtak.kilde?.kildeNavn} />}
              </VStack>
            );
          })}
      </VStack>
    );
  }
};

function LabelValue({ label, value }: { label?: string; value: string }) {
  return (
    <HStack gap={'1'}>
      {label && (
        <BodyShort size={'small'} weight={'semibold'}>
          {label}
        </BodyShort>
      )}
      <BodyShort size={'small'}>{value}</BodyShort>
    </HStack>
  );
}
