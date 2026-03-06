import { NextResponse } from 'next/server';
import { søkPåSak } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { Behandlingsstatus, SøkPåSakInfo } from 'lib/types/types';
import { oppgaveTekstSøk } from 'lib/services/oppgaveservice/oppgaveservice';
import { MarkeringType, Oppgave } from 'lib/types/oppgaveTypes';
import { logError } from 'lib/serverutlis/logger';
import { isSuccess } from 'lib/utils/api';
import { mapBehovskodeTilBehovstype } from 'lib/utils/oversettelser';
import { capitalize } from 'lodash';
import { BrukerInformasjon } from 'lib/services/azure/azureUserService';
import { formaterDatoForFrontend } from 'lib/utils/date';

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
  person?: { href: string | null; label: string }[];
  behandlingsStatus?: { status?: Behandlingsstatus }[];
}

interface Props {
  brukerInformasjon?: BrukerInformasjon;
}

export async function POST(req: Request, brukerinformasjon: Props) {
  const body: { søketekst: string } = await req.json();
  if (!body.søketekst) {
    return NextResponse.json({ message: 'søketekst mangler' }, { status: 400 });
  }

  const søketekst = body.søketekst;
  // const data = await utledSøkeresultat(søketekst, brukerinformasjon.brukerInformasjon);
  // const data = {
  //   data: {
  //     searchRessurs: [
  //       {
  //         visningsnavn: 'Egil Olsen',
  //         fornavn: 'Egil',
  //         etternavn: 'Olsen',
  //         navident: 'IG543GJ',
  //       },
  //       {
  //         visningsnavn: 'Tor Idland',
  //         fornavn: 'Tor',
  //         etternavn: 'Idland',
  //         navident: 'I163764',
  //       },
  //     ],
  //   },
  // };
  const data = {
    type: 'SUCCESS',
    data: [
      {
        label: 'Kari Johansen',
        value: 'Z990601',
      },
      {
        label: 'Egil Olsen',
        value: 'Z990530',
      },
      {
        label: 'Tor Idland',
        value: 'Z993105',
      },
    ],
  };

  return NextResponse.json(data, {
    status: 200,
  });
}
