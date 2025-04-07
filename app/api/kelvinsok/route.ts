import { NextResponse } from 'next/server';
import { finnSakerForIdent, hentSak } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { SaksInfo } from 'lib/types/types';
import { oppgaveTekstSøk } from 'lib/services/oppgaveservice/oppgaveservice';
import type { Oppgave } from 'lib/types/oppgaveTypes';
import { logError } from 'lib/serverutlis/logger';

export interface SøkeResultat {
  oppgaver?: {
    label: string;
    href: string;
  }[];
  saker?: { href: string; label: string }[];
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
      sakData = await finnSakerForIdent(søketekst);
    } else if (isSaksnummer) {
      const res = await hentSak(søketekst);
      if (res.type === 'SUCCESS') {
        sakData = [res.data];
      }
    }
  } catch (err) {
    logError('/api/kelvinsøk saker', err);
  }

  // Oppgaver
  let oppgaveData: SøkeResultat['oppgaver'] = [];
  try {
    const oppgaver = await oppgaveTekstSøk(søketekst);
    if (oppgaver) {
      oppgaveData = oppgaver.map((oppgave) => ({
        href: byggKelvinURL(oppgave),
        label: `${oppgave.avklaringsbehovKode} - ${oppgave.behandlingstype}`,
      }));
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
  // @ts-ignore
  if (oppgave.journalpostId) {
    return buildPostmottakURL(oppgave);
  } else {
    return buildSaksbehandlingsURL(oppgave);
  }
}
