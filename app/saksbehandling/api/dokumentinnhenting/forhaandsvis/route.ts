import { logError } from '@navikt/aap-felles-utils';
import { forhåndsvisDialogmelding } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { NextRequest } from 'next/server';
/*
const response: ForhåndsvisDialogmeldingResponse = {
  konstruertBrev:
    'Spørsmål om tilleggsopplysninger vedrørende pasient\\n\nGjelder pasient: SJELDEN HANDEL, 18499649238.\\n\nNav trenger opplysninger fra deg vedrørende din pasient. Du kan utelate opplysninger som etter din vurdering faller utenfor formålet.\\n\nVi skal sende en fin beskjed til behandler her.\\n\nSpørsmålene besvares i fritekst, og honoreres med takst L8.\\n\nLovhjemmel\\n\nFolketrygdloven § 21-4 andre ledd gir Nav rett til å innhente nødvendige opplysninger. Dette gjelder selv om opplysningene er taushetsbelagte, jf. § 21-4 sjette ledd.\\n\\n\nPålegget om utlevering av opplysninger kan påklages etter forvaltningsloven § 14.\\n\nKlageadgangen gjelder kun lovligheten i pålegget. Fristen for å klage er tre dager etter at pålegget er mottatt. Klagen kan fremsettes muntlig eller skriftlig.\\n\\n\nMed vennlig hilsen\\n\\n\nHvor henter jeg denne fra?\\n\\n\nNav',
};
*/
export async function POST(req: NextRequest) {
  const body = await req.json();
  try {
    const res = await forhåndsvisDialogmelding(body);
    return new Response(JSON.stringify(res), { status: 200 });
  } catch (error) {
    logError('Forhåndsvisning av dialogmelding feilet', error);
    return new Response(JSON.stringify({ message: JSON.stringify(error) }), { status: 500 });
  }
}
