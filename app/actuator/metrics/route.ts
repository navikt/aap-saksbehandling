import prometheus from 'lib/prometheus';

export async function GET() {
  return new Response(await prometheus.register.metrics(), {
    status: 200,
    headers: { 'Content-Type': prometheus.register.contentType },
  });
}
