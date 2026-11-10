import { useSak } from 'hooks/SakHook';
import { useGosysOppgaver } from 'hooks/oppgave/GosysOppgaverHook';
import { useFeatureFlag } from 'context/UnleashContext';

export function useGosysOppgaverForPerson() {
  const { sak } = useSak();
  const visGosysOppgaverForPerson = useFeatureFlag('VisGosysOppgaverForPerson');

  return useGosysOppgaver({ aktoerId: visGosysOppgaverForPerson ? sak.ident : undefined });
}
