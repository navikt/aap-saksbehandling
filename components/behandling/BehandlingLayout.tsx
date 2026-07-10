import { SWRConfig } from 'swr';
import { IngenFlereOppgaverModalContextProvider } from 'context/saksbehandling/IngenFlereOppgaverModalContext';
import styles from 'app/saksbehandling/sak/[saksnummer]/[behandlingsreferanse]/layout.module.css';
import { IngenFlereOppgaverModal } from 'components/ingenflereoppgavermodal/IngenFlereOppgaverModal';
import { SaksinfoBanner } from 'components/saksinfobanner/SaksinfoBanner';
import { StegGruppeIndikatorAksel } from 'components/steggruppeindikator/StegGruppeIndikatorAksel';
import { VStack } from '@navikt/ds-react';
import { ToTrinnsvurderingMedDataFetching } from 'components/totrinnsvurdering/ToTrinnsvurderingMedDataFetching';
import { ReactNode } from 'react';
import {
  auditlog,
  hentBehandling,
  hentFlyt,
  hentKabalKlageresultat,
  hentKlageresultat,
  hentSak,
} from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { isError } from 'lib/utils/api';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { hentOppgave } from 'lib/services/oppgaveservice/oppgaveservice';
import { StegGruppe } from 'lib/types/types';
import { SakContextProvider } from 'context/saksbehandling/SakContext';
import { ÅrsakTilBehandling } from 'components/revurderingsinfo/ÅrsakTilBehandling';
import { visÅrsakTilVurdering } from './visÅrsakTilVurdering';
import { OverstyrTildelingContextProvider } from 'context/saksbehandling/OverstyrTildelingContext';
import { OverstyrTildelingNyModal } from 'components/overstyrtildelingmodal/OverstyrTildelingNyModal';
import { Kolonnelayout } from 'components/behandling/Kolonnelayout';
import { OverstyrTildelingModal } from 'components/overstyrtildelingmodal/OverstyrTildelingModal';

interface Props {
  saksnummer: string;
  behandlingsreferanse: string;
  children: ReactNode;
}

export const BehandlingLayout = async ({ saksnummer, behandlingsreferanse, children }: Props) => {
  const behandling = await hentBehandling(behandlingsreferanse);

  if (isError(behandling)) {
    return (
      <VStack padding={'space-16'}>
        <ApiException apiResponses={[behandling]} />
      </VStack>
    );
  }

  // noinspection ES6MissingAwait - trenger ikke vente på svar fra auditlog-kall
  auditlog(behandlingsreferanse);

  const [oppgave, flytResponse, sak, kabalKlageResultat, klageresultat] = await Promise.all([
    hentOppgave(behandlingsreferanse),
    hentFlyt(behandlingsreferanse),
    hentSak(saksnummer),
    hentKabalKlageresultat(behandlingsreferanse),
    hentKlageresultat(behandlingsreferanse),
  ]);

  if (isError(flytResponse) || isError(klageresultat) || isError(oppgave)) {
    return (
      <VStack padding={'space-16'}>
        <ApiException apiResponses={[flytResponse, klageresultat, oppgave]} />
      </VStack>
    );
  }

  const stegGrupperSomSkalVises: StegGruppe[] = flytResponse.data.flyt
    .filter((steg) => steg.skalVises)
    .map((stegSomSkalVises) => stegSomSkalVises.stegGruppe);

  const visTotrinnsvurdering =
    flytResponse.data.visning.visBeslutterKort || flytResponse.data.visning.visKvalitetssikringKort;

  const visÅrsakTilAktivitetspliktBehandling =
    ['Aktivitetsplikt', 'Aktivitetsplikt11_9'].includes(behandling.data.type) &&
    behandling.data.vurderingsbehovOgÅrsaker?.some((e) => e.årsak === 'OMGJØRING_ETTER_KLAGE');
  const visÅrsakTilRevurdering = visÅrsakTilVurdering(behandling.data);
  const visÅrsakTilEndreStartstidspunkt = behandling.data.vurderingsbehovOgÅrsaker
    ?.flatMap((v) => v.vurderingsbehov)
    ?.some((v) => v.type === 'VURDER_RETTIGHETSPERIODE');

  const visÅrsakTilBehandling =
    visÅrsakTilAktivitetspliktBehandling || visÅrsakTilRevurdering || visÅrsakTilEndreStartstidspunkt;

  return (
    <SWRConfig
      value={{
        fallback: {
          [`api/flyt/${behandlingsreferanse}`]: flytResponse,
        },
      }}
    >
      <IngenFlereOppgaverModalContextProvider>
        <OverstyrTildelingContextProvider>
          <div className={styles.behandling}>
            <IngenFlereOppgaverModal />

            <OverstyrTildelingModal />
            <OverstyrTildelingNyModal />

            <SaksinfoBanner
              behandling={behandling.data}
              sak={sak}
              oppgave={oppgave.data}
              flyt={flytResponse.data.flyt}
              visning={flytResponse.data.visning}
            />

            <StegGruppeIndikatorAksel
              flytRespons={flytResponse.data}
              stegGrupperSomSkalVises={stegGrupperSomSkalVises}
            />

            <SakContextProvider
              sak={{
                ident: sak.ident,
                opprettetTidspunkt: sak.opprettetTidspunkt,
                periode: sak.periode,
                saksnummer: sak.saksnummer,
                virkningsTidspunkt: behandling.data.virkningstidspunkt,
              }}
            >
              <Kolonnelayout
                visTotrinnsvurdering={visTotrinnsvurdering}
                toTrinnsvurdering={
                  visTotrinnsvurdering ? (
                    <ToTrinnsvurderingMedDataFetching behandlingsreferanse={behandlingsreferanse} />
                  ) : undefined
                }
                behandling={behandling.data}
                sak={sak}
                klageresultat={klageresultat.data}
                kabalKlageresultat={kabalKlageResultat}
                hovedkolonneInnhold={
                  <VStack gap={'space-20'}>
                    {visÅrsakTilBehandling && (
                      <ÅrsakTilBehandling
                        behandlingType={behandling.data.type}
                        vurderingsbehovOgÅrsaker={behandling.data.vurderingsbehovOgÅrsaker}
                      />
                    )}
                    {/*Vi må ha children inne i en div for å unngå layoutshift*/}
                    <div style={{ width: '100%' }}>{children}</div>
                  </VStack>
                }
              />
            </SakContextProvider>
          </div>
        </OverstyrTildelingContextProvider>
      </IngenFlereOppgaverModalContextProvider>
    </SWRConfig>
  );
};
