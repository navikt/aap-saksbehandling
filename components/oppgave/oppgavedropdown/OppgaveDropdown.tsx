'use client';

import { Button, Dropdown, HStack, Loader } from '@navikt/ds-react';
import { ChevronDownIcon } from '@navikt/aksel-icons';
import { revalidateMineOppgaver } from 'lib/actions/actions';
import { Oppgave } from 'lib/types/types';
import { avreserverOppgaveClient } from 'lib/oppgaveClientApi';
import { useTransition } from 'react';

interface Props {
  oppgave: Oppgave;
}
export const OppgaveDropdown = ({ oppgave }: Props) => {
  const [isPendingFrigi, startTransitionFrigi] = useTransition();

  async function frigiOppgave(oppgave: Oppgave) {
    startTransitionFrigi(async () => {
      await avreserverOppgaveClient(oppgave);
      revalidateMineOppgaver();
    });
  }
  if (isPendingFrigi)
    return (
      <HStack justify={'center'}>
        <Loader />
      </HStack>
    );
  return (
    <Dropdown>
      <Button as={Dropdown.Toggle} size="small" variant="primary">
        <ChevronDownIcon title="Meny" />
      </Button>
      <Dropdown.Menu>
        <Dropdown.Menu.GroupedList>
          <Dropdown.Menu.GroupedList.Item onClick={() => frigiOppgave(oppgave)}>
            Frigi oppgave
          </Dropdown.Menu.GroupedList.Item>
        </Dropdown.Menu.GroupedList>
      </Dropdown.Menu>
    </Dropdown>
  );
};
