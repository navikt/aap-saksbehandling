import { tilhørighetVurdering } from 'lib/types/types';
import { BodyShort, HStack, VStack } from '@navikt/ds-react';
import { formaterDatoForFrontend, sorterEtterNyesteDato } from 'lib/utils/date';
import { formaterTilNok } from 'lib/utils/string';
import { getLandNavn } from 'lib/utils/countries';

interface Props {
  opplysning: tilhørighetVurdering;
}

export const OpplysningerContent = ({ opplysning }: Props) => {
  if (opplysning.arbeidInntektINorgeGrunnlag) {
    const arbeidInntektINorgeGrunnlag = opplysning.arbeidInntektINorgeGrunnlag;

    return (
      <HStack gap={'2'}>
        {arbeidInntektINorgeGrunnlag
          .sort((a, b) => sorterEtterNyesteDato(a.periode.fom, b.periode.fom))
          .map((inntekt, index) => {
            return (
              <VStack gap={'2'} key={index} style={{ paddingLeft: '1rem', borderLeft: '1px solid gray' }}>
                <LabelValue label={'Periode:'} value={formaterPeriode(inntekt.periode.fom, inntekt.periode.tom)} />
                <LabelValue
                  label={'Virksomhet:'}
                  value={
                    inntekt.virksomhetNavn
                      ? `${inntekt.virksomhetNavn} (${inntekt.virksomhetId})`
                      : inntekt.virksomhetId
                  }
                />
                <LabelValue label={'Beløp:'} value={formaterTilNok(inntekt.beloep)} />
              </VStack>
            );
          })}
      </HStack>
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
              <VStack gap={'2'} key={index} style={{ paddingLeft: '1rem', borderLeft: '1px solid gray' }}>
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
            <VStack gap={'1'} key={index} style={{ paddingLeft: '1rem', borderLeft: '1px solid gray' }}>
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
            <VStack gap={'1'} key={index} style={{ paddingLeft: '1rem', borderLeft: '1px solid gray' }}>
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
            <VStack gap={'1'} key={index} style={{ paddingLeft: '1rem', borderLeft: '1px solid gray' }}>
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
            <VStack gap={'1'} key={index} style={{ paddingLeft: '1rem', borderLeft: '1px solid gray' }}>
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
              <VStack gap={'1'} key={index} style={{ paddingLeft: '1rem', borderLeft: '1px solid gray' }}>
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

function formaterPeriode(dato1?: string | null, dato2?: string | null): string {
  if (dato1 && !dato2) {
    return `${formaterDatoForFrontend(dato1)} - `;
  } else if (dato1 && dato2) {
    return `${formaterDatoForFrontend(dato1)} - ${formaterDatoForFrontend(dato2)}`;
  } else {
    return '';
  }
}

function LabelValue({ label, value }: { label: string; value: string }) {
  return (
    <HStack gap={'1'}>
      <BodyShort size={'small'} weight={'semibold'}>
        {label}
      </BodyShort>
      <BodyShort size={'small'}>{value}</BodyShort>
    </HStack>
  );
}
