import { Button, Dropdown, HStack, Loader } from '@navikt/ds-react';
import { ChevronDownIcon } from '@navikt/aksel-icons';
import { Oppgave } from 'lib/types/oppgaveTypes';
import { avreserverOppgaveClient, plukkOppgaveClient } from 'lib/oppgaveClientApi';
import { isSuccess } from 'lib/utils/api';
import { byggKelvinURL } from 'lib/utils/request';
import { Dispatch, SetStateAction, useTransition } from 'react';
import { useRouter } from 'next/navigation';

import styles from './MineOppgaverMeny.module.css';

interface Props {
  oppgave: Oppgave;
  setFeilmelding: Dispatch<SetStateAction<string | undefined>>;
  revalidateFunction: () => void;
}

export const MineOppgaverMeny = ({ oppgave, setFeilmelding, revalidateFunction }: Props) => {
  const [isPendingFrigi, startTransitionFrigi] = useTransition();
  const [isPendingBehandle, startTransitionBehandle] = useTransition();

  const router = useRouter();

  async function frigiOppgave(oppgave: Oppgave) {
    startTransitionFrigi(async () => {
      const res = await avreserverOppgaveClient(oppgave);

      if (isSuccess(res)) {
        if (revalidateFunction) {
          revalidateFunction();
        }
      } else {
        setFeilmelding(`Feil ved avreservering av oppgave: ${res.apiException.message}`);
      }
    });
  }

  async function plukkOgGåTilOppgave(oppgave: Oppgave) {
    startTransitionBehandle(async () => {
      if (oppgave.id !== undefined && oppgave.id !== null && oppgave.versjon >= 0) {
        const plukketOppgave = await plukkOppgaveClient(oppgave.id, oppgave.versjon);
        if (isSuccess(plukketOppgave)) {
          router.push(byggKelvinURL(plukketOppgave.data));
        } else {
          setFeilmelding(`Feil ved plukking av oppgave: ${plukketOppgave.apiException.message}`);
        }
      }
    });
  }
  return (
    <div className={styles.comboButton}>
      <Button
        type={'button'}
        size={'small'}
        variant={'secondary'}
        onClick={() => plukkOgGåTilOppgave(oppgave)}
        loading={isPendingBehandle}
      >
        Behandle
      </Button>
      <Dropdown>
        <Button as={Dropdown.Toggle} size="small" variant="secondary">
          <HStack align={'center'}>
            {isPendingFrigi ? <Loader size={'xsmall'} /> : <ChevronDownIcon title="Meny" />}
          </HStack>
        </Button>
        <Dropdown.Menu>
          <Dropdown.Menu.GroupedList>
            <Dropdown.Menu.GroupedList.Item onClick={() => frigiOppgave(oppgave)}>
              Frigi oppgave
            </Dropdown.Menu.GroupedList.Item>
          </Dropdown.Menu.GroupedList>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
};
