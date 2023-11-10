const dummyBody = {
  mottaker: {
    navn: 'Ola Nordmann',
    ident: '12345678910',
  },
  saksnummer: 'AABBCC123',
  dato: '11. august 2023',
  underblokker: [
    {
      type: 'heading-one',
      text: 'Dette er en overskrift',
    },
    {
      type: 'paragraph',
      text: 'Dette er et avsnitt',
    },
  ],
};
export async function POST() {
  return fetch('http://127.0.0.1:8020/api/v1/genpdf/aap-saksbehandling-pdfgen/vedtak', {
    method: 'POST',
    body: JSON.stringify(dummyBody),
    headers: {
      Accept: 'application/pdf',
      'Content-Type': 'application/json',
    },
  });
}
