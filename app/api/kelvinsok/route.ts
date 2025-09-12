import { NextResponse } from 'next/server';
import { finnSakerForIdent, hentSak, søkPåSak } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { Behandlingsstatus, SaksInfo, SøkPåSakInfo } from 'lib/types/types';
import { oppgaveTekstSøk } from 'lib/services/oppgaveservice/oppgaveservice';
import { MarkeringType, Oppgave } from 'lib/types/oppgaveTypes';
import { logError } from 'lib/serverutlis/logger';
import { isSuccess } from 'lib/utils/api';
import { mapBehovskodeTilBehovstype } from 'lib/utils/oversettelser';
import { capitalize } from 'lodash';
import { BrukerInformasjon } from 'lib/services/azure/azureUserService';
import { formaterDatoForFrontend } from 'lib/utils/date';
import { isProd } from 'lib/utils/environment';

export interface SøkeResultat {
  oppgaver?: {
    label: string;
    href: string;
    status: string;
    markeringer: MarkeringType[];
  }[];
  harTilgang: boolean;
  harAdressebeskyttelse: boolean;
  saker?: { href: string; label: string }[];
  kontor?: { enhet: string }[];
  person?: { href: string; label: string }[];
  behandlingsStatus?: { status?: Behandlingsstatus }[];
}

interface Props {
  brukerInformasjon?: BrukerInformasjon;
}

/**
 * Enkel formatering for å gjøre søket til saksbehandler "case-insensitive"
 * Burde på sikt bli håndtert i backend, men det fordrer en større opprydding i typer tilknyttet Saksnummer
 **/
const formaterSaksnummer = (saksnummer: string) => {
  return saksnummer.toUpperCase().replace('O', 'o').replace('I', 'i');
};

export async function POST(req: Request, brukerinformasjon: Props) {
  const body: { søketekst: string } = await req.json();
  if (!body.søketekst) {
    return new Response(JSON.stringify({ message: 'søketekst mangler' }), { status: 400 });
  }

  const søketekst = body.søketekst;
  const data = isProd()
    ? await utledSøkeresultatProd(søketekst, brukerinformasjon.brukerInformasjon)
    : await utledSøkeresultatDev(søketekst, brukerinformasjon.brukerInformasjon);

  return NextResponse.json(data, {
    status: 200,
  });
}

async function utledSøkeresultatDev(søketekst: string, brukerinformasjon?: BrukerInformasjon): Promise<SøkeResultat> {
  let sakData: SøkPåSakInfo[] = [];
  let personData: SøkeResultat['person'] = [];

  // Hent sak fra behandlingsflyt
  try {
    const sakRes = await søkPåSak(søketekst);
    if (isSuccess(sakRes)) {
      sakData = sakRes.data;
      sakData.forEach((sak) => {
        personData.push({
          href: `/saksbehandling/sak/${sak.saksnummer}`,
          label: `${sak.navn}`,
        });
      });
    }
  } catch (err) {
    logError('/api/kelvinsøk saker', err);
  }

  // Oppgaver
  let oppgaveData: SøkeResultat['oppgaver'] = [];
  let kontorData: SøkeResultat['kontor'] = [];
  let behandlingsStatusData: SøkeResultat['behandlingsStatus'] = [];
  let harAdressebeskyttelse: boolean = true;
  try {
    const oppgavesøkRes = await oppgaveTekstSøk(søketekst);
    if (isSuccess(oppgavesøkRes)) {
      harAdressebeskyttelse = oppgavesøkRes.data.harAdressebeskyttelse;
      oppgavesøkRes.data.oppgaver.forEach((oppgave) => {
        const isReservert = Boolean(oppgave.reservertAv) && oppgave.reservertAv != brukerinformasjon?.NAVident;
        const isPåVent = oppgave.påVentÅrsak != null;
        oppgaveData.push({
          href: byggKelvinURL(oppgave),
          label: `${formaterOppgave(oppgave)}`,
          status: isReservert ? 'RESERVERT' : isPåVent ? 'PÅ_VENT' : 'ÅPEN',
          markeringer: oppgave.markeringer.map((markering) => markering.markeringType),
        });
        kontorData.push({ enhet: `${oppgave.enhet}` });
        behandlingsStatusData.push({ status: `${oppgave.status}` });
      });
    }
  } catch (err) {
    logError('/api/kelvinsøk oppgaver', err);
  }

  const saker = sakData?.map((sak) => ({
    href: `/saksbehandling/sak/${sak.saksnummer}`,
    label: `${sak.saksnummer} (${formaterDatoForFrontend(sak.opprettetTidspunkt)})`,
  }));

  return {
    oppgaver: oppgaveData,
    saker: saker,
    harTilgang: sakData[0]?.harTilgang ?? true,
    harAdressebeskyttelse: harAdressebeskyttelse,
    kontor: kontorData,
    person: personData,
    behandlingsStatus: behandlingsStatusData,
  };
}

