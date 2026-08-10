'use client';

import { ExclamationmarkTriangleIcon, ExternalLinkIcon } from '@navikt/aksel-icons';
import { BodyShort, HStack, Label, Link, List, ReadMore, Tag, VStack } from '@navikt/ds-react';
import { useFeatureFlag } from 'context/UnleashContext';
import { usePostmottakLøsBehovOgGåTilNesteSteg } from 'hooks/postmottak/PostmottakLøsBehovOgGåTilNesteStegHook';
import { usePostmottakVilkårskortVisning } from 'hooks/postmottak/PostmottakVisningHook';
import { Behovstype, HvorSkalSøknadenBehandles } from 'lib/postmottakForm';
import { ManuellFordelingsgrunnlagResponse } from 'lib/services/apiinternservice/apiInternServiceDTOs';
import { LøsAvklaringsbehovPåBehandling } from 'lib/types/postmottakTypes';
import { ForeldrepengeperiodeDTO, SykepengeperiodeDTO } from 'lib/types/types';
import { formaterDatoForFrontend } from 'lib/utils/date';
import { SubmitEventHandler } from 'react';

import { Alert } from 'components/alert/Alert';
import { FormField } from 'components/form/FormField';
import { useConfigForm } from 'components/form/FormHook';
import { ServerSentEventStatusAlert } from 'components/postmottak/serversenteventstatusalert/ServerSentEventStatusAlert';
import { PostmottakVilkårskort } from 'components/postmottak/vilkårskort/PostmottakVilkårskort';

const arenaVisningsklientBaseUrl = process.env.NEXT_PUBLIC_ARENA_VISNINGSKLIENT_BASE_URL ?? '';

/**
 * Hvor langt tilbake i tid vi slår opp ytelsesperioder for søker.
 * Brukes kun til visningstekst her – selve oppslaget gjøres i VurderOpprettelseAvSakMedDataFetching.
 */
const ANTALL_UKER_TILBAKE_FORELDREPENGER = 52;
const ANTALL_MÅNEDER_TILBAKE_SYKEPENGER = 2;

const AKTFASEKODE_TIL_TEKST: Record<string, string> = {
  UVUP: '§ 11-18 Under vurdering for uføretrygd',
  FA: '§ 11-17',
  SPE: '§ 11-13',
};

interface Props {
  behandlingsVersjon: number;
  behandlingsreferanse: string;
  arenagrunnlag: ManuellFordelingsgrunnlagResponse;
  foreldrepengeperioder: ForeldrepengeperiodeDTO[];
  sykepengeperioder: SykepengeperiodeDTO[];
  readOnly: boolean;
}

interface FormFields {
  hvorBehandles: HvorSkalSøknadenBehandles;
  kommentar: string;
}

// Behovet løses i steget AVKLAR_FORDELING.
const STEG = 'AVKLAR_FORDELING';

const hvorBehandlesOptions = [
  {
    value: HvorSkalSøknadenBehandles.ARENA,
    label: 'Arena, bruker har fortsatt gjenværende rettigheter på eksisterende sak',
  },
  {
    value: HvorSkalSøknadenBehandles.KELVIN,
    label: 'Kelvin, søknaden skal vurderes som ny sak',
  },
];

const getOppgaveTekst = (oppgave: ManuellFordelingsgrunnlagResponse['oppgaver'][number]) =>
  oppgave.beskrivelse ?? 'beskrivelse ikke funnet';

const getSisteVedtakTekst = (sisteVedtak: ManuellFordelingsgrunnlagResponse['sisteVedtak']) => {
  if (!sisteVedtak) {
    return '-';
  }

  const aktfaseTekst = AKTFASEKODE_TIL_TEKST[sisteVedtak.aktfaseKode] ?? sisteVedtak.aktfaseKode;
  const datointervall = `${sisteVedtak.fra ? formaterDatoForFrontend(sisteVedtak.fra) : '-'}${
    sisteVedtak.til ? ` - ${formaterDatoForFrontend(sisteVedtak.til)}` : ''
  }`;

  return `${aktfaseTekst}  ${datointervall}`;
};

