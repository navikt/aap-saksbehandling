import { listeMedSøkereOgSaker } from '../../../lib/mock/saksliste';

export async function GET() {
  return new Response(JSON.stringify(listeMedSøkereOgSaker), { status: 200 });
}