async function utledSøkeresultatProd(søketekst: string, brukerinformasjon?: BrukerInformasjon): Promise<SøkeResultat> {
  let sakData: SaksInfo[] = [];
  const isFnr = søketekst.length === 11;
  const isSaksnummer = søketekst.length === 7;

  // Saker
  try {
    if (isFnr) {
      const sakRes = await finnSakerForIdent(søketekst);

      if (isSuccess(sakRes)) {
        sakData = sakRes.data;
      }
    } else if (isSaksnummer) {
      const sak = await hentSak(formaterSaksnummer(søketekst));
      sakData = [sak];
    }
  } catch (err) {
    logError('/api/kelvinsøk saker', err);
  }

  // Oppgaver
  let oppgaveData: SøkeResultat['oppgaver'] = [];
  let kontorData: SøkeResultat['kontor'] = [];
  let personData: SøkeResultat['person'] = [];
  let behandlingsStatusData: SøkeResultat['behandlingsStatus'] = [];
  let harTilgang: boolean = false;
  let harAdressebeskyttelse: boolean = true;
  try {
    const oppgavesøkRes = await oppgaveTekstSøk(søketekst);
    if (isSuccess(oppgavesøkRes)) {
      harTilgang = oppgavesøkRes.data.harTilgang;
      harAdressebeskyttelse = oppgavesøkRes.data.harAdressebeskyttelse;
      oppgavesøkRes.data.oppgaver.forEach((oppgave) => {
        const isReservert = Boolean(oppgave.reservertAv) && oppgave.reservertAv != brukerinformasjon?.NAVident;
        const isPåVent = oppgave.påVentÅrsak != null;
        oppgaveData.push({
          href: byggKelvinURL(oppgave),
          label: `${formaterOppgave(oppgave)}`,
          status: isReservert ? 'RESERVERT' : isPåVent ? 'PÅ_VENT' : 'ÅPEN',
          markeringer: oppgave.markeringer.map((markering) => markering.markeringType),
        });
        kontorData.push({ enhet: `${oppgave.enhet}` });
        personData.push({
          href: byggKelvinURL(oppgave),
          label: `${oppgave.personNavn}`,
        });
        behandlingsStatusData.push({ status: `${oppgave.status}` });
      });
    }
  } catch (err) {
    logError('/api/kelvinsøk oppgaver', err);
  }
  return {
    oppgaver: oppgaveData,
    saker: sakData?.map((sak) => ({
      href: `/saksbehandling/sak/${sak.saksnummer}`,
      label: `${sak.saksnummer} (${formaterDatoForFrontend(sak.periode.fom)})`,
    })),
    harTilgang: harTilgang,
    harAdressebeskyttelse: harAdressebeskyttelse,
    kontor: kontorData,
    person: personData,
    behandlingsStatus: behandlingsStatusData,
  };
}

function buildSaksbehandlingsURL(oppgave: Oppgave): string {
  return `/saksbehandling/sak/${oppgave.saksnummer}/${oppgave?.behandlingRef}`;
}

function buildPostmottakURL(oppgave: Oppgave): string {
  return `/postmottak/${oppgave?.behandlingRef}`;
}

function formaterOppgave(oppgave: Oppgave) {
  const formatertBehandlingstype =
    oppgave.behandlingstype == 'DOKUMENT_HÅNDTERING'
      ? 'Dokumenthåndtering'
      : capitalize(oppgave.behandlingstype).replaceAll('_', ' ');

  return `${formatertBehandlingstype} - ${mapBehovskodeTilBehovstype(oppgave.avklaringsbehovKode)}`;
}

export function byggKelvinURL(oppgave: Oppgave): string {
  if (oppgave.journalpostId) {
    return buildPostmottakURL(oppgave);
  } else {
    return buildSaksbehandlingsURL(oppgave);
  }
}
