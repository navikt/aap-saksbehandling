import { InformasjonsKolonne } from 'components/informasjonskolonne/InformasjonsKolonne';
import { OppgaveKolonne } from 'components/oppgavekolonne/OppgaveKolonne';

import styles from './page.module.css';
import { StegGruppe } from 'lib/types/types';
import { notFound } from 'next/navigation';

const Page = async ({ params }: { params: { behandlingsReferanse: string; aktivGruppe: StegGruppe } }) => {
  if (!['ALDER', 'SYKDOM', 'FORESLÅ_VEDTAK'].includes(decodeURI(params.aktivGruppe))) {
    notFound();
  }

  return (
    <>
      <InformasjonsKolonne
        className={`${styles.kolonne} ${styles.venstrekolonne}`}
        behandlingsReferanse={params.behandlingsReferanse ?? ''}
      />
      <OppgaveKolonne
        className={styles.kolonne}
        behandlingsReferanse={params.behandlingsReferanse ?? ''}
        aktivGruppe={decodeURI(params.aktivGruppe) as StegGruppe}
      />
    </>
  );
};

export default Page;
