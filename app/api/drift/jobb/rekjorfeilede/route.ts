import { rekjørFeiledeJobber } from 'lib/services/saksbehandlingservice/saksbehandlingService';

export async function GET() {
  try {
    return new Response(await rekjørFeiledeJobber(), { status: 200 });
  } catch (err: any) {
    return new Response(err?.message, { status: 500 });
  }
}
