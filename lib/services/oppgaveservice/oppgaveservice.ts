import {
  AvklaringsbehovReferanse,
  Enhet,
  Kø,
  NesteOppgaveRequestBody,
  NesteOppgaveResponse,
  Oppgave,
  OppgaveAvklaringsbehovKode,
  OppgaveBehandlingstype,
  OppgavelisteRequest,
  OppgavelisteResponse,
} from 'lib/types/oppgaveTypes';
import { queryParamsArray } from 'lib/utils/request';
import { apiFetch } from 'lib/services/apiFetch';

const oppgaveApiBaseURL = process.env.OPPGAVE_API_BASE_URL;
const oppgaveApiScope = process.env.OPPGAVE_API_SCOPE ?? '';

export const hentKøer = async (enheter: string[]) => {
  const url = `${oppgaveApiBaseURL}/filter?${queryParamsArray('enheter', enheter)}`;
  return await apiFetch<Kø[]>(url, oppgaveApiScope, 'GET');
};

export const hentOppgaverForFilter = async (filterId: number, enheter: string[], veileder: boolean) => {
  const payload: OppgavelisteRequest = {
    filterId,
    enheter,
    maxAntall: 10,
    veileder,
  };
  const url = `${oppgaveApiBaseURL}/oppgaveliste`;
  return await apiFetch<OppgavelisteResponse>(url, oppgaveApiScope, 'POST', payload);
};

//TODO: ubrukt? ser ingen steder som kaller route
export async function hentAntallOppgaver(behandlingstype?: string) {
  const url = `${oppgaveApiBaseURL}/produksjonsstyring/antall-oppgaver`;
  return await apiFetch<Record<string, number>>(url, oppgaveApiScope, 'POST', {
    behandlingstype: behandlingstype || null,
  });
}

export const hentMineOppgaver = async () => {
  const url = `${oppgaveApiBaseURL}/mine-oppgaver`;
  return await apiFetch<OppgavelisteResponse>(url, oppgaveApiScope, 'GET', undefined, ['oppgaveservice/mine-oppgaver']);
};

export async function hentEnheter() {
  const url = `${oppgaveApiBaseURL}/enheter`;
  return await apiFetch<Array<Enhet>>(url, oppgaveApiScope, 'GET');
}
export async function oppgaveSøk(
  avklaringsbehovKoder: OppgaveAvklaringsbehovKode[],
  behandlingstyper: OppgaveBehandlingstype[],
  enheter: string[]
) {
  const url = `${oppgaveApiBaseURL}/oppgavesok`;
  return await apiFetch<Array<Oppgave>>(url, oppgaveApiScope, 'POST', {
    avklaringsbehovKoder,
    behandlingstyper,
    enheter,
  });
}
export async function avreserverOppgave(avklaringsbehovReferanse: AvklaringsbehovReferanse) {
  const url = `${oppgaveApiBaseURL}/avreserver-oppgave`;
  return await apiFetch<unknown>(url, oppgaveApiScope, 'POST', avklaringsbehovReferanse);
}
export async function velgNesteOppgave({ filterId, enheter }: NesteOppgaveRequestBody) {
  const url = `${oppgaveApiBaseURL}/neste-oppgave`;
  return await apiFetch<NesteOppgaveResponse>(url, oppgaveApiScope, 'POST', { filterId, enheter });
}
export async function plukkOppgave(oppgaveId: number, versjon: number) {
  const url = `${oppgaveApiBaseURL}/plukk-oppgave`;
  return await apiFetch<Oppgave>(url, oppgaveApiScope, 'POST', { oppgaveId, versjon });
}
export async function oppgaveTekstSøk(søketekst: string) {
  const url = `${oppgaveApiBaseURL}/sok`;
  return await apiFetch<Array<Oppgave>>(url, oppgaveApiScope, 'POST', { søketekst });
}
