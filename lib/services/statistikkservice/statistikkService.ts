import { isLocal } from 'lib/utils/environment';
import { statistikkQueryparams } from 'lib/utils/request';
import { fetchProxy } from '../fetchProxy';
import {
  AntallÅpneOgGjennomsnitt,
  BehandlingEndringerPerDag,
  BehandlingPerSteggruppe,
  BehandlingÅrsakAntallGjennomsnitt,
  FordelingÅpneBehandlinger,
  VenteÅrsakOgGjennomsnitt,
} from 'lib/types/statistikkTypes';
import { BehandlingsTyperOption } from 'lib/utils/behandlingstyper';
import { FilterTidsEnhet } from 'lib/types/oppgaveTypes';

const statistikkApiBaseURL = process.env.STATISTIKK_API_BASE_URL;
const statistikkApiScope = process.env.STATISTIKK_API_SCOPE ?? '';

export const hentAntallÅpneBehandlingerPerBehandlingstype = async (
  behandlingstyper: Array<BehandlingsTyperOption> = [],
  enheter: Array<string>
) => {
  const url = `${statistikkApiBaseURL}/åpne-behandlinger-per-behandlingstype?${statistikkQueryparams({ behandlingstyper, enheter })}`;
  return await fetchProxy<Array<AntallÅpneOgGjennomsnitt>>(url, statistikkApiScope, 'GET');
};

export const hentBehandlingerUtvikling = async (
  behandlingstyper: Array<BehandlingsTyperOption> = [],
  enheter: Array<string>,
  antallDager?: number
) => {
  const antallDagerEllerNull = antallDager || 0;
  const url = `${statistikkApiBaseURL}/behandlinger/utvikling?${statistikkQueryparams({ behandlingstyper, antallDager: antallDagerEllerNull, enheter })}`;
  return await fetchProxy<Array<BehandlingEndringerPerDag>>(url, statistikkApiScope, 'GET');
};

export async function hentFordelingÅpneBehandlinger(
  behandlingstyper: Array<BehandlingsTyperOption> = [],
  enheter: Array<string>,
  enhet?: FilterTidsEnhet,
  antallBøtter?: number,
  bøtteStørrelse?: number
) {
  const antallBøtterEllerDefault = antallBøtter || 20;
  const bøtteStørreleEllerDefault = bøtteStørrelse || 1;
  const enhetEllerDefault = enhet || 'UKE';
  const url = `${statistikkApiBaseURL}/behandlinger/fordeling-åpne-behandlinger?${statistikkQueryparams({ behandlingstyper, antallBøtter: antallBøtterEllerDefault, bøtteStørrelse: bøtteStørreleEllerDefault, enhet: enhetEllerDefault, enheter })}`;
  return await fetchProxy<Array<FordelingÅpneBehandlinger>>(url, statistikkApiScope, 'GET');
}

export async function hentFordelingLukkedeBehandlinger(
  behandlingstyper: Array<BehandlingsTyperOption> = [],
  enheter: Array<string>,
  enhet?: FilterTidsEnhet,
  antallBøtter?: number,
  bøtteStørrelse?: number
) {
  const antallBøtterEllerDefault = antallBøtter || 20;
  const bøtteStørreleEllerDefault = bøtteStørrelse || 1;
  const enhetEllerDefault = enhet || 'UKE';
  const url = `${statistikkApiBaseURL}/behandlinger/fordeling-lukkede-behandlinger?${statistikkQueryparams({ behandlingstyper, antallBøtter: antallBøtterEllerDefault, bøtteStørrelse: bøtteStørreleEllerDefault, enhet: enhetEllerDefault, enheter })}`;
  return await fetchProxy<Array<FordelingÅpneBehandlinger>>(url, statistikkApiScope, 'GET');
}

export async function hentVenteÅrsakerForBehandlingerPåVent(
  behandlingstyper: Array<BehandlingsTyperOption> = [],
  enheter: Array<string>
) {
  const url = `${statistikkApiBaseURL}/behandlinger/${encodeURIComponent('på-vent')}?${statistikkQueryparams({ behandlingstyper, enheter })}`;
  return await fetchProxy<Array<VenteÅrsakOgGjennomsnitt>>(url, statistikkApiScope, 'GET');
}

export async function hentAntallBehandlingerPerSteggruppe(
  behandlingstyper: Array<BehandlingsTyperOption> = [],
  enheter: Array<string>
) {
  if (isLocal()) {
    return [
      { steggruppe: 'ALDER', antall: 5 },
      { steggruppe: 'SYKDOM', antall: 5 },
      { steggruppe: 'MEDLEMSKAP', antall: 5 },
      { steggruppe: 'VEDTAK', antall: 5 },
      { steggruppe: 'BREV', antall: 5 },
      { steggruppe: 'STUDENT', antall: 5 },
    ];
  }
  const url = `${statistikkApiBaseURL}/behandling-per-steggruppe?${statistikkQueryparams({ behandlingstyper, enheter })}`;
  return await fetchProxy<Array<BehandlingPerSteggruppe>>(url, statistikkApiScope, 'GET');
}

export const hentÅrsakTilBehandling = async (
  behandlingstyper: Array<BehandlingsTyperOption> = [],
  enheter: Array<string>
) => {
  const url = `${statistikkApiBaseURL}/behandlinger/årsak-til-behandling?${statistikkQueryparams({ behandlingstyper, enheter })}`;
  return await fetchProxy<BehandlingÅrsakAntallGjennomsnitt[]>(url, statistikkApiScope, 'GET');
};
