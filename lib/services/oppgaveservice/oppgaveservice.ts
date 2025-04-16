import { isLocal } from 'lib/utils/environment';

import {
  NoNavAapOppgaveOppgaveDtoBehandlingstype,
  NoNavAapOppgaveOppgaveDtoStatus,
} from '@navikt/aap-oppgave-typescript-types';
import { fetchProxy } from 'lib/services/fetchProxy';
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
import { queryParamsArray } from '../../utils/request';
import { apiFetch } from 'lib/services/apiFetch';

const oppgaveApiBaseURL = process.env.OPPGAVE_API_BASE_URL;
const oppgaveApiScope = process.env.OPPGAVE_API_SCOPE ?? '';

const oppgaveMock: Oppgave[] = [
  {
    avklaringsbehovKode: '9003',
    behandlingOpprettet: '2025-01-06T12:36:44.716229',
    behandlingRef: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    behandlingstype: NoNavAapOppgaveOppgaveDtoBehandlingstype.KLAGE,
    id: 0,
    journalpostId: 123,
    status: NoNavAapOppgaveOppgaveDtoStatus.OPPRETTET,
    versjon: 0,
    opprettetTidspunkt: '09-12-2024',
    enhet: 'NNDD',
    opprettetAv: 'ola',
    reservertAv: 'egil',
  },
  {
    avklaringsbehovKode: '9003',
    behandlingOpprettet: '2025-01-06T12:36:44.716229',
    behandlingRef: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    behandlingstype: NoNavAapOppgaveOppgaveDtoBehandlingstype.REVURDERING,
    id: 0,
    journalpostId: 123,
    status: NoNavAapOppgaveOppgaveDtoStatus.OPPRETTET,
    versjon: 0,
    opprettetTidspunkt: '09-12-2024',
    enhet: 'NNDD',
    opprettetAv: 'ola',
    reservertAv: 'trine',
  },
  {
    avklaringsbehovKode: '9003',
    behandlingOpprettet: '2025-01-06T12:36:44.716229',
    behandlingRef: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    behandlingstype: NoNavAapOppgaveOppgaveDtoBehandlingstype.F_RSTEGANGSBEHANDLING,
    id: 0,
    journalpostId: 123,
    status: NoNavAapOppgaveOppgaveDtoStatus.OPPRETTET,
    versjon: 0,
    opprettetTidspunkt: '09-12-2024',
    enhet: 'NNDD',
    opprettetAv: 'ola',
    reservertAv: 'tom',
  },
  {
    avklaringsbehovKode: '5001',
    behandlingOpprettet: '2025-01-06T12:36:44.716229',
    behandlingRef: '34fdsff-5717-4562-b3fc-2c963f66afa6',
    behandlingstype: NoNavAapOppgaveOppgaveDtoBehandlingstype.F_RSTEGANGSBEHANDLING,
    id: 1,
    journalpostId: 234,
    status: NoNavAapOppgaveOppgaveDtoStatus.OPPRETTET,
    versjon: 0,
    opprettetTidspunkt: '09-01-2025',
    enhet: 'HGDI',
    opprettetAv: 'kari',
    reservertAv: 'jon',
  },
];

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
  if (isLocal()) {
    return oppgaveMock;
  }
  const url = `${oppgaveApiBaseURL}/oppgavesok`;
  return await fetchProxy<Array<Oppgave>>(url, oppgaveApiScope, 'POST', {
    avklaringsbehovKoder,
    behandlingstyper,
    enheter,
  });
}
export async function avreserverOppgave(avklaringsbehovReferanse: AvklaringsbehovReferanse): Promise<unknown> {
  const url = `${oppgaveApiBaseURL}/avreserver-oppgave`;
  return await fetchProxy<unknown>(url, oppgaveApiScope, 'POST', avklaringsbehovReferanse);
}
export async function velgNesteOppgave({ filterId, enheter }: NesteOppgaveRequestBody): Promise<NesteOppgaveResponse> {
  if (isLocal()) {
    return {
      oppgaveId: 34534534,
      oppgaveVersjon: 3,
      avklaringsbehovReferanse: {
        avklaringsbehovKode: 'dfgdfgdfg',
        journalpostId: 1245,
        referanse: 'gasdgsdg',
        saksnummer: 'sdfa',
      },
    };
  }
  const url = `${oppgaveApiBaseURL}/neste-oppgave`;
  return await fetchProxy<NesteOppgaveResponse>(url, oppgaveApiScope, 'POST', { filterId, enheter });
}
export async function plukkOppgave(oppgaveId: number, versjon: number): Promise<Oppgave> {
  const url = `${oppgaveApiBaseURL}/plukk-oppgave`;
  return await fetchProxy<Oppgave>(url, oppgaveApiScope, 'POST', { oppgaveId, versjon });
}
export async function oppgaveTekstSøk(søketekst: string) {
  if (isLocal()) {
    const res: Oppgave[] = [
      {
        reservertAv: 'DF39ZH',
        avklaringsbehovKode: '9003',
        behandlingOpprettet: '2025-01-06T12:36:44.716229',
        behandlingRef: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        behandlingstype: NoNavAapOppgaveOppgaveDtoBehandlingstype.KLAGE,
        id: 0,
        journalpostId: 123,
        status: NoNavAapOppgaveOppgaveDtoStatus.OPPRETTET,
        versjon: 0,
        enhet: 'Nav Løten',
        opprettetAv: '',
        opprettetTidspunkt: '',
        personNavn: 'Søker søkersen',
        påVentÅrsak: 'VENTER_PÅ_OPPLYSNINGER',
      },
      {
        reservertAv: 'DF39ZH',
        avklaringsbehovKode: '5001',
        behandlingOpprettet: '2025-01-06T12:36:44.716229',
        behandlingRef: '34fdsff-5717-4562-b3fc-2c963f66afa6',
        behandlingstype: NoNavAapOppgaveOppgaveDtoBehandlingstype.REVURDERING,
        id: 1,
        journalpostId: 234,
        status: NoNavAapOppgaveOppgaveDtoStatus.OPPRETTET,
        versjon: 0,
        enhet: 'Nav Enebakk',
        opprettetAv: '',
        opprettetTidspunkt: '',
        personNavn: 'Søker søkersen',
        påVentÅrsak: 'VENTER_PÅ_OPPLYSNINGER',
      },
    ];
    return res;
  }
  const url = `${oppgaveApiBaseURL}/sok`;
  return await fetchProxy<Array<Oppgave>>(url, oppgaveApiScope, 'POST', { søketekst });
}
