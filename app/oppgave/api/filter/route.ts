import {NextRequest} from "next/server";
import {logError} from "@navikt/aap-felles-utils";
import {hentKøer} from "../../../../lib/services/oppgaveservice/oppgaveservice";

export async function GET(req: NextRequest) {
  const enheter = req.nextUrl.searchParams.getAll("enheter")

  try {
    const result = await hentKøer(enheter);
    return new Response(JSON.stringify(result), { status: 200 });
  } catch (error) {
    logError("Feil ved henting av køer", error);
    return new Response(JSON.stringify({ message: JSON.stringify(error), status: 500 }), { status: 500 });
  }
}
