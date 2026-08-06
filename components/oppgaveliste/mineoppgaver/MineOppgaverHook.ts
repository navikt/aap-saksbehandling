import {
  NoNavAapOppgaveMarkeringMarkeringDtoMarkeringType,
  NoNavAapOppgaveReturInformasjonDtoStatus,
} from '@navikt/aap-oppgave-typescript-types';
import { useFeatureFlag } from 'context/UnleashContext';
import { useDebouncedValue } from 'hooks/useDebouncedValueHook';
import { OppgaveMedKontekst } from 'lib/types/oppgaveTypes';
import { formaterDatoForFrontend } from 'lib/utils/date';
import { erDatoFoerDato } from 'lib/validation/dateValidation';
import { useMemo } from 'react';

import { FormFieldsFilter } from 'components/oppgaveliste/mineoppgaver/MineOppgaver';

const oppgaveStatus = {
  VENT: (oppgave: OppgaveMedKontekst) => !!oppgave.oppgavelisteTags?.påVentInfo?.påVentTil,
  RETUR_FRA_KVALITETSSIKRER: (oppgave: OppgaveMedKontekst) =>
    oppgave.oppgavelisteTags.returInformasjon?.status ===
    NoNavAapOppgaveReturInformasjonDtoStatus.RETUR_FRA_KVALITETSSIKRER,
  RETUR_FRA_BESLUTTER: (oppgave: OppgaveMedKontekst) =>
    oppgave.oppgavelisteTags.returInformasjon?.status === NoNavAapOppgaveReturInformasjonDtoStatus.RETUR_FRA_BESLUTTER,
  RETUR_FRA_VEILEDER: (oppgave: OppgaveMedKontekst) =>
    oppgave.oppgavelisteTags.returInformasjon?.status === NoNavAapOppgaveReturInformasjonDtoStatus.RETUR_FRA_VEILEDER,
  RETUR_FRA_SAKSBEHANDLER: (oppgave: OppgaveMedKontekst) =>
    oppgave.oppgavelisteTags.returInformasjon?.status ===
    NoNavAapOppgaveReturInformasjonDtoStatus.RETUR_FRA_SAKSBEHANDLER,
  ER_HASTESAK: (oppgave: OppgaveMedKontekst) =>
    oppgave.oppgavelisteTags.markeringer?.some(
      (it) => it.markeringType === NoNavAapOppgaveMarkeringMarkeringDtoMarkeringType.HASTER
    ) ?? false,
  VENTEFRIST_UTLØPT: (oppgave: OppgaveMedKontekst) => oppgave.oppgavelisteTags.forrigePåVentInfo != null,
} as const;

interface Props {
  oppgaver: OppgaveMedKontekst[];
  filter: FormFieldsFilter;
}

export const useFiltrerteOppgaver = ({ oppgaver, filter }: Props) => {
  const tilbakekrevingBelopFilter = useFeatureFlag('TilbakekrevingBelopFilter');
  const debouncedFilters = useDebouncedValue(filter, 300);
  return useMemo(() => {
    const filtrerOppgave = (oppgave: OppgaveMedKontekst) => {
      const dato = formaterDatoForFrontend(oppgave.behandlingOpprettet);

      const {
        behandlingOpprettetFom,
        behandlingOpprettetTom,
        avklaringsbehov,
        årsaker,
        behandlingstyper,
        statuser,
        tilbakekrevingBeløpFom,
        tilbakekrevingBeløpTom,
      } = debouncedFilters;

      if (behandlingOpprettetFom && !erDatoFoerDato(formaterDatoForFrontend(behandlingOpprettetFom), dato)) {
        return false;
      }

      if (behandlingOpprettetTom && !erDatoFoerDato(dato, formaterDatoForFrontend(behandlingOpprettetTom))) {
        return false;
      }

      if (avklaringsbehov?.length && !avklaringsbehov.includes(oppgave.avklaringsbehovKode)) {
        return false;
      }

      if (årsaker?.length && !oppgave.vurderingsbehov.some((årsak) => årsaker.includes(årsak))) {
        return false;
      }

      if (behandlingstyper?.length && !behandlingstyper.includes(oppgave.behandlingskontekst.behandlingstype)) {
        return false;
      }

      if (tilbakekrevingBelopFilter) {
        if (tilbakekrevingBeløpFom) {
          const beløp = oppgave.tilbakekrevingsVars?.tilbakekrevings_beløp;
          if (beløp == null || beløp < Number(tilbakekrevingBeløpFom)) {
            return false;
          }
        }

        if (tilbakekrevingBeløpTom) {
          const beløp = oppgave.tilbakekrevingsVars?.tilbakekrevings_beløp;
          if (beløp == null || beløp > Number(tilbakekrevingBeløpTom)) {
            return false;
          }
        }
      }

      return !(
        statuser?.length && !statuser.some((status) => oppgaveStatus[status as keyof typeof oppgaveStatus]?.(oppgave))
      );
    };

    return oppgaver.filter(filtrerOppgave);
  }, [oppgaver, debouncedFilters, tilbakekrevingBelopFilter]);
};
