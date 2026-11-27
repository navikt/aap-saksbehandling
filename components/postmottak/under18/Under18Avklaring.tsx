'use client';

import { BodyShort, Box, InfoCard, VStack } from '@navikt/ds-react';
import { InformationSquareIcon } from '@navikt/aksel-icons';
import { FormField } from 'components/form/FormField';
import { useConfigForm } from 'components/form/FormHook';
import { PostmottakVilkårskort } from 'components/postmottak/vilkårskort/PostmottakVilkårskort';
import styles from './Under18.module.css';
import { usePostmottakLøsBehovOgGåTilNesteSteg } from 'hooks/postmottak/PostmottakLøsBehovOgGåTilNesteStegHook';
import { usePostmottakVilkårskortVisning } from 'hooks/postmottak/PostmottakVisningHook';
import { Behovstype, getJaNeiEllerUndefined, JaEllerNei, JaEllerNeiOptions } from 'lib/postmottakForm';
import { Under18Grunnlag, Under18Løsning } from 'lib/types/postmottakTypes';
import { formaterDatoForFrontend } from 'lib/utils/date';

interface FormFields {
  aldersvurdering: JaEllerNei;
  bekreftHenleggelse: string[];
  svar: JaEllerNei;
  samtykkeJournalpostIder: string[];
}

interface Props {
  behandlingsreferanse: string;
  behandlingsVersjon: number;
  grunnlag: Under18Grunnlag;
  situasjon: NonNullable<Under18Grunnlag['aldersgrunnlag']>['aldersgruppe'];
  steg: 'AVKLAR_UNDER18' | 'AVKLAR_UNDER18_SAMTYKKE';
  readOnly: boolean;
}

