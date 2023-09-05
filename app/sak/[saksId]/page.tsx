import { hentSak } from 'lib/api';
import Link from 'next/link';

const Page = async ({ params }: { params: { saksId: string } }) => {
  const sak = await hentSak(params.saksId); // TODO: Brukes for å hente referanser til behandlinger

  return (
    <div>
      Alle behandlinger for en sak:
      <ul>
        {sak?.behandlinger?.map((behandling) => (
          <li key={behandling.referanse}>
            <Link href={`/sak/${params.saksId}/${behandling.referanse}`}>{behandling.referanse}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Page;
