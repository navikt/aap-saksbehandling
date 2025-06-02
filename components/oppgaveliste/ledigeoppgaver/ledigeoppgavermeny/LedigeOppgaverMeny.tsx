import { ActionMenu, Button, Loader } from '@navikt/ds-react';
import { MenuElipsisVerticalIcon } from '@navikt/aksel-icons';
import { Dispatch, SetStateAction, useTransition } from 'react';
import { Oppgave } from 'lib/types/oppgaveTypes';
import { plukkOppgaveClient } from 'lib/oppgaveClientApi';
import { isSuccess } from 'lib/utils/api';
import { byggKelvinURL } from 'lib/utils/request';
import { useRouter } from 'next/navigation';

interface Props {
  oppgave: Oppgave;
  setFeilmelding: Dispatch<SetStateAction<string | undefined>>;
  setÅpenModal: Dispatch<SetStateAction<boolean>>;
}

export const LedigeOppgaverMeny = ({ oppgave, setFeilmelding, setÅpenModal }: Props) => {
  const router = useRouter();
  const [isPendingBehandle, startTransitionBehandle] = useTransition();

  async function plukkOgGåTilOppgave(oppgave: Oppgave) {
    startTransitionBehandle(async () => {
      if (oppgave.id !== undefined && oppgave.id !== null && oppgave.versjon >= 0) {
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

  return (
    <>
      {!isPendingBehandle ? (
        <ActionMenu>
          <ActionMenu.Trigger>
            <Button
              variant={'tertiary-neutral'}
              icon={<MenuElipsisVerticalIcon title={'Oppgavemeny'} />}
              size={'small'}
            />
          </ActionMenu.Trigger>
          <ActionMenu.Content>
            <ActionMenu.Item onSelect={() => plukkOgGåTilOppgave(oppgave)}>Behandle</ActionMenu.Item>
          </ActionMenu.Content>
        </ActionMenu>
      ) : (
        <Loader />
      )}
    </>
  );
};