export const VurderOpprettelseAvSak = ({
  behandlingsVersjon,
  behandlingsreferanse,
  arenagrunnlag,
  foreldrepengeperioder,
  sykepengeperioder,
  readOnly,
}: Props) => {
  const arenaSak = arenagrunnlag;
  const visArenaLenke = useFeatureFlag('ArenasakerLenkeTilVisninsklient');

  const { formFields, form } = useConfigForm<FormFields>(
    {
      hvorBehandles: {
        type: 'radio',
        label: 'Hvor skal søknaden behandles?',
        description:
          'Vurder om søknaden er aktuell for videre behandling i Arena. Legg ev denne oppgaven på vent om det er behov for utredning.',
        rules: { required: 'Du må velge hvor søknaden skal behandles' },
        options: hvorBehandlesOptions,
      },
      kommentar: {
        type: 'textarea',
        label: 'Kommentar til saksbehandler (frivillig)',
        defaultValue: '',
      },
    },
    { readOnly }
  );

  const { løsBehovOgGåTilNesteSteg, status, isLoading, løsBehovOgGåTilNesteStegError } =
    usePostmottakLøsBehovOgGåTilNesteSteg(STEG);
  const { visningActions, visningModus } = usePostmottakVilkårskortVisning(readOnly, STEG);

  const valgtHvorBehandles = form.watch('hvorBehandles');
  const opprettesOppgaveIArena =
    valgtHvorBehandles === HvorSkalSøknadenBehandles.ARENA ||
    valgtHvorBehandles === HvorSkalSøknadenBehandles.ARENA_OG_KELVIN;

  const onSubmit: SubmitEventHandler = (event) => {
    form.handleSubmit((data) => {
      løsBehovOgGåTilNesteSteg({
        behandlingVersjon: behandlingsVersjon,
        // TODO: Fjern casten når backend-typene eksponerer løsning-DTO for behov 1343.
        behov: {
          behovstype: Behovstype.AVKLAR_FORDELING,
          valgtSystem: data.hvorBehandles,
          kommentar: data.kommentar || null,
        } as unknown as LøsAvklaringsbehovPåBehandling['behov'],
        referanse: behandlingsreferanse,
      });
    })(event);
  };

  return (
    <PostmottakVilkårskort
      heading={'Avklar om det skal opprettes ny sak i Kelvin'}
      steg={STEG}
      onSubmit={onSubmit}
      isLoading={isLoading}
      status={status}
      løsBehovOgGåTilNesteStegError={løsBehovOgGåTilNesteStegError}
      knappTekst={'Bekreft'}
      visningModus={visningModus}
      visningActions={visningActions}
      formReset={() => {}}
    >
      <VStack gap={'space-16'}>
        <ServerSentEventStatusAlert status={status} />

        {arenaSak.saksnummer && (
          <VStack gap="space-16">
            <VStack gap="space-16">
              <Label size="small">Søkers siste arenasak med AAP-vedtak</Label>
              <HStack gap="space-16" align="center">
                {visArenaLenke ? (
                  <Link href={`${arenaVisningsklientBaseUrl}sak/${arenaSak.saksnummer}`} target="_blank">
                    Saksnr. {arenaSak.saksnummer}
                    <ExternalLinkIcon aria-hidden />
                  </Link>
                ) : (
                  <BodyShort size="small">Saksnr. {arenaSak.saksnummer}</BodyShort>
                )}
                <Tag variant="moderate" data-color={arenaSak.erAktiv ? 'success' : 'neutral'} size="small">
                  {arenaSak.erAktiv ? 'Aktiv' : 'Inaktiv'}
                </Tag>
                {arenaSak.under52Uker && (
                  <Tag variant="moderate" data-color="warning" size="small">
                    Under 52
                  </Tag>
                )}
              </HStack>
            </VStack>

            <HStack gap="space-32" wrap>
              <VStack gap="space-4">
                <Label size="small">Gjenstående ordinær periode</Label>
                <BodyShort size="small">
                  {arenaSak.gjenstaendeOrdinaereDager != null ? `${arenaSak.gjenstaendeOrdinaereDager} dager` : '-'}
                </BodyShort>
              </VStack>
              <VStack gap="space-4">
                <Label size="small">Gjenstående unntaksperiode §11-12 andre og tredje ledd</Label>
                <BodyShort size="small">
                  {arenaSak.gjenstaendeUnntaksDager && arenaSak.gjenstaendeUnntaksDager > 0
                    ? `${arenaSak.gjenstaendeUnntaksDager} dager`
                    : '-'}
                </BodyShort>
              </VStack>
            </HStack>

            <VStack gap="space-4">
              <Label size="small">Siste AAP-vedtak</Label>
              <BodyShort size="small">{getSisteVedtakTekst(arenaSak.sisteVedtak)}</BodyShort>
            </VStack>

            <VStack gap="space-4">
              <Label size="small">Siste utbetaling</Label>
              <BodyShort size="small">
                {arenaSak.sisteUtbetaling ? formaterDatoForFrontend(arenaSak.sisteUtbetaling) : '-'}
              </BodyShort>
            </VStack>
          </VStack>
        )}

        <Link href={`${arenaVisningsklientBaseUrl}sak/${arenaSak.saksnummer}`} target="_blank">
          Nav-kontorets innstilling for §11-12
          <ExternalLinkIcon aria-hidden />
        </Link>
        <VStack gap="space-16">
          {foreldrepengeperioder.length > 0 && (
            <VStack gap="space-4">
              <Label size="small">Foreldrepenger</Label>
              <HStack gap="space-4" align="center">
                <ExclamationmarkTriangleIcon aria-hidden color="var(--a-orange-500)" fontSize="1rem" />
                <BodyShort size="small">
                  Det er utbetalt foreldrepenger i løpet av de siste {ANTALL_UKER_TILBAKE_FORELDREPENGER} ukene
                </BodyShort>
              </HStack>
            </VStack>
          )}
          {sykepengeperioder.length > 0 && (
            <VStack gap="space-4">
              <Label size="small">Sykepenger</Label>
              <HStack gap="space-4" align="center">
                <ExclamationmarkTriangleIcon aria-hidden color="var(--a-orange-500)" fontSize="1rem" />
                <BodyShort size="small">
                  Det er utbetalt sykepenger de siste {ANTALL_MÅNEDER_TILBAKE_SYKEPENGER} månedene
                </BodyShort>
              </HStack>
            </VStack>
          )}
        </VStack>

        {arenaSak.oppgaver.length > 0 && (
          <VStack gap="space-4">
            <Label size="small">Oppgaver i Arena tilknyttet AAP eller person</Label>
            <List size="small">
              {arenaSak.oppgaver.map((oppgave) => (
                <List.Item key={oppgave.oppgaveId}>{getOppgaveTekst(oppgave)}</List.Item>
              ))}
            </List>
          </VStack>
        )}

        <ReadMore size="small" header="Dette må du vurdere" defaultOpen>
          <VStack gap="space-8">
            <BodyShort size="small">Alle ny saker skal behandles i Kelvin.</BodyShort>
            <BodyShort size="small">Du må vurdere om saken skal fortsette i Arena. Dette kan være:</BodyShort>
            <List size="small">
              <List.Item>
                Bruker har mer igjen av perioden og søknaden kommer inn før det har gått 52 uker siden forrige
                utbetaling.
              </List.Item>
              <List.Item>
                Søknaden kommer inn før det har gått 52 uker siden forrige utbetaling, og vilkårene unntak jf. § 11-12
                er oppfylt.
              </List.Item>
              <List.Item>Brukeren mottar AAP, og søker nå om AAP under vurdering av uføretrygd. Jf. § 11-18.</List.Item>
              <List.Item>Brukeren mottar AAP, og søker nå om AAP i påvente av arbeid. Jf. § 11-17</List.Item>
            </List>
          </VStack>
        </ReadMore>

        <FormField form={form} formField={formFields.hvorBehandles} />

        <FormField form={form} formField={formFields.kommentar} />

        {opprettesOppgaveIArena && <Alert variant="info">Det blir nå opprettet en oppgave i Arena</Alert>}
      </VStack>
    </PostmottakVilkårskort>
  );
};
