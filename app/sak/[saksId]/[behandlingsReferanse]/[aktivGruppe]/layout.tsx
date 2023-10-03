import { getToken } from 'lib/auth/authentication';
import { hentBehandling, hentFlyt2 } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { headers } from 'next/headers';

import { HGrid } from 'components/DsClient';

import styles from './layout.module.css';
import { ReactNode } from 'react';
import { GruppeElement } from 'components/gruppeelement/GruppeElement';

const Layout = async ({
  params,
  children,
}: {
  params: { behandlingsReferanse: string; behandlingsType: string };
  children: ReactNode;
}) => {
  const behandling = await hentBehandling(params.behandlingsReferanse, getToken(headers()));
  const flyt = await hentFlyt2(params.behandlingsReferanse, getToken(headers()));

  if (behandling === undefined) {
    return <div>Behandling ikke funnet</div>;
  }

  return (
    <>
      <div>
        <ol type="1" className={styles.stegMeny}>
          {flyt?.flyt
            .filter((gruppe) => ['SYKDOM', 'FORESLÅ_VEDTAK'].includes(gruppe.stegGruppe))
            .map((gruppe) => {
              return (
                <GruppeElement
                  key={gruppe.stegGruppe}
                  navn={gruppe.stegGruppe}
                  erFullført={false}
                  aktivtSteg={flyt.aktivGruppe === gruppe.stegGruppe}
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
