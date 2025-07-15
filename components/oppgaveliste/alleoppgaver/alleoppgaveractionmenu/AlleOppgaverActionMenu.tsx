import { useRouter } from 'next/navigation';
import { ActionMenu, Button } from '@navikt/ds-react';
import { MenuElipsisVerticalIcon } from '@navikt/aksel-icons';
import { byggKelvinURL } from 'lib/utils/request';
import { Oppgave } from 'lib/types/oppgaveTypes';
import { avreserverOppgaveClient } from 'lib/oppgaveClientApi';
import { isSuccess } from 'lib/utils/api';
import { useState, useTransition } from 'react';

interface Props {
  oppgave: Oppgave;
  revalidateFunction: () => void;
}

export const AlleOppgaverActionMenu = ({ oppgave, revalidateFunction }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [isPendingFrigi, startTransitionFrigi] = useTransition();
  const erReservert = oppgave.reservertAv != null;

  async function frigiOppgave(oppgave: Oppgave) {
    startTransitionFrigi(async () => {
      if (oppgave.id) {
        const res = await avreserverOppgaveClient([oppgave.id]);

        if (isSuccess(res)) {
          await (revalidateFunction as () => Promise<void>)();
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
          {erReservert && (
            <ActionMenu.Item
              onSelect={async () => {
                await frigiOppgave(oppgave);
              }}
            >
              Frigi oppgave
            </ActionMenu.Item>
          )}
        </ActionMenu.Content>
      </ActionMenu>
    </>
  );
};
