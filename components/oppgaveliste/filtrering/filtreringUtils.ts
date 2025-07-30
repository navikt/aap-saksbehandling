import { FormFieldsFilter } from 'components/oppgaveliste/mineoppgaver/MineOppgaver2';
import {
  mapBehovskodeTilBehovstype,
  mapStatusTilTekst,
  mapTilOppgaveBehandlingstypeTekst,
} from 'lib/utils/oversettelser';
import { formaterÅrsak } from 'lib/utils/årsaker';
import { formaterDatoForFrontend } from 'lib/utils/date';

export function aktiveFiltreringer(form: FormFieldsFilter) {
  const aktiveFilter: { key: keyof FormFieldsFilter; value: string; label: string }[] = [];
  Object.entries(form).forEach(([key, value]) => {
    if (key === 'behandlingstyper' && Array.isArray(value)) {
      aktiveFilter.push(
        ...value.map((value) => {
          return {
            key: key as keyof FormFieldsFilter,
            label: mapTilOppgaveBehandlingstypeTekst(value),
            value: value,
          };
        })
      );
    }

    if (key === 'årsaker' && Array.isArray(value)) {
      aktiveFilter.push(
        ...value.map((value) => {
          return { key: key as keyof FormFieldsFilter, value: value, label: formaterÅrsak(value) };
        })
      );
    }

    if (key === 'avklaringsbehov' && Array.isArray(value)) {
      aktiveFilter.push(
        ...value.map((value) => {
          return { key: key as keyof FormFieldsFilter, value: value, label: mapBehovskodeTilBehovstype(value) };
        })
      );
    }

    if (key === 'statuser' && Array.isArray(value)) {
      aktiveFilter.push(
        ...value.map((value) => {
          return { key: key as keyof FormFieldsFilter, value: value, label: mapStatusTilTekst(value) };
        })
      );
    }

    if (key === 'behandlingOpprettetFom' && value) {
      aktiveFilter.push({
        key: key as keyof FormFieldsFilter,
        value: value,
        label: `Behandling opprettet fra: ${formaterDatoForFrontend(value)}`,
      });
    }

    if (key === 'behandlingOpprettetTom' && value) {
      aktiveFilter.push({
        key: key as keyof FormFieldsFilter,
        value: value,
        label: `Behandling opprettet til: ${formaterDatoForFrontend(value)}`,
      });
    }
  });

  return aktiveFilter;
}
