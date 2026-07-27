import { SaksInfo } from 'lib/types/types';
import { useRouter } from 'next/navigation';
import { Dispatch, SetStateAction, useTransition } from 'react';
import { Button, HStack } from '@navikt/ds-react';
import { isLocal } from 'lib/utils/environment';
import { BestillBrevTestKnapp } from 'components/behandlinger/brev/BestillBrevTestKnapp';
import { ExternalLinkIcon, EyeIcon } from '@navikt/aksel-icons';
import { BehandlingsflytEllerPostmottakBehandling } from './types';
import { plukkOppgaveClient } from 'lib/oppgaveClientApi';
import { isSuccess } from 'lib/utils/api';
import { byggKelvinURL } from 'lib/utils/request';
import { useInnloggetBruker } from 'hooks/BrukerHook';
import { OppgavePåBehandling } from 'lib/types/oppgaveTypes';

const lokalBrevBestillingKnapp = isLocal();
export const BehandlingButtons = ({
  sak,
  behandling,
  oppgavePåBehandling,
  setFeilmelding,
}: {
  sak: SaksInfo;
  behandling: BehandlingsflytEllerPostmottakBehandling;
  oppgavePåBehandling?: OppgavePåBehandling;
  setFeilmelding: Dispatch<SetStateAction<string | undefined>>;
}) => {
  const router = useRouter();
  const innloggetBruker = useInnloggetBruker();
  const [isPendingBehandling, startTransitionBehandling] = useTransition();
  const [isPendingPlukk, startTransitionPlukk] = useTransition();
  const behandlingErÅpen = behandling.behandling.status === 'OPPRETTET' || behandling.behandling.status === 'UTREDES';
  const kildeErBehandlingsflyt = behandling.kilde === 'BEHANDLINGSFLYT';
  const oppgaveReservertAvInnloggetBruker = oppgavePåBehandling?.reservertAvIdent === innloggetBruker.NAVident;

  async function gåTilBehandling(behandlingsreferanse: string) {
    setFeilmelding('');
    startTransitionBehandling(async () => {
      const internUrl = `/saksbehandling/sak/${sak.saksnummer}/${behandlingsreferanse}`;
      router.push(internUrl);
    });
  }

  async function gåTilPostmottakBehandling(behandlingsreferanse: string) {
    setFeilmelding('');
    startTransitionBehandling(async () => {
      const internUrl = `/postmottak/${behandlingsreferanse}`;
      router.push(internUrl);
    });
  }

  async function plukkOgGåTilBehandling(oppgave: OppgavePåBehandling) {
    setFeilmelding('');
    startTransitionPlukk(async () => {
      const plukketOppgave = await plukkOppgaveClient(oppgave.id, oppgave.versjon);
      if (isSuccess(plukketOppgave)) {
        router.push(byggKelvinURL(plukketOppgave.data.behandlingskontekst));
      } else {
        if (plukketOppgave.status == 403) {
          setFeilmelding('Du har ikke tilgang til å behandle denne oppgaven.');
        }
      }
    });
  }
  const visBehandleKnapp =
    behandlingErÅpen &&
    oppgavePåBehandling &&
    (!oppgavePåBehandling?.reservertAvIdent || oppgaveReservertAvInnloggetBruker);

  if (kildeErBehandlingsflyt && behandling.behandling.eksternSaksbehandlingsløsningUrl) {
    return (
      <HStack gap="space-8" justify="end">
        <Button
          as="a"
          type={'button'}
          size="small"
          href={behandling.behandling.eksternSaksbehandlingsløsningUrl}
          target="_blank"
          rel="noreferrer noopener"
          loading={isPendingBehandling}
          variant={'secondary'}
          icon={<ExternalLinkIcon aria-hidden />}
          title={'Gå til behandling'}
        >
          {behandlingErÅpen ? 'Åpne' : 'Vis'}
        </Button>
      </HStack>
    );
  } else {
    return (
      <HStack gap="space-8" justify="end">
        {lokalBrevBestillingKnapp && <BestillBrevTestKnapp behandlingReferanse={behandling.behandling.referanse} />}
        {!oppgaveReservertAvInnloggetBruker &&
          (kildeErBehandlingsflyt ? (
            <Button
              size="small"
              type={'button'}
              icon={!behandlingErÅpen && <EyeIcon />}
              onClick={() => gåTilBehandling(behandling.behandling.referanse)}
              variant={'secondary'}
              loading={isPendingBehandling}
            >
              {behandlingErÅpen ? 'Åpne' : 'Vis'}
            </Button>
          ) : (
            <Button
              size="small"
              type={'button'}
              icon={!behandlingErÅpen && <EyeIcon />}
              onClick={() => gåTilPostmottakBehandling(behandling.behandling.referanse)}
              variant={'secondary'}
              loading={isPendingBehandling}
            >
              {behandlingErÅpen ? 'Åpne' : 'Vis'}
            </Button>
          ))}
        {visBehandleKnapp && oppgavePåBehandling && (
          <Button
            size="small"
            type={'button'}
            icon={!behandlingErÅpen && <EyeIcon />}
            onClick={() => plukkOgGåTilBehandling(oppgavePåBehandling)}
            variant={'primary'}
            loading={isPendingPlukk}
          >
            Behandle
          </Button>
        )}
      </HStack>
    );
  }
};
