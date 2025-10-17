import { ActionMenu, Button, HStack, Loader } from '@navikt/ds-react';
import { MenuElipsisVerticalIcon } from '@navikt/aksel-icons';
import { Dispatch, SetStateAction, useTransition } from 'react';
import { Oppgave } from 'lib/types/oppgaveTypes';
import { hentOppgaveClient, plukkOppgaveClient, synkroniserOppgaveMedEnhetClient } from 'lib/oppgaveClientApi';
import { isSuccess } from 'lib/utils/api';
import { byggKelvinURL } from 'lib/utils/request';
import { useRouter } from 'next/navigation';
import { isProd } from 'lib/utils/environment';
import { useTildelOppgaver } from 'context/oppgave/TildelOppgaverContext';
import { toggles } from 'lib/utils/toggles';

interface Props {
  oppgave: Oppgave;
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

  async function plukkOgGåTilOppgave(oppgave: Oppgave) {
    startTransitionBehandle(async () => {
      if (oppgave.id !== undefined && oppgave.id !== null && oppgave.versjon >= 0 && oppgave.behandlingRef) {
        if (toggles.featureIkkeMuligÅPlukkeOppgaveSomAlleredeErReservert) {
          const nyesteOppgave = await hentOppgaveClient(oppgave.behandlingRef);
          if (isSuccess(nyesteOppgave)) {
            if (nyesteOppgave.data.reservertAv != null) {
              setSaksbehandlerNavn(nyesteOppgave.data.reservertAvNavn ?? nyesteOppgave.data.reservertAv ?? 'Ukjent');
              setVisOppgaveIkkeLedigModal(true);
              return;
            }
          } else {
            setFeilmelding(`Feil ved henting av oppgave: ${nyesteOppgave.apiException.message}`);
          }
        }

        const plukketOppgave = await plukkOppgaveClient(oppgave.id, oppgave.versjon);
        if (isSuccess(plukketOppgave)) {
          router.push(byggKelvinURL(plukketOppgave.data));
        } else {
          if (plukketOppgave.status == 401) {
            setÅpenModal(true);
          } else {
            setFeilmelding(`Feil ved plukking av oppgave: ${plukketOppgave.apiException.message}`);
          }
        }
      }
    });
  }

  async function synkroniserEnhetPåOppgave(oppgave: Oppgave) {
    startTransitionMeny(async () => {
      if (oppgave.id) {
        await synkroniserOppgaveMedEnhetClient(oppgave.id);
        revaliderOppgaver();
        setVisSynkroniserEnhetModal(true);
      }
    });
  }

  function åpneOppgave(oppgave: Oppgave) {
    startTransitionMeny(() => {
      if (oppgave.id) {
        router.push(byggKelvinURL(oppgave));
      }
    });
  }

  return (
    <HStack style={{ display: 'flex', justifyContent: 'flex-end' }} gap={'1'}>
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
              variant={'tertiary-neutral'}
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
            <ActionMenu.Item onSelect={() => synkroniserEnhetPåOppgave(oppgave)}>
              Sjekk kontortilhørighet
            </ActionMenu.Item>
            <ActionMenu.Item
              onSelect={() => {
                oppgave.id && setOppgaveIder([oppgave.id]);
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
