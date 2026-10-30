import { formaterDatoForFrontend } from 'lib/utils/date';
import {
  mapBehovskodeTilBehovstype,
  mapStatusTilTekst,
  mapTilOppgaveBehandlingstypeTekst,
} from 'lib/utils/oversettelser';
import { formaterVurderingsbehov } from 'lib/utils/vurderingsbehov';

import { FormFieldsFilter } from 'components/oppgaveliste/mineoppgaver/MineOppgaver';

export function aktiveFiltreringer(form: FormFieldsFilter) {
  const aktiveFilter: (
    | { key: 'behandlingOpprettetFom' | 'behandlingOpprettetTom'; value: Date; label: string }
    | {
        key: Exclude<keyof FormFieldsFilter, 'behandlingOpprettetFom' | 'behandlingOpprettetTom'>;
        value: string;
        label: string;
      }
  )[] = [];
  Object.entries(form).forEach(([key, value]) => {
    if (key === 'behandlingstyper' && Array.isArray(value)) {
      aktiveFilter.push(
        ...value.map((value) => {
          return {
            key: 'behandlingstyper' as const,
            label: mapTilOppgaveBehandlingstypeTekst(value),
            value: value,
          };
        })
      );
    }

    if (key === 'årsaker' && Array.isArray(value)) {
      aktiveFilter.push(
        ...value.map((value) => {
          return { key: 'årsaker' as const, value: value, label: formaterVurderingsbehov(value) };
        })
      );
    }

    if (key === 'avklaringsbehov' && Array.isArray(form.avklaringsbehov)) {
      aktiveFilter.push(
        ...form.avklaringsbehov.map((value) => {
          return { key: 'avklaringsbehov' as const, value: value, label: mapBehovskodeTilBehovstype(value) };
        })
      );
    }

    if (key === 'saksbehandlere' && Array.isArray(form.saksbehandlere)) {
      aktiveFilter.push(
        ...form.saksbehandlere.map((value) => {
          return { key: 'saksbehandlere' as const, value: value.value, label: `Reservert av: ${value.label}` };
        })
      );
    }

    if (key === 'statuser' && Array.isArray(value)) {
      aktiveFilter.push(
        ...value.map((value) => {
          return { key: 'statuser' as const, value: value, label: mapStatusTilTekst(value) };
        })
      );
    }

    if (key === 'behandlingOpprettetFom' && form.behandlingOpprettetFom) {
      aktiveFilter.push({
        key: key,
        value: form.behandlingOpprettetFom,
        label: `Behandling opprettet fra: ${formaterDatoForFrontend(form.behandlingOpprettetFom)}`,
      });
    }

    if (key === 'behandlingOpprettetTom' && form.behandlingOpprettetTom) {
      aktiveFilter.push({
        key: key,
        value: form.behandlingOpprettetTom,
        label: `Behandling opprettet til: ${formaterDatoForFrontend(form.behandlingOpprettetTom)}`,
      });
    }

    if (key === 'tilbakekrevingBeløpFom' && form.tilbakekrevingBeløpFom) {
      aktiveFilter.push({
        key: key,
        value: form.tilbakekrevingBeløpFom,
        label: `Beløp fra: ${form.tilbakekrevingBeløpFom}`,
      });
    }

    if (key === 'tilbakekrevingBeløpTom' && form.tilbakekrevingBeløpTom) {
      aktiveFilter.push({
        key: key,
        value: form.tilbakekrevingBeløpTom,
        label: `Beløp til: ${form.tilbakekrevingBeløpTom}`,
      });
    }
  });

  return aktiveFilter;
}
