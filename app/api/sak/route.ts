import { NextApiRequest, NextApiResponse } from 'next';
import { listeMedSøkereOgSaker } from '../../../lib/mock/saksliste';

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  return new Response(JSON.stringify(listeMedSøkereOgSaker), { status: 200 });
}
