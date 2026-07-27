import { MenuElipsisVerticalIcon } from '@navikt/aksel-icons';
import { ActionMenu, Button, HStack, Loader } from '@navikt/ds-react';
import { useTildelOppgaver } from 'context/oppgave/TildelOppgaverContext';
import { hentTildeltStatusClient, plukkOppgaveClient, synkroniserOppgaveMedEnhetClient } from 'lib/oppgaveClientApi';
import { OppgaveMedKontekst } from 'lib/types/oppgaveTypes';
import { isSuccess } from 'lib/utils/api';
import { byggKelvinURL } from 'lib/utils/request';
import { useRouter } from 'next/navigation';
import { Dispatch, SetStateAction, useTransition } from 'react';

interface Props {
  oppgave: OppgaveMedKontekst;
  setFeilmelding: Dispatch<SetStateAction<string | undefined>>;
  setÅpenModal: Dispatch<SetStateAction<boolean>>;
  setVisSynkroniserEnhetModal: Dispatch<SetStateAction<boolean>>;
  revaliderOppgaver: () => void;
  setVisOppgaveIkkeLedigModal: Dispatch<SetStateAction<boolean>>;
  setSaksbehandlerNavn: Dispatch<SetStateAction<string | undefined>>;
}

export const LedigeOppgaverMeny = ({
  revaliderOppgaver,
  oppgave,
  setFeilmelding,
  setÅpenModal,
  setVisSynkroniserEnhetModal,
  setVisOppgaveIkkeLedigModal,
  setSaksbehandlerNavn,
}: Props) => {
  const router = useRouter();
  const { setOppgaveIder, visModal } = useTildelOppgaver();
  const [isPendingBehandle, startTransitionBehandle] = useTransition();
  const [isPendingMeny, startTransitionMeny] = useTransition();

  async function plukkOgGåTilOppgave(oppgave: OppgaveMedKontekst) {
    startTransitionBehandle(async () => {
      const tildeltStatusForOppgave = await hentTildeltStatusClient(oppgave.behandlingskontekst.behandlingsreferanse);
      if (isSuccess(tildeltStatusForOppgave)) {
        if (tildeltStatusForOppgave.data.tildeltSaksbehandlerIdent != null) {
          setSaksbehandlerNavn(
            tildeltStatusForOppgave.data.tildeltSaksbehandlerNavn ??
              tildeltStatusForOppgave.data.tildeltSaksbehandlerIdent ??
              'Ukjent'
          );
          setVisOppgaveIkkeLedigModal(true);
          return;
        }
      } else {
        setFeilmelding(
          `Feil ved henting av tildelt-status for oppgave: ${tildeltStatusForOppgave.apiException?.message}`
        );
      }

      const plukketOppgave = await plukkOppgaveClient(oppgave.oppgaveMetadata.id, oppgave.oppgaveMetadata.versjon);
      if (isSuccess(plukketOppgave)) {
        router.push(byggKelvinURL(plukketOppgave.data.behandlingskontekst));
      } else {
        if (plukketOppgave.status == 403) {
          setÅpenModal(true);
        } else {
          setFeilmelding(`Feil ved plukking av oppgave: ${plukketOppgave.apiException?.message}`);
        }
      }
    });
  }

  async function synkroniserEnhetPåOppgave(oppgaveId: number) {
    startTransitionMeny(async () => {
      await synkroniserOppgaveMedEnhetClient(oppgaveId);
      revaliderOppgaver();
      setVisSynkroniserEnhetModal(true);
    });
  }

  function åpneOppgave(oppgave: OppgaveMedKontekst) {
    startTransitionMeny(() => {
      router.push(byggKelvinURL(oppgave.behandlingskontekst));
    });
  }

  return (
    <HStack style={{ display: 'flex', justifyContent: 'flex-end' }} gap={'space-4'}>
      <Button
        type={'button'}
        size={'small'}
        variant={'secondary'}
        onClick={() => plukkOgGåTilOppgave(oppgave)}
        loading={isPendingBehandle}
      >
        Behandle
      </Button>
      {!isPendingMeny ? (
        <ActionMenu>
          <ActionMenu.Trigger>
            <Button
              data-color="neutral"
              variant={'tertiary'}
              icon={<MenuElipsisVerticalIcon title={'Oppgavemeny'} />}
              size={'small'}
            />
          </ActionMenu.Trigger>
          <ActionMenu.Content>
            <ActionMenu.Item
              onSelect={() => {
                åpneOppgave(oppgave);
              }}
            >
              Åpne oppgave
            </ActionMenu.Item>
            <ActionMenu.Item onSelect={() => synkroniserEnhetPåOppgave(oppgave.oppgaveMetadata.id)}>
              Sjekk kontortilhørighet
            </ActionMenu.Item>
            <ActionMenu.Item
              onSelect={() => {
                setOppgaveIder([oppgave.oppgaveMetadata.id]);
                visModal();
              }}
            >
              Tildel oppgave
            </ActionMenu.Item>
          </ActionMenu.Content>
        </ActionMenu>
      ) : (
        <Loader />
      )}
    </HStack>
  );
};
