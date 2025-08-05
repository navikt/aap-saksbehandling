import { statistikkQueryparams } from 'lib/utils/request';
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
import { apiFetch } from 'lib/services/apiFetch';

const statistikkApiBaseURL = process.env.STATISTIKK_API_BASE_URL;
const statistikkApiScope = process.env.STATISTIKK_API_SCOPE ?? '';

export const hentAntallÅpneBehandlingerPerBehandlingstype = async (
  behandlingstyper: Array<BehandlingsTyperOption> = [],
  enheter: Array<string>
) => {
  const url = `${statistikkApiBaseURL}/åpne-behandlinger-per-behandlingstype?${statistikkQueryparams({ behandlingstyper, enheter })}`;
  return await apiFetch<Array<AntallÅpneOgGjennomsnitt>>(url, statistikkApiScope, 'GET');
};

export const hentAntallÅpneBehandlingerPerBehandlingstypeMedPeriode = async (
  behandlingstyper: Array<BehandlingsTyperOption> = [],
  enheter: Array<string>,
  oppslagsPeriode?: string
) => {
  const url = `${statistikkApiBaseURL}/åpne-behandlinger-per-behandlingstype-med-periode?${statistikkQueryparams({ behandlingstyper, enheter, oppslagsPeriode })}`;
  return await apiFetch<Array<AntallÅpneOgGjennomsnitt>>(url, statistikkApiScope, 'GET');
};

export const hentBehandlingerUtvikling = async (
  behandlingstyper: Array<BehandlingsTyperOption> = [],
  enheter: Array<string>,
  antallDager?: number
) => {
  const antallDagerEllerNull = antallDager || 0;
  const url = `${statistikkApiBaseURL}/behandlinger/utvikling?${statistikkQueryparams({ behandlingstyper, antallDager: antallDagerEllerNull, enheter })}`;
  return await apiFetch<Array<BehandlingEndringerPerDag>>(url, statistikkApiScope, 'GET');
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
  return await apiFetch<Array<FordelingÅpneBehandlinger>>(url, statistikkApiScope, 'GET');
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
  return await apiFetch<Array<FordelingÅpneBehandlinger>>(url, statistikkApiScope, 'GET');
}

export async function hentVenteÅrsakerForBehandlingerPåVent(
  behandlingstyper: Array<BehandlingsTyperOption> = [],
  enheter: Array<string>
) {
  const url = `${statistikkApiBaseURL}/behandlinger/${encodeURIComponent('på-vent')}?${statistikkQueryparams({ behandlingstyper, enheter })}`;
  return await apiFetch<Array<VenteÅrsakOgGjennomsnitt>>(url, statistikkApiScope, 'GET');
}

export async function hentVenteÅrsakerForBehandlingerPåVentMedPeriode(
  behandlingstyper: Array<BehandlingsTyperOption> = [],
  enheter: Array<string>,
  oppslagsPeriode?: string
) {
  const url = `${statistikkApiBaseURL}/behandlinger/${encodeURIComponent('på-vent-med-periode')}?${statistikkQueryparams({ behandlingstyper, enheter, oppslagsPeriode })}`;
  return await apiFetch<Array<VenteÅrsakOgGjennomsnitt>>(url, statistikkApiScope, 'GET');
}

export async function hentAntallBehandlingerPerSteggruppe(
  behandlingstyper: Array<BehandlingsTyperOption> = [],
  enheter: Array<string>,
  oppgaveTyper: Array<string> = []
) {
  const url = `${statistikkApiBaseURL}/behandling-per-steggruppe?${statistikkQueryparams({ behandlingstyper, enheter, oppgaveTyper })}`;
  return await apiFetch<Array<BehandlingPerSteggruppe>>(url, statistikkApiScope, 'GET');
}

export const hentÅrsakTilBehandling = async (
  behandlingstyper: Array<BehandlingsTyperOption> = [],
  enheter: Array<string>
) => {
  const url = `${statistikkApiBaseURL}/behandlinger/årsak-til-behandling?${statistikkQueryparams({ behandlingstyper, enheter })}`;
  return await apiFetch<BehandlingÅrsakAntallGjennomsnitt[]>(url, statistikkApiScope, 'GET');
};

export const hentOppgaverInnUt = async (
  behandlingstyper: Array<BehandlingsTyperOption> = [],
  enheter: Array<string>,
  oppslagsPeriode?: string
) => {
  const url = `${statistikkApiBaseURL}/oppgaver-per-steggruppe-med-periode?${statistikkQueryparams({ behandlingstyper, enheter, oppslagsPeriode })}`;
  return await apiFetch<BehandlingÅrsakAntallGjennomsnitt[]>(url, statistikkApiScope, 'GET');
};
