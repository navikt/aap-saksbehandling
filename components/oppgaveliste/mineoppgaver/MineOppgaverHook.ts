import { useMemo } from 'react';
import { erDatoFoerDato } from 'lib/validation/dateValidation';
import { formaterDatoForFrontend } from 'lib/utils/date';
import { Oppgave } from 'lib/types/oppgaveTypes';
import { NoNavAapOppgaveOppgaveDtoReturStatus } from '@navikt/aap-oppgave-typescript-types';
import { FormFieldsFilter } from 'components/oppgaveliste/mineoppgaver/MineOppgaver';
import { useDebouncedValue } from 'hooks/useDebouncedValueHook';

const oppgaveStatus = {
  VENT: (oppgave: Oppgave) => !!oppgave.påVentTil,
  RETUR_FRA_KVALITETSSIKRER: (oppgave: Oppgave) =>
    oppgave.returStatus === NoNavAapOppgaveOppgaveDtoReturStatus.RETUR_FRA_KVALITETSSIKRER,
  RETUR_FRA_BESLUTTER: (oppgave: Oppgave) =>
    oppgave.returStatus === NoNavAapOppgaveOppgaveDtoReturStatus.RETUR_FRA_BESLUTTER,
} as const;

interface Props {
  oppgaver: Oppgave[];
  filter: FormFieldsFilter;
}

export const useFiltrerteOppgaver = ({ oppgaver, filter }: Props) => {
  const debouncedFilters = useDebouncedValue(filter, 300);
  return useMemo(() => {
    const filtrerOppgave = (oppgave: Oppgave) => {
      const dato = formaterDatoForFrontend(oppgave.behandlingOpprettet);

      const { behandlingOpprettetFom, behandlingOpprettetTom, avklaringsbehov, årsaker, behandlingstyper, statuser } =
        debouncedFilters;

      if (behandlingOpprettetFom && !erDatoFoerDato(formaterDatoForFrontend(behandlingOpprettetFom), dato)) {
        return false;
      }

      if (behandlingOpprettetTom && !erDatoFoerDato(dato, formaterDatoForFrontend(behandlingOpprettetTom))) {
        return false;
      }

      if (avklaringsbehov?.length && !avklaringsbehov.includes(oppgave.avklaringsbehovKode)) {
        return false;
      }

      if (årsaker?.length && !oppgave.årsakerTilBehandling.some((årsak) => årsaker.includes(årsak))) {
        return false;
      }

      if (behandlingstyper?.length && !behandlingstyper.includes(oppgave.behandlingstype)) {
        return false;
      }

      return !(
        statuser?.length && !statuser.some((status) => oppgaveStatus[status as keyof typeof oppgaveStatus]?.(oppgave))
      );
    };

    return oppgaver.filter(filtrerOppgave);
  }, [oppgaver, debouncedFilters]);
};
