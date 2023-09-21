import { getToken } from 'lib/auth/authentication';
import { hentBehandling } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { headers } from 'next/headers';

import { HGrid } from 'components/DsClient';

import styles from './page.module.css';

const Page = async ({ params }: { params: { behandlingsReferanse: string } }) => {
  const behandling = await hentBehandling(params.behandlingsReferanse, getToken(headers()));

  if (behandling === undefined) {
    return <div>Behandling ikke funnet</div>;
  }

  return (
    <HGrid columns={'1fr 3fr 1fr'} className={styles.kolonner}>
      <div className={`${styles.kolonne} ${styles.høyrekolonne}`} />
    </HGrid>
  );
};

export default Page;
