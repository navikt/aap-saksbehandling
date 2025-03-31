'use client';

import { Button } from '@navikt/ds-react';
import { Oppgave } from 'lib/types/oppgaveTypes';
import { useTransition } from 'react';

interface Props {
  onClick: (oppgave: Oppgave) => void;
  oppgave: Oppgave;
  label: string;
}
export const ButtonOppgave = ({ oppgave, onClick, label }: Props) => {
  const [isPending, startTransition] = useTransition();

  async function handleClick(oppgave: Oppgave) {
    startTransition(async () => {
      await onClick(oppgave);
    });
  }

  return (
    <Button type={'button'} size={'small'} onClick={() => handleClick(oppgave)} loading={isPending}>
      {label}
    </Button>
  );
};
