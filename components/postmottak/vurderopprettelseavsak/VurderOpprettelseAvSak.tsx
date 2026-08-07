'use client';

import { SubmitEventHandler } from 'react';
import { BodyShort, HStack, Label, Link, List, ReadMore, Tag, VStack } from '@navikt/ds-react';
import { ExternalLinkIcon } from '@navikt/aksel-icons';
import { Behovstype, HvorSkalSøknadenBehandles } from 'lib/postmottakForm';
import { LøsAvklaringsbehovPåBehandling } from 'lib/types/postmottakTypes';
import { usePostmottakLøsBehovOgGåTilNesteSteg } from 'hooks/postmottak/PostmottakLøsBehovOgGåTilNesteStegHook';
import { usePostmottakVilkårskortVisning } from 'hooks/postmottak/PostmottakVisningHook';
import { PostmottakVilkårskort } from 'components/postmottak/vilkårskort/PostmottakVilkårskort';
import { ServerSentEventStatusAlert } from 'components/postmottak/serversenteventstatusalert/ServerSentEventStatusAlert';
import { Alert } from 'components/alert/Alert';
import { useConfigForm } from 'components/form/FormHook';
import { FormField } from 'components/form/FormField';
import { useFeatureFlag } from 'context/UnleashContext';
import { ManuellFordelingsgrunnlagResponse } from 'lib/services/apiinternservice/apiInternServiceDTOs';
import { ForeldrepengeperiodeDTO, SykepengeperiodeDTO } from 'lib/types/types';
import { formaterDatoForFrontend } from 'lib/utils/date';

const arenaVisningsklientBaseUrl = process.env.NEXT_PUBLIC_ARENA_VISNINGSKLIENT_BASE_URL ?? '';

/**
 * Hvor langt tilbake i tid vi slår opp ytelsesperioder for søker.
 * Foreldrepenger følger 52-ukersvurderingen, sykepenger ser kun på de siste par månedene.
 */
export const ANTALL_UKER_TILBAKE_FORELDREPENGER = 52;
export const ANTALL_MÅNEDER_TILBAKE_SYKEPENGER = 2;

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
  {
    value: HvorSkalSøknadenBehandles.ARENA_OG_KELVIN,
    label: 'Bruker skal både gjenoppta/ gjeninntre i Arenasak, og man skal starte ny sak i Kelvin',
  },
];

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
          hvorBehandles: data.hvorBehandles,
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
      <VStack gap={'space-24'}>
        <ServerSentEventStatusAlert status={status} />

        {arenaSak.saksnummer && (
          <VStack gap="space-16">
            <VStack gap="space-4">
              <Label size="small">Søkers siste arenasak med AAP-vedtak</Label>
              <HStack gap="space-8" align="center">
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
                  {arenaSak.gjenstaendeUnntaksDager != null ? `${arenaSak.gjenstaendeUnntaksDager} dager` : '-'}
                </BodyShort>
              </VStack>
            </HStack>

            <VStack gap="space-4">
              <Label size="small">Siste AAP-vedtak</Label>
              <BodyShort size="small">
                {arenaSak.sisteVedtak
                  ? `${arenaSak.sisteVedtak.fra ? formaterDatoForFrontend(arenaSak.sisteVedtak.fra) : '-'}${
                      arenaSak.sisteVedtak.til ? ` - ${formaterDatoForFrontend(arenaSak.sisteVedtak.til)}` : ''
                    }`
                  : '-'}
              </BodyShort>
            </VStack>

            <VStack gap="space-4">
              <Label size="small">Siste utbetaling</Label>
              <BodyShort size="small">
                {arenaSak.sisteUtbetaling ? formaterDatoForFrontend(arenaSak.sisteUtbetaling) : '-'}
              </BodyShort>
            </VStack>
          </VStack>
        )}

        <HStack gap="space-32" wrap>
          <VStack gap="space-4">
            <Label size="small">Foreldrepenger siste {ANTALL_UKER_TILBAKE_FORELDREPENGER} uker</Label>
            {foreldrepengeperioder.length === 0 ? (
              <BodyShort size="small">Ingen registrerte perioder</BodyShort>
            ) : (
              <List size="small">
                {foreldrepengeperioder.map((periode, index) => (
                  <List.Item key={`foreldrepenger-${index}`}>
                    {`${formaterDatoForFrontend(periode.fom)} - ${formaterDatoForFrontend(periode.tom)} (${periode.utbetalingsgrad} %, ${periode.ytelseStatus})`}
                  </List.Item>
                ))}
              </List>
            )}
          </VStack>

          <VStack gap="space-4">
            <Label size="small">Sykepenger siste {ANTALL_MÅNEDER_TILBAKE_SYKEPENGER} måneder</Label>
            {sykepengeperioder.length === 0 ? (
              <BodyShort size="small">Ingen registrerte perioder</BodyShort>
            ) : (
              <List size="small">
                {sykepengeperioder.map((periode, index) => (
                  <List.Item key={`sykepenger-${index}`}>
                    {`${formaterDatoForFrontend(periode.fom)} - ${formaterDatoForFrontend(periode.tom)} (${periode.grad} %)`}
                  </List.Item>
                ))}
              </List>
            )}
          </VStack>
        </HStack>

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
