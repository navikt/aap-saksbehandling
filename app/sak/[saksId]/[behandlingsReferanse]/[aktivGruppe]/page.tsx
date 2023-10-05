import { InformasjonsKolonne } from 'components/informasjonskolonne/InformasjonsKolonne';
import { OppgaveKolonne } from 'components/oppgavekolonne/OppgaveKolonne';

import styles from './page.module.css';
import { hentBehandling } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { getToken } from 'lib/auth/authentication';
import { headers } from 'next/headers';
import { StegGruppe } from 'lib/types/types';
import { notFound } from 'next/navigation';

const Page = async ({ params }: { params: { behandlingsReferanse: string; aktivGruppe: StegGruppe } }) => {
  const behandling = await hentBehandling(params.behandlingsReferanse, getToken(headers()));

  if (!['SYKDOM', 'FORESLÅ_VEDTAK'].includes(decodeURI(params.aktivGruppe))) {
    notFound();
  }

  return (
    <>
      <InformasjonsKolonne
        className={`${styles.kolonne} ${styles.venstrekolonne}`}
        behandlingsReferanse={behandling?.referanse ?? ''}
      />
      <OppgaveKolonne
        className={styles.kolonne}
        behandlingsReferanse={behandling?.referanse ?? ''}
        aktivGruppe={decodeURI(params.aktivGruppe) as StegGruppe}
      />
    </>
  );
};

export default Page;
