import { tilhørighetVurdering } from 'lib/types/types';
import { BodyShort, HStack, VStack } from '@navikt/ds-react';
import { formaterDatoForFrontend } from 'lib/utils/date';
import { formaterTilNok } from 'lib/utils/string';

interface Props {
  opplysning: tilhørighetVurdering;
}

export const OpplysningerContent = ({ opplysning }: Props) => {
  if (opplysning.arbeidInntektINorgeGrunnlag) {
    const arbeidInntektINorgeGrunnlag = opplysning.arbeidInntektINorgeGrunnlag;

    return (
      <HStack gap={'2'}>
        {arbeidInntektINorgeGrunnlag.map((inntekt, index) => {
          return (
            <VStack gap={'2'} key={index} style={{ paddingLeft: '1rem', borderLeft: '1px solid gray' }}>
              <HStack gap={'1'}>
                <BodyShort size={'small'} weight={'semibold'}>
                  Periode:
                </BodyShort>
                <BodyShort size={'small'}>
                  {formaterDatoForFrontend(inntekt.periode.fom)} - {formaterDatoForFrontend(inntekt.periode.tom)}
                </BodyShort>
              </HStack>
              <HStack gap={'1'}>
                <BodyShort size={'small'} weight={'semibold'}>
                  VirksomhetId:
                </BodyShort>
                <BodyShort size={'small'}>{inntekt.virksomhetId}</BodyShort>
              </HStack>
              <HStack gap={'1'}>
                <BodyShort size={'small'} weight={'semibold'}>
                  Beløp:
                </BodyShort>
                <BodyShort size={'small'}>{formaterTilNok(inntekt.beloep)}</BodyShort>
              </HStack>
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
        {mottarSykepengerGrunnlag.map((sykepenger, index) => {
          return (
            <VStack gap={'2'} key={index} style={{ paddingLeft: '1rem', borderLeft: '1px solid gray' }}>
              <BodyShort size={'small'}>{sykepenger.inntektType}</BodyShort>
              <BodyShort size={'small'}>
                {formaterDatoForFrontend(sykepenger.periode.fom)} - {formaterDatoForFrontend(sykepenger.periode.tom)}
              </BodyShort>
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
              <BodyShort size={'small'}>{jobb.land}</BodyShort>
              <BodyShort size={'small'}>{formaterPeriode(jobb.fraDato, jobb.tilDato)}</BodyShort>
            </VStack>
          );
        })}
      </VStack>
    );
  }

  // TODO Hvorfor er denne boolsk?
  if (opplysning.oppgittUtenlandsOppholdGrunnlag) {
    return <VStack gap={'2'}>Hva skal vises her?</VStack>;
  }

  if (opplysning.manglerStatsborgerskapGrunnlag) {
    const manglerStatsborgerskapGrunnlag = opplysning.manglerStatsborgerskapGrunnlag;

    return (
      <VStack gap={'2'}>
        {manglerStatsborgerskapGrunnlag.map((manglerStatsborgerskap, index) => {
          return (
            <VStack gap={'1'} key={index} style={{ paddingLeft: '1rem', borderLeft: '1px solid gray' }}>
              <BodyShort size={'small'}>{manglerStatsborgerskap.land}</BodyShort>
              <BodyShort size={'small'}>
                {formaterPeriode(manglerStatsborgerskap.gyldigFraOgMed, manglerStatsborgerskap.gyldigTilOgMed)}
              </BodyShort>
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
              <BodyShort size={'small'}>
                {utenlandsAdresse.adresseNavn} {utenlandsAdresse.landkode} {utenlandsAdresse.postkode}
              </BodyShort>
              <BodyShort size={'small'}>{utenlandsAdresse.bySted}</BodyShort>
              <BodyShort size={'small'}>
                {formaterPeriode(utenlandsAdresse.gyldigFraOgMed, utenlandsAdresse.gyldigTilOgMed)}
              </BodyShort>
            </VStack>
          );
        })}
      </VStack>
    );
  }

  if (opplysning.vedtakImedlGrunnlag) {
    return <div>{JSON.stringify(opplysning.vedtakImedlGrunnlag)}</div>;
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
