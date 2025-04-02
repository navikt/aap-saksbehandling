'use client';

import { Button, Dropdown, HStack, Loader } from '@navikt/ds-react';
import { Oppgave } from 'lib/types/oppgaveTypes';
import { Dispatch, SetStateAction, useTransition } from 'react';
import { avreserverOppgaveClient, plukkOppgaveClient } from 'lib/oppgaveClientApi';
import { byggKelvinURL } from 'lib/utils/request';
import { useRouter } from 'next/navigation';
import { revalidateMineOppgaver } from 'lib/actions/actions';
import { ChevronDownIcon } from '@navikt/aksel-icons';
import styles from './OppgaveKnapp.module.css';

interface Props {
  setFeilmelding: Dispatch<SetStateAction<string | undefined>>;
  showBehandleKnapp: boolean;
  oppgave: Oppgave;
}
export const OppgaveKnapp = ({ oppgave, showBehandleKnapp, setFeilmelding }: Props) => {
  const [isPendingBehandle, startTransitionBehandle] = useTransition();
  const [isPendingFrigi, startTransitionFrigi] = useTransition();
  const router = useRouter();

  async function frigiOppgave(oppgave: Oppgave) {
    startTransitionFrigi(async () => {
      await avreserverOppgaveClient(oppgave);
      revalidateMineOppgaver();
    });
  }

  async function plukkOgGåTilOppgave(oppgave: Oppgave) {
    startTransitionBehandle(async () => {
      if (oppgave.id !== undefined && oppgave.id !== null && oppgave.versjon >= 0) {
        const plukketOppgave = await plukkOppgaveClient(oppgave.id, oppgave.versjon);
        if (plukketOppgave.type === 'success') {
          router.push(byggKelvinURL(plukketOppgave.data));
        } else if (plukketOppgave.type === 'error') {
          setFeilmelding(plukketOppgave.message);
        }
      }
    });
  }

  return (
    <div className={styles.comboButton}>
      {showBehandleKnapp && (
        <Button
          type={'button'}
          size={'small'}
          variant={'secondary'}
          onClick={() => plukkOgGåTilOppgave(oppgave)}
          loading={isPendingBehandle}
        >
          Behandle
        </Button>
      )}
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
