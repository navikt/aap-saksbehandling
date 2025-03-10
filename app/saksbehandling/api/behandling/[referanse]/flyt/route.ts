import { NextRequest } from 'next/server';
import { hentFlyt } from 'lib/services/saksbehandlingservice/saksbehandlingService';

export async function GET(req: NextRequest, props: { params: Promise<{ referanse: string }> }) {
  const params = await props.params;
  try {
    const data = await hentFlyt(params.referanse);
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    console.log('error i route', error);
    return new Response(JSON.stringify({ message: JSON.stringify(error) }), { status: 500 });
  }
}
export const dynamic = "force-dynamic";
