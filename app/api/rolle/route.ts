import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

const roller = ['NAV-KONTOR', 'NAY', 'NAY-BESLUTTER'] as const;
export type Rolle = (typeof roller)[number];

export async function POST(req: NextRequest) {
  const body = await req.json();
  if (roller.includes(body.rolle))
    cookies().set({
      name: 'aap-saksbehandling-rolle',
      value: body.rolle,
      httpOnly: true,
      path: '/',
    });
}
