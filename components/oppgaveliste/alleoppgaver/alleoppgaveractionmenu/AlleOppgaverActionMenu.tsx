import { MenuElipsisVerticalIcon } from '@navikt/aksel-icons';
import { ActionMenu, Button } from '@navikt/ds-react';
import { useTildelOppgaver } from 'context/oppgave/TildelOppgaverContext';
import { avreserverOppgaveClient, synkroniserOppgaveMedEnhetClient } from 'lib/oppgaveClientApi';
import { OppgaveMedKontekst } from 'lib/types/oppgaveTypes';
import { isSuccess } from 'lib/utils/api';
import { byggKelvinURL } from 'lib/utils/request';
import { useRouter } from 'next/navigation';
import { Dispatch, SetStateAction, useState, useTransition } from 'react';

interface Props {
  oppgave: OppgaveMedKontekst;
  revalidateFunction: () => Promise<unknown>;
  setVisSynkroniserEnhetModal: Dispatch<SetStateAction<boolean>>;
}

export const AlleOppgaverActionMenu = ({ setVisSynkroniserEnhetModal, oppgave, revalidateFunction }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [isPendingFrigi, startTransitionFrigi] = useTransition();
  const erReservert = oppgave.reservertAv != null;
  const { setOppgaveIder, visModal } = useTildelOppgaver();

  async function frigiOppgave(oppgaveId: number) {
    startTransitionFrigi(async () => {
      const res = await avreserverOppgaveClient([oppgaveId]);

      if (isSuccess(res)) {
        await revalidateFunction();
      }
    });
  }

  async function synkroniserEnhetPåOppgave(oppgaveId: number) {
    startTransitionFrigi(async () => {
      const res = await synkroniserOppgaveMedEnhetClient(oppgaveId);
      if (isSuccess(res)) {
        await revalidateFunction();
        setVisSynkroniserEnhetModal(true);
      }
    });
  }

  return (
    <>
      <ActionMenu>
        <ActionMenu.Trigger>
          <Button
            data-color="neutral"
            variant={'tertiary'}
            icon={<MenuElipsisVerticalIcon title={'Oppgavemeny'} />}
            size={'small'}
            loading={isLoading || isPendingFrigi}
          />
        </ActionMenu.Trigger>
        <ActionMenu.Content>
          <ActionMenu.Item
            onSelect={() => {
              setIsLoading(true);
              router.push(byggKelvinURL(oppgave.behandlingskontekst));
            }}
          >
            Åpne oppgave
          </ActionMenu.Item>
          <ActionMenu.Item
            onSelect={async () => {
              await synkroniserEnhetPåOppgave(oppgave.oppgaveMetadata.id);
            }}
          >
            Sjekk kontortilhørighet
          </ActionMenu.Item>
          {erReservert && (
            <ActionMenu.Item
              onSelect={async () => {
                await frigiOppgave(oppgave.oppgaveMetadata.id);
              }}
            >
              Frigi oppgave
            </ActionMenu.Item>
          )}
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
    </>
  );
};
