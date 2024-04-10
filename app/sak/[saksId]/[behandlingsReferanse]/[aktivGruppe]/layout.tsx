import { hentBehandling, hentFlyt } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { HGrid } from 'components/DsClient';
import styles from './layout.module.css';
import { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import { InformasjonsKolonne } from 'components/informasjonskolonne/InformasjonsKolonne';
import { getStegSomSkalVises } from 'lib/utils/steg';
import { StegGruppe } from 'lib/types/types';

const Layout = async ({
  params,
  children,
}: {
  params: { behandlingsReferanse: string; aktivGruppe: string };
  children: ReactNode;
}) => {
  const behandling = await hentBehandling(params.behandlingsReferanse);
  const flytResponse = await hentFlyt(params.behandlingsReferanse);

  if (behandling === undefined) {
    notFound();
  }

  const stegSomSkalVises = getStegSomSkalVises(decodeURI(params.aktivGruppe) as StegGruppe, flytResponse);

  return (
    <HGrid columns={'1fr 3fr'} className={styles.kolonner}>
      <InformasjonsKolonne
        stegSomSkalVises={stegSomSkalVises}
        className={`${styles.kolonne} ${styles.venstrekolonne}`}
      />
      {children}
    </HGrid>
  );
};

export default Layout;