export function Under18Avklaring({
  behandlingsreferanse,
  behandlingsVersjon,
  grunnlag,
  situasjon,
  steg,
  readOnly,
}: Props) {
  const samtykke = steg === 'AVKLAR_UNDER18_SAMTYKKE';
  const opprinneligForUng = situasjon === 'FOR_UNG';
  const { visningModus, formReadOnly, visningActions } = usePostmottakVilkårskortVisning(readOnly, steg);
  const tidligere = grunnlag.samtykkevurdering?.samtykkeJournalpostIder ?? [];
  const journalposter = [...new Set([...grunnlag.søknader.map(({ journalpostId }) => journalpostId), ...tidligere])];
  const { formFields, form } = useConfigForm<FormFields>(
    {
      aldersvurdering: {
        type: 'radio',
        label: 'Er brukeren over 17 år og 9 måneder?',
        defaultValue: getJaNeiEllerUndefined(!opprinneligForUng),
        options: JaEllerNeiOptions,
        rules: { required: 'Velg ja eller nei.' },
      },
      bekreftHenleggelse: {
        type: 'checkbox',
        label: 'Bekreft henleggelse',
        hideLabel: true,
        defaultValue: grunnlag.søknadsavklaring?.situasjon === 'SØKER_FOR_UNG' ? ['henlegg'] : [],
        options: [
          {
            value: 'henlegg',
            label: 'Jeg bekrefter at søknaden skal henlegges fordi søkeren er under 17 år og 9 måneder.',
          },
        ],
        rules: {
          validate: (value, data) =>
            samtykke || data.aldersvurdering !== JaEllerNei.Nei || value.length > 0 || 'Du må bekrefte henleggelsen.',
        },
      },
      svar: {
        type: 'radio',
        label: samtykke
          ? 'Er samtykket vedlagt og signert av foreldre med foreldreansvar?'
          : 'Søkeren har fylt 18 år. Vil søkeren fortsette med søknaden?',
        options: JaEllerNeiOptions,
        defaultValue: getJaNeiEllerUndefined(
          samtykke ? grunnlag.samtykkevurdering?.beggeForeldreSamtykket : grunnlag.søknadsavklaring?.søkerVilFortsette
        ),
        rules: {
          validate: (value, data) =>
            (!samtykke && (data.aldersvurdering === JaEllerNei.Nei || situasjon !== 'FYLT_18')) ||
            !!value ||
            'Velg ja eller nei.',
        },
      },
      samtykkeJournalpostIder: {
        type: 'checkbox',
        label: 'Hvilke journalposter dokumenterer samtykket? (valgfritt)',
        defaultValue: tidligere.map(String),
        options: journalposter.map((id) => ({
          value: String(id),
          label: `Journalpost ${id}${tidligere.includes(id) ? ' (tidligere valgt)' : ''}`,
        })),
      },
    },
    { readOnly: formReadOnly }
  );
  const forUng = form.watch('aldersvurdering') === JaEllerNei.Nei;
  const kunAlderssvar = !samtykke && !forUng && situasjon !== 'FYLT_18';
  const svar = form.watch('svar');
  const { løsBehovOgGåTilNesteSteg, isLoading, status, løsBehovOgGåTilNesteStegError } =
    usePostmottakLøsBehovOgGåTilNesteSteg<Under18Løsning>(steg);
  return (
    <PostmottakVilkårskort
      heading={samtykke ? 'Avklar samtykke' : 'Avklar søknaden'}
      steg={steg}
      isLoading={isLoading}
      status={status}
      løsBehovOgGåTilNesteStegError={løsBehovOgGåTilNesteStegError}
      knappTekst={!samtykke && forUng ? 'Henlegg søknaden' : 'Lagre svar'}
      visningModus={visningModus}
      visningActions={visningActions}
      formReset={() => form.reset()}
      onSubmit={form.handleSubmit((data) => {
        if (isLoading || formReadOnly) return;
        const behov: Under18Løsning = samtykke
          ? {
              behovstype: Behovstype.AVKLAR_UNDER18_SAMTYKKE,
              beggeForeldreSamtykket: data.svar === JaEllerNei.Ja,
              samtykkeJournalpostIder: data.samtykkeJournalpostIder.map(Number),
            }
          : {
              behovstype: Behovstype.AVKLAR_UNDER18_SØKNAD,
              fylt17ÅrOg9Måneder: !forUng,
              ...(!kunAlderssvar && {
                situasjon: forUng ? ('SØKER_FOR_UNG' as const) : ('SØKER_FYLT_18' as const),
                søkerVilFortsette: !forUng && data.svar === JaEllerNei.Ja,
              }),
            };
        løsBehovOgGåTilNesteSteg({
          referanse: behandlingsreferanse,
          behandlingVersjon: behandlingsVersjon,
          behov,
        });
      })}
    >
      <VStack gap="space-16">
        {!samtykke && <FormField form={form} formField={formFields.aldersvurdering} />}
        {!samtykke && grunnlag.aldersgrunnlag && (
          <Box className={styles.faktaboks} background="info-soft" borderRadius="12" padding="space-16">
            <VStack gap="space-8">
              <BodyShort weight="semibold">Barnets fødselsdato</BodyShort>
              <BodyShort size="small">{formaterDatoForFrontend(grunnlag.aldersgrunnlag.fødselsdato)}</BodyShort>
            </VStack>
          </Box>
        )}
        {!samtykke && forUng && (
          <InfoCard data-color="info" size="small" className={styles.faktaboks}>
            <InfoCard.Header icon={<InformationSquareIcon aria-hidden />}>
              <InfoCard.Title>Henlegg søknaden</InfoCard.Title>
            </InfoCard.Header>
            <InfoCard.Content>
              Gå i dialog med brukeren om å henlegge søknaden og eventuelt søke igjen senere.
            </InfoCard.Content>
          </InfoCard>
        )}
        {!kunAlderssvar &&
          (!samtykke && forUng ? (
            <FormField form={form} formField={formFields.bekreftHenleggelse} />
          ) : (
            <FormField form={form} formField={formFields.svar} />
          ))}
        {samtykke && journalposter.length > 0 && (
          <FormField form={form} formField={formFields.samtykkeJournalpostIder} />
        )}
        {samtykke && svar === JaEllerNei.Ja && (
          <InfoCard data-color="info" size="small" className={styles.faktaboks}>
            <InfoCard.Header icon={<InformationSquareIcon aria-hidden />}>
              <InfoCard.Title>Opprett ny sak</InfoCard.Title>
            </InfoCard.Header>
            <InfoCard.Content>Når søknaden med signert samtykke er på plass, vil ny sak opprettes.</InfoCard.Content>
          </InfoCard>
        )}
        {samtykke && svar === JaEllerNei.Nei && (
          <InfoCard data-color="info" size="small" className={styles.faktaboks}>
            <InfoCard.Header icon={<InformationSquareIcon aria-hidden />}>
              <InfoCard.Title>Hent inn samtykke</InfoCard.Title>
            </InfoCard.Header>
            <InfoCard.Content>
              <VStack gap="space-8">
                <BodyShort size="small">
                  Send søknaden og samtykkeskjemaet i posten til foresatte. Når søknaden kommer tilbake med signert
                  samtykkeskjema, kan en sak opprettes og behandles i Kelvin.
                </BodyShort>
                <BodyShort size="small">Behandlingen settes på vent.</BodyShort>
              </VStack>
            </InfoCard.Content>
          </InfoCard>
        )}
        {!samtykke && !kunAlderssvar && svar === JaEllerNei.Nei && (
          <BodyShort size="small">Søknaden henlegges.</BodyShort>
        )}
      </VStack>
    </PostmottakVilkårskort>
  );
}
