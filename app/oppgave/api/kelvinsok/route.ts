import { NextResponse } from 'next/server';
import { logError } from '@navikt/aap-felles-utils';
import { SaksInfo } from 'lib/types/types';
import { finnSakerForIdent } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { oppgaveTekstSøk } from 'lib/services/oppgaveservice/oppgaveservice';
import { byggKelvinURL } from 'app/saksbehandling/api/kelvinsok/route';

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

  // Saker
  try {
    if (isFnr) {
      sakData = await finnSakerForIdent(søketekst);
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
        // @ts-ignore
        label: `${oppgave.avklaringsbehovKode} - ${oppgave.behandlingstype}`,
      }));
    }
  } catch (err) {
    logError('/api/kelvinsøk oppgaver', err);
  }
  const data = {
    oppgaver: oppgaveData,
    saker: sakData?.map((sak) => ({
      href: `${process.env.NEXT_PUBLIC_SAKSBEHANDLING_URL}/sak/${sak.saksnummer}`,
      label: `${sak.periode.fom} - ${sak.periode.tom}  (${sak.saksnummer})`,
    })),
  };

  return NextResponse.json(data, {
    status: 200,
  });
}
