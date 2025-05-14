import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ActionMenu, Button, Loader } from '@navikt/ds-react';
import { MenuElipsisVerticalIcon } from '@navikt/aksel-icons';
import { byggKelvinURL } from 'lib/utils/request';
import { Oppgave } from 'lib/types/oppgaveTypes';

interface Props {
  oppgave: Oppgave;
}

export const AlleOppgaverActionMenu = ({ oppgave }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  return (
    <>
      {!isLoading ? (
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
                setIsLoading(true);
                router.push(byggKelvinURL(oppgave));
              }}
            >
              Åpne oppgave
            </ActionMenu.Item>
          </ActionMenu.Content>
        </ActionMenu>
      ) : (
        <Loader />
      )}
    </>
  );
};
