import { getToken } from 'lib/auth/authentication';
import { hentBehandling } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { headers } from 'next/headers';

import { HGrid } from 'components/DsClient';

import styles from './page.module.css';
import { ReactNode } from 'react';

const Layout = async ({ params, children }: { params: { behandlingsReferanse: string }; children: ReactNode }) => {
  const behandling = await hentBehandling(params.behandlingsReferanse, getToken(headers()));

  if (behandling === undefined) {
    return <div>Behandling ikke funnet</div>;
  }

  return (
    <HGrid columns={'1fr 3fr 1fr'} className={styles.kolonner}>
      {children}
      <div className={`${styles.kolonne} ${styles.høyrekolonne}`} />
    </HGrid>
  );
};

export default Layout;
