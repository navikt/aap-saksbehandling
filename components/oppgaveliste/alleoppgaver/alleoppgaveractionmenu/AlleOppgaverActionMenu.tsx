import { useRouter } from 'next/navigation';
import { ActionMenu, Button } from '@navikt/ds-react';
import { MenuElipsisVerticalIcon } from '@navikt/aksel-icons';
import { byggKelvinURL } from 'lib/utils/request';
import { Oppgave } from 'lib/types/oppgaveTypes';
import { avreserverOppgaveClient, synkroniserOppgaveMedEnhetClient } from 'lib/oppgaveClientApi';
import { isSuccess } from 'lib/utils/api';
import { Dispatch, SetStateAction, useState, useTransition } from 'react';

interface Props {
  oppgave: Oppgave;
  revalidateFunction: () => Promise<unknown>;
  setVisSynkroniserEnhetModal: Dispatch<SetStateAction<boolean>>;
  setOppgaverSomSkalTildeles: Dispatch<SetStateAction<number[]>>;
  setVisTildelOppgaveModal: Dispatch<SetStateAction<boolean>>;
}

export const AlleOppgaverActionMenu = ({
  setVisSynkroniserEnhetModal,
  oppgave,
  revalidateFunction,
  setOppgaverSomSkalTildeles,
  setVisTildelOppgaveModal,
}: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [isPendingFrigi, startTransitionFrigi] = useTransition();
  const erReservert = oppgave.reservertAv != null;

  async function frigiOppgave(oppgave: Oppgave) {
    startTransitionFrigi(async () => {
      if (oppgave.id) {
        const res = await avreserverOppgaveClient([oppgave.id]);

        if (isSuccess(res)) {
          await revalidateFunction();
        }
      }
    });
  }

  async function synkroniserEnhetPåOppgave(oppgave: Oppgave) {
    startTransitionFrigi(async () => {
      if (oppgave.id) {
        const res = await synkroniserOppgaveMedEnhetClient(oppgave.id);
        if (isSuccess(res)) {
          await revalidateFunction();
          setVisSynkroniserEnhetModal(true);
        }
      }
    });
  }

  return (
    <>
      <ActionMenu>
        <ActionMenu.Trigger>
          <Button
            variant={'tertiary-neutral'}
            icon={<MenuElipsisVerticalIcon title={'Oppgavemeny'} />}
            size={'small'}
            loading={isLoading || isPendingFrigi}
          />
        </ActionMenu.Trigger>
        <ActionMenu.Content>
          <ActionMenu.Item
            onSelect={() => {
              setIsLoading(true);
              router.push(byggKelvinURL(oppgave));
            }}
          >
            Åpne oppgave
          </ActionMenu.Item>
          <ActionMenu.Item
            onSelect={async () => {
              await synkroniserEnhetPåOppgave(oppgave);
            }}
          >
            Sjekk kontortilhørighet
          </ActionMenu.Item>
          {erReservert && (
            <ActionMenu.Item
              onSelect={async () => {
                await frigiOppgave(oppgave);
              }}
            >
              Frigi oppgave
            </ActionMenu.Item>
          )}
          <ActionMenu.Item
            onSelect={() => {
              oppgave.id && setOppgaverSomSkalTildeles([oppgave.id]);
              setVisTildelOppgaveModal(true);
            }}
          >
            Tildel oppgave
          </ActionMenu.Item>
        </ActionMenu.Content>
      </ActionMenu>
    </>
  );
};
