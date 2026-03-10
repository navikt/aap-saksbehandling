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
import { OppgaveInfo } from 'hooks/oppgave/OppgaverPåSakHook';

const lokalBrevBestillingKnapp = isLocal();
export const BehandlingButtons = ({
  sak,
  behandling,
  oppgaveInfo,
  setFeilmelding,
  innloggetBrukerIdent
}: {
  sak: SaksInfo;
  behandling: BehandlingsflytEllerPostmottakBehandling;
  oppgaveInfo?: OppgaveInfo;
  setFeilmelding: Dispatch<SetStateAction<string | undefined>>;
  innloggetBrukerIdent: string | undefined;
}) => {
  const router = useRouter();
  const [isPendingBehandling, startTransitionBehandling] = useTransition();
  const [isPendingPlukk, startTransitionPlukk] = useTransition();
  const behandlingErÅpen = behandling.behandling.status === 'OPPRETTET' || behandling.behandling.status === 'UTREDES';
  const kildeErBehandlingsflyt = behandling.kilde === 'BEHANDLINGSFLYT';
  const oppgaveReservertAvInnloggetBruker = oppgaveInfo?.reservertAvIdent === innloggetBrukerIdent;

  async function gåTilBehandling(behandlingsReferanse: string) {
    setFeilmelding('');
    startTransitionBehandling(async () => {
      const internUrl = `/saksbehandling/sak/${sak.saksnummer}/${behandlingsReferanse}`;
      router.push(internUrl);
    });
  }

  async function gåTilPostmottakBehandling(behandlingsReferanse: string) {
    setFeilmelding('');
    startTransitionBehandling(async () => {
      const internUrl = `/postmottak/${behandlingsReferanse}`;
      router.push(internUrl);
    });
  }

  async function plukkOgGåTilBehandling(oppgaveInfo: OppgaveInfo) {
    setFeilmelding('');
    startTransitionPlukk(async () => {
      if (oppgaveInfo.id == null || oppgaveInfo.versjon == null) {
        setFeilmelding('Kunne ikke plukke oppgave.');
        return;
      }
      const plukketOppgave = await plukkOppgaveClient(oppgaveInfo.id, oppgaveInfo.versjon);
      if (isSuccess(plukketOppgave)) {
        router.push(byggKelvinURL(plukketOppgave.data));
      } else {
        if (plukketOppgave.status == 401) {
          setFeilmelding('Du har ikke tilgang til å behandle denne oppgaven.');
        }
      }
    });
  }
  const visBehandleKnapp =
    behandlingErÅpen && (!oppgaveInfo?.reservertAvIdent || oppgaveReservertAvInnloggetBruker);

  if (kildeErBehandlingsflyt && behandling.behandling.eksternSaksbehandlingsløsningUrl) {
    return (
      <HStack gap="2" justify="end">
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
      <HStack gap="2" justify="end">
        {lokalBrevBestillingKnapp && <BestillBrevTestKnapp behandlingReferanse={behandling.behandling.referanse} />}
        {visBehandleKnapp && oppgaveInfo && (
          <Button
            size="small"
            type={'button'}
            icon={!behandlingErÅpen && <EyeIcon />}
            onClick={() => plukkOgGåTilBehandling(oppgaveInfo)}
            variant={'primary'}
            loading={isPendingPlukk}
          >
            Behandle
          </Button>
        )}
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
      </HStack>
    );
  }
};
