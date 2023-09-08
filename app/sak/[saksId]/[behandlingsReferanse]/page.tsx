import { hentBehandling } from 'lib/services/saksbehandlingService';

import { HGrid } from 'components/DsClient';
import { InformasjonsKolonne } from 'components/informasjonsKolonne/InformasjonsKolonne';
import { OppgaveKolonne } from 'components/oppgavekolonne/OppgaveKolonne';

import styles from './page.module.css';

const Page = async ({ params }: { params: { behandlingsReferanse: string } }) => {
  const behandling = await hentBehandling(params.behandlingsReferanse, '123'); // TODO: Brukes for å hente referanser til oppgaver

  console.log(behandling);

  if (behandling === undefined) {
    return <div>Behandling ikke funnet</div>;
  }

  return (
    <HGrid columns={'1fr 3fr 1fr'} className={styles.kolonner}>
      <InformasjonsKolonne
        className={`${styles.kolonne} ${styles.venstrekolonne}`}
        behandlingsReferanse={behandling.referanse ?? ''}
      />
      <OppgaveKolonne className={styles.kolonne} behandlingsReferanse={behandling.referanse ?? ''} />
      <div className={`${styles.kolonne} ${styles.høyrekolonne}`} />
    </HGrid>
  );
};

export default Page;
