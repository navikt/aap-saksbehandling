import { NextResponse } from 'next/server';
import { finnSakerForIdent, hentSak } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { SaksInfo } from 'lib/types/types';
import { oppgaveTekstSøk } from 'lib/services/oppgaveservice/oppgaveservice';
import type { Oppgave } from 'lib/types/oppgaveTypes';
import { logError } from 'lib/serverutlis/logger';
import { isSuccess } from 'lib/utils/api';

export interface SøkeResultat {
  oppgaver?: {
    label: string;
    href: string;
  }[];
  saker?: { href: string; label: string; }[];
  kontor?: { enhet: string; }[];
  oppfølgingsenhet?: { enhet: string; }[];
  behandlingsStatus?: { status: string; }[];
}

export async function POST(req: Request) {
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
      } else {
        logError(
          `/kelvinsok finnsakerforident ${sakRes.status}, ${sakRes.apiException.code}: ${sakRes.apiException.message}`
        );
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
  let oppfølgingsenhetData: SøkeResultat['oppfølgingsenhet'] = [];
  let behandlingsStatusData: SøkeResultat['behandlingsStatus'] = [];
  try {
    const oppgaver = await oppgaveTekstSøk(søketekst);
    if (oppgaver) {
      oppgaver.forEach((oppgave) => {
        oppgaveData.push({
          href: byggKelvinURL(oppgave),
          label: `${oppgave.avklaringsbehovKode} - ${oppgave.behandlingstype}`,
        });
        kontorData.push({ enhet: `${oppgave.enhet}` });
        oppfølgingsenhetData.push({ enhet: `${oppgave.oppfølgingsenhet}` });
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
      label: `${sak.periode.fom} - ${sak.periode.tom}  (${sak.saksnummer})`,
    })),
    kontor: kontorData,
    oppfølgingsenhet: oppfølgingsenhetData,
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
