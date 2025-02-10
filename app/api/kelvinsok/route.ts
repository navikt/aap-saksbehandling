import { NextResponse } from 'next/server';
import { finnSakerForIdent } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { logError } from '@navikt/aap-felles-utils';
import { SøkeResultat } from 'components/appheader/Kelvinsøk';
import { SaksInfo } from 'lib/types/types';
import { oppgaveTekstSøk } from 'lib/services/oppgaveservice/oppgaveservice';

export async function POST(req: Request) {
  const body: { søketekst: string } = await req.json();
  if (!body.søketekst) {
    return new Response(JSON.stringify({ message: 'søketekst mangler' }), { status: 400 });
  }

  let data: SøkeResultat = {};
  try {
    const søketekst = body.søketekst;
    let sakData: SaksInfo[] = [];
    const isFnr = søketekst.length === 11;
    if (isFnr) {
      sakData = await finnSakerForIdent(søketekst);
    }
    let oppgaveData: SøkeResultat['oppgaver'] = [];
    const oppgaver = await oppgaveTekstSøk(søketekst);
    if (oppgaver) {
      oppgaveData = oppgaver.map((oppgave: unknown) => ({
        href: byggKelvinURL(oppgave),
        // @ts-ignore
        label: `${oppgave.avklaringsbehovKode} - ${oppgave.behandlingstype}`,
      }));
    }
    data = {
      oppgaver: oppgaveData,
      saker: sakData?.map((sak) => ({
        href: `${process.env.NEXT_PUBLIC_SAKSBEHANDLING_URL}/sak/${sak.saksnummer}`,
        label: `${sak.periode.fom} - ${sak.periode.tom}  (${sak.saksnummer})`,
      })),
    };
  } catch (err) {
    logError('/api/kelvinsøk', err);
    return new Response(JSON.stringify({ message: 'Noe gikk galt' }), { status: 500 });
  }

  return NextResponse.json(data, {
    status: 200,
  });
}
function buildSaksbehandlingsURL(oppgave: unknown): string {
  // @ts-ignore
  return `${process.env.NEXT_PUBLIC_SAKSBEHANDLING_URL}/sak/${oppgave.saksnummer}/${oppgave?.behandlingRef ?? oppgave?.referanse}`;
}
function buildPostmottakURL(oppgave: unknown): string {
  // @ts-ignore
  return `${process.env.NEXT_PUBLIC_POSTMOTTAK_URL}/postmottak/${oppgave?.behandlingRef ?? oppgave?.referanse}`;
}
export function byggKelvinURL(oppgave: unknown): string {
  // @ts-ignore
  if (oppgave.journalpostId) {
    return buildPostmottakURL(oppgave);
  } else {
    return buildSaksbehandlingsURL(oppgave);
  }
}
