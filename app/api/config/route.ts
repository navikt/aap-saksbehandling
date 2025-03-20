import { ClientConfig } from 'lib/types/clientConfig';

export async function GET() {
  const config: ClientConfig = {
    gosysUrl: process.env.GOSYS_URL!!,
    modiaPersonoversiktUrl: process.env.MODIA_PERSONOVERSIKT_URL!!,
  };

  try {
    return new Response(JSON.stringify(config), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: JSON.stringify(error), status: 500 }), { status: 500 });
  }
}
