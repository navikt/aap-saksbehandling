import { NextResponse } from 'next/server';
import { søkPåSak } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { SøkPåSakInfo } from 'lib/types/types';
import { oppgaveTekstSøk } from 'lib/services/oppgaveservice/oppgaveservice';
import { MarkeringType } from 'lib/types/oppgaveTypes';
import { logError } from 'lib/serverutlis/logger';
import { isSuccess } from 'lib/utils/api';
import { mapBehovskodeTilBehovstype } from 'lib/utils/oversettelser';
import { capitalize } from 'lodash';
import { BrukerInformasjon } from 'lib/services/azure/azureUserService';
import { formaterDatoForFrontend } from 'lib/utils/date';
import { byggKelvinURL } from 'lib/utils/request';

export interface SøkeResultat {
  oppgaver?: {
    label: string;
    href: string;
    status: string;
    markeringer: MarkeringType[];
  }[];
  kanSaksbehandle: boolean;
  harAdressebeskyttelse: boolean;
  saker?: { href: string; label: string }[];
  kontor?: { enhet: string }[];
  person?: { href: string | null; label: string }[];
}

interface Props {
  brukerInformasjon?: BrukerInformasjon;
}

/**
 * Enkel formatering for å gjøre søket til saksbehandler "case-insensitive"
 * Burde på sikt bli håndtert i backend, men det fordrer en større opprydding i typer tilknyttet Saksnummer
 **/
const formaterSaksnummer = (saksnummer: string) => {
  return saksnummer.toUpperCase().replaceAll('O', 'o').replaceAll('I', 'i');
};

export async function POST(req: Request, brukerinformasjon: Props) {
  const body: { søketekst: string } = await req.json();
  if (!body.søketekst) {
    return NextResponse.json({ message: 'søketekst mangler' }, { status: 400 });
  }

  const søketekst = body.søketekst;
  const data = await utledSøkeresultat(søketekst, brukerinformasjon.brukerInformasjon);

  return NextResponse.json(data, {
    status: 200,
  });
}

async function utledSøkeresultat(søketekst: string, brukerinformasjon?: BrukerInformasjon): Promise<SøkeResultat> {
  let sakData: SøkPåSakInfo[] = [];
  let personData: SøkeResultat['person'] = [];

  // Hent sak fra behandlingsflyt
  try {
    const sakRes = await søkPåSak(formaterSaksnummer(søketekst));
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
  let harAdressebeskyttelse: boolean = true;
  let harTilgangTilOppgaver: boolean = true;
  try {
    const oppgavesøkRes = await oppgaveTekstSøk(søketekst);
    if (isSuccess(oppgavesøkRes)) {
      harTilgangTilOppgaver = oppgavesøkRes.data.harTilgang;
      harAdressebeskyttelse = oppgavesøkRes.data.harAdressebeskyttelse;
      oppgavesøkRes.data.oppgaver.forEach((oppgaveISøk) => {
        const isReservert =
          Boolean(oppgaveISøk.reservertAvIdent) && oppgaveISøk.reservertAvIdent != brukerinformasjon?.NAVident;
        const isPåVent = oppgaveISøk.erPåVent;
        oppgaveData.push({
          href: byggKelvinURL(oppgaveISøk.behandlingskontekst),
          label: `${formaterOppgave(oppgaveISøk.behandlingskontekst.behandlingstype, oppgaveISøk.avklaringsbehovKode)}`,
          status: isReservert ? 'TILDELT' : isPåVent ? 'PÅ_VENT' : 'ÅPEN',
          markeringer: oppgaveISøk.typeMarkeringer,
        });
        kontorData.push({ enhet: `${oppgaveISøk.enhetForKø}` });

        // Hvis sak ikke finnes, hent navn fra oppgave. Skal ikke lenke til noe
        if (personData?.length == 0) {
          personData.push({
            href: null,
            label: `${oppgaveISøk.personNavn}`,
          });
        }
      });
    }
  } catch (err) {
    logError('/api/kelvinsøk oppgaver', err);
  }

  const saker = sakData?.map((sak) => ({
    href: `/saksbehandling/sak/${sak.saksnummer}`,
    label: `${sak.saksnummer} (${formaterDatoForFrontend(sak.opprettetTidspunkt)})`,
  }));

  const harTilgang = sakData.every((sak) => sak.harTilgang) && harTilgangTilOppgaver;

  return {
    oppgaver: oppgaveData,
    saker: saker,
    kanSaksbehandle: harTilgang,
    harAdressebeskyttelse: harAdressebeskyttelse,
    kontor: kontorData,
    person: personData
  };
}

function formaterOppgave(behandlingstype: string, avklaringsbehovKode: string) {
  const formatertBehandlingstype =
    behandlingstype == 'DOKUMENT_HÅNDTERING' ? 'Dokumenthåndtering' : capitalize(behandlingstype).replaceAll('_', ' ');

  return `${formatertBehandlingstype} - ${mapBehovskodeTilBehovstype(avklaringsbehovKode)}`;
}
