import styles from './page.module.css';
import { HGrid } from 'components/DsClient';
import { InformasjonsKolonne } from '../../../components/informasjonsKolonne/InformasjonsKolonne';
import { OppgaveKolonne } from '../../../components/oppgavekolonne/OppgaveKolonne';

const Page = async ({ params }: { params: { saksId: string } }) => {
  return (
    <HGrid columns={'1fr 3fr 1fr'} className={styles.kolonner}>
      <InformasjonsKolonne className={`${styles.kolonne} ${styles.venstrekolonne}`} saksId={params.saksId} />
      <OppgaveKolonne className={styles.kolonne} />
      <div className={`${styles.kolonne} ${styles.høyrekolonne}`} />
    </HGrid>
  );
};

export default Page;
