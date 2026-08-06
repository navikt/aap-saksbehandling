import { formaterDatoForFrontend } from 'lib/utils/date';
import {
  mapBehovskodeTilBehovstype,
  mapStatusTilTekst,
  mapTilOppgaveBehandlingstypeTekst,
} from 'lib/utils/oversettelser';
import { formaterVurderingsbehov } from 'lib/utils/vurderingsbehov';

import { FormFieldsFilter } from 'components/oppgaveliste/mineoppgaver/MineOppgaver';

export function aktiveFiltreringer(form: FormFieldsFilter) {
  const aktiveFilter: { key: keyof FormFieldsFilter; value: string; label: string }[] = [];
  Object.entries(form).forEach(([keyRaw, value]) => {
    const key = keyRaw as keyof FormFieldsFilter;
    if (key === 'behandlingstyper' && Array.isArray(value)) {
      aktiveFilter.push(
        ...value.map((value) => {
          return {
            key: key,
            label: mapTilOppgaveBehandlingstypeTekst(value),
            value: value,
          };
        })
      );
    }

    if (key === 'årsaker' && Array.isArray(value)) {
      aktiveFilter.push(
        ...value.map((value) => {
          return { key: key, value: value, label: formaterVurderingsbehov(value) };
        })
      );
    }

    if (key === 'avklaringsbehov' && Array.isArray(value)) {
      aktiveFilter.push(
        ...value.map((value) => {
          return { key: key, value: value, label: mapBehovskodeTilBehovstype(value) };
        })
      );
    }

    if (key === 'saksbehandlere' && Array.isArray(value)) {
      aktiveFilter.push(
        ...value.map((value) => {
          return { key: key, value: value.value, label: `Reservert av: ${value.label}` };
        })
      );
    }

    if (key === 'statuser' && Array.isArray(value)) {
      aktiveFilter.push(
        ...value.map((value) => {
          return { key: key, value: value, label: mapStatusTilTekst(value) };
        })
      );
    }

    if (key === 'behandlingOpprettetFom' && value) {
      aktiveFilter.push({
        key: key,
        value: value,
        label: `Behandling opprettet fra: ${formaterDatoForFrontend(value)}`,
      });
    }

    if (key === 'behandlingOpprettetTom' && value) {
      aktiveFilter.push({
        key: key,
        value: value,
        label: `Behandling opprettet til: ${formaterDatoForFrontend(value)}`,
      });
    }

    if (key === 'tilbakekrevingBeløpFom' && value) {
      aktiveFilter.push({
        key: key,
        value: value,
        label: `Beløp fra: ${value}`,
      });
    }

    if (key === 'tilbakekrevingBeløpTom' && value) {
      aktiveFilter.push({
        key: key,
        value: value,
        label: `Beløp til: ${value}`,
      });
    }
  });

  return aktiveFilter;
}
