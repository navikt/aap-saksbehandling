import { getToken } from 'lib/auth/authentication';
import { hentBehandling, hentFlyt } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { headers } from 'next/headers';

import { HGrid } from 'components/DsClient';

import styles from './layout.module.css';
import { ReactNode } from 'react';
import { Steg } from 'components/steg/Steg';

const Layout = async ({
  params,
  children,
}: {
  params: { behandlingsReferanse: string; behandlingsType: string };
  children: ReactNode;
}) => {
  const behandling = await hentBehandling(params.behandlingsReferanse, getToken(headers()));
  const flyt = await hentFlyt(params.behandlingsReferanse, getToken(headers()));

  console.log('behabdlingsType', params.behandlingsType);

  if (behandling === undefined) {
    return <div>Behandling ikke funnet</div>;
  }

  return (
    <>
      <div>
        <ol type="1" className={styles.stegMeny}>
          {flyt?.flyt.map((steg) => {
            return (
              <Steg
                key={steg.stegType}
                navn={steg.stegType}
                erFullført={
                  (steg.vilkårDTO?.perioder?.filter((periode) => periode.utfall === 'OPPFYLT').length ?? 0) > 0
                }
                aktivtSteg={params.behandlingsType === steg.stegType}
              />
            );
          })}
        </ol>

        <div className={styles.space} />
      </div>
      <HGrid columns={'1fr 3fr 1fr'} className={styles.kolonner}>
        {children}
        <div className={`${styles.kolonne} ${styles.høyrekolonne}`} />
      </HGrid>
    </>
  );
};

export default Layout;
