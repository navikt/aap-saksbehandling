export async function GET() {
  const res = await fetch('http://localhost:8080/api/sak/alle', {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

  const data = await res.json();

  console.log('data', data);
  if (res.ok) {
    return new Response(JSON.stringify(data), { status: 200 });
  } else {
    return new Response(JSON.stringify({ message: 'Ingen saker funnet.' }), { status: 500 });
  }
}
