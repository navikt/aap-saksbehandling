import { useSak } from 'hooks/SakHook';
import { useGosysOppgaver } from 'hooks/oppgave/GosysOppgaverHook';

export function useGosysOppgaverForPerson() {
  const { sak } = useSak();

  return useGosysOppgaver(undefined, undefined, undefined, sak.ident);
}
