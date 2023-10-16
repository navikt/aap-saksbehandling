import { InformasjonsKolonne } from 'components/informasjonskolonne/InformasjonsKolonne';
import { OppgaveKolonne } from 'components/oppgavekolonne/OppgaveKolonne';

import styles from './page.module.css';
import { StegGruppe } from 'lib/types/types';
import { notFound } from 'next/navigation';

const grupper: StegGruppe[] = ['ALDER', 'STUDENT', 'SYKDOM', 'VEDTAK'];

const Page = async ({ params }: { params: { behandlingsReferanse: string; aktivGruppe: StegGruppe } }) => {
  if (!grupper.includes(decodeURI(params.aktivGruppe) as StegGruppe)) {
    notFound();
  }

  return (
    <>
      <InformasjonsKolonne
        className={`${styles.kolonne} ${styles.venstrekolonne}`}
        behandlingsReferanse={params.behandlingsReferanse ?? ''}
      />
      <OppgaveKolonne
        behandlingsReferanse={params.behandlingsReferanse ?? ''}
        aktivGruppe={decodeURI(params.aktivGruppe) as StegGruppe}
      />
    </>
  );
};

export default Page;
