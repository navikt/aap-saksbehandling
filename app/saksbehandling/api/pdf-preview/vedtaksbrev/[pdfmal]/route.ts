export async function POST(req: Request, props: { params: Promise<{ pdfmal: string }> }) {
  const params = await props.params;
  const body = await req.json();
  return fetch(`${process.env.SAKSBEHANDLING_PDFGEN_URL}/api/v1/genpdf/aap-saksbehandling-pdfgen/${params.pdfmal}`, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      Accept: 'application/pdf',
      'Content-Type': 'application/json',
    },
  });
}
