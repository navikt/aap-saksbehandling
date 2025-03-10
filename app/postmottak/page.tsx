import { hentAlleBehandlinger } from 'lib/services/dokumentmottakservice/dokumentMottakService';
import Link from 'next/link';
import { OpprettBehandling } from 'components/postmottak/test/behandling/OpprettBehandling';
import { VStack } from '@navikt/ds-react';

const Page = async () => {
  const alleBehandlinger = (await hentAlleBehandlinger()).sort(
    (a, b) => Date.parse(b.opprettet) - Date.parse(a.opprettet)
  );

  return (
    <main>
      Her kommer postmottaket
      <div></div>
      <ul>
        {alleBehandlinger.map((behandling) => (
          <li key={behandling.id}>
            <Link href={`/postmottak/${behandling.id}/`} prefetch={false}>
              {behandling.id} - {behandling.steg} - {behandling.opprettet} - {behandling.status}
            </Link>
          </li>
        ))}
      </ul>
      <div style={{ maxWidth: 'var(--a-breakpoint-sm)' }}>
        <VStack gap={'6'}>
          <OpprettBehandling />
        </VStack>
      </div>
    </main>
  );
};

export default Page;
