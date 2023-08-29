export async function GET() {
  return new Response(JSON.stringify({ sak: 'hei' }), { status: 200 });
}
