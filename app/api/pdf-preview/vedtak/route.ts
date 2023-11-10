export async function POST(req: Request) {
  const body = await req.json();
  return fetch('http://127.0.0.1:8020/api/v1/genpdf/aap-saksbehandling-pdfgen/vedtak', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      Accept: 'application/pdf',
      'Content-Type': 'application/json',
    },
  });
}
