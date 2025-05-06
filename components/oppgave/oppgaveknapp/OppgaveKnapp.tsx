'use client';

import { ActionMenu, Button, Dropdown, HStack, Loader } from '@navikt/ds-react';
import { Oppgave } from 'lib/types/oppgaveTypes';
import { Dispatch, SetStateAction, useTransition } from 'react';
import { avreserverOppgaveClient, plukkOppgaveClient } from 'lib/oppgaveClientApi';
import { byggKelvinURL } from 'lib/utils/request';
import { useRouter } from 'next/navigation';
import { ChevronDownIcon, MenuElipsisVerticalIcon } from '@navikt/aksel-icons';
import styles from './OppgaveKnapp.module.css';
import { isSuccess } from 'lib/utils/api';

interface Props {
  setFeilmelding: Dispatch<SetStateAction<string | undefined>>;
  visBehandleOgFrigiKnapp?: boolean;
  oppgave: Oppgave;
  revalidateFunction?: () => void;
}
export const OppgaveKnapp = ({ oppgave, visBehandleOgFrigiKnapp, setFeilmelding, revalidateFunction }: Props) => {
  const [isPendingBehandle, startTransitionBehandle] = useTransition();
  const [isPendingFrigi, startTransitionFrigi] = useTransition();
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
    <>
      {visBehandleOgFrigiKnapp === true ? (
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
      ) : (
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
      )}
    </>
  );
};
