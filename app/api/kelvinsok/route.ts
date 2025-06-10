import { NextResponse } from 'next/server';
import { finnSakerForIdent, hentSak } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { Behandlingsstatus, SaksInfo } from 'lib/types/types';
import { oppgaveTekstSøk } from 'lib/services/oppgaveservice/oppgaveservice';
import { Oppgave } from 'lib/types/oppgaveTypes';
import { logError } from 'lib/serverutlis/logger';
import { isSuccess } from 'lib/utils/api';
import { mapBehovskodeTilBehovstype } from 'lib/utils/oversettelser';
import { capitalize } from 'lodash';
import { BrukerInformasjon } from '../../../lib/services/azure/azureUserService';
import { formaterDatoForFrontend } from 'lib/utils/date';
import { utledAdressebeskyttelse } from 'lib/utils/adressebeskyttelse';

export interface SøkeResultat {
  oppgaver?: {
    label: string;
    href: string;
    status: string;
    harAdressebeskyttelse: boolean;
  }[];
  saker?: { href: string; label: string }[];
  kontor?: { enhet: string }[];
  person?: { href: string; label: string }[];
  behandlingsStatus?: { status?: Behandlingsstatus }[];
}

interface Props {
  brukerInformasjon?: BrukerInformasjon;
}

export async function POST(req: Request, brukerinformasjon: Props) {
  const body: { søketekst: string } = await req.json();
  if (!body.søketekst) {
    return new Response(JSON.stringify({ message: 'søketekst mangler' }), { status: 400 });
  }

  const søketekst = body.søketekst;
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
      const sak = await hentSak(søketekst);
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
  try {
    const oppgavesøkRes = await oppgaveTekstSøk(søketekst);
    if (isSuccess(oppgavesøkRes)) {
      oppgavesøkRes.data.forEach((oppgave) => {
        const isReservert =
          Boolean(oppgave.reservertAv) && oppgave.reservertAv != brukerinformasjon.brukerInformasjon?.NAVident;
        const isPåVent = oppgave.påVentÅrsak != null;
        oppgaveData.push({
          href: byggKelvinURL(oppgave),
          label: `${capitalize(oppgave.behandlingstype)} - ${mapBehovskodeTilBehovstype(oppgave.avklaringsbehovKode)}`,
          status: isReservert ? 'RESERVERT' : isPåVent ? 'PÅ_VENT' : 'ÅPEN',
          harAdressebeskyttelse: utledAdressebeskyttelse(oppgave).length != 0,
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
  const data = {
    oppgaver: oppgaveData,
    saker: sakData?.map((sak) => ({
      href: `/saksbehandling/sak/${sak.saksnummer}`,
      label: `${sak.saksnummer} (${formaterDatoForFrontend(sak.periode.fom)})`,
    })),
    kontor: kontorData,
    person: personData,
    behandlingsStatus: behandlingsStatusData,
  };

  return NextResponse.json(data, {
    status: 200,
  });
}
function buildSaksbehandlingsURL(oppgave: Oppgave): string {
  return `/saksbehandling/sak/${oppgave.saksnummer}/${oppgave?.behandlingRef}`;
}
function buildPostmottakURL(oppgave: Oppgave): string {
  return `/postmottak/${oppgave?.behandlingRef}`;
}

export function byggKelvinURL(oppgave: Oppgave): string {
  if (oppgave.journalpostId) {
    return buildPostmottakURL(oppgave);
  } else {
    return buildSaksbehandlingsURL(oppgave);
  }
}
