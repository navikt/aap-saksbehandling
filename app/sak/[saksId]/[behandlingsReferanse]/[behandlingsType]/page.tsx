import { InformasjonsKolonne } from 'components/informasjonskolonne/InformasjonsKolonne';
import { OppgaveKolonne } from 'components/oppgavekolonne/OppgaveKolonne';

import styles from './page.module.css';
import { hentBehandling } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { getToken } from 'lib/auth/authentication';
import { headers } from 'next/headers';

const Page = async ({ params }: { params: { behandlingsReferanse: string; behandlingsType: string } }) => {
  const behandling = await hentBehandling(params.behandlingsReferanse, getToken(headers()));

  return (
    <>
      <InformasjonsKolonne
        className={`${styles.kolonne} ${styles.venstrekolonne}`}
        behandlingsReferanse={behandling?.referanse ?? ''}
      />
      <OppgaveKolonne className={styles.kolonne} behandlingsReferanse={behandling?.referanse ?? ''} />
    </>
  );
};

export default Page;
