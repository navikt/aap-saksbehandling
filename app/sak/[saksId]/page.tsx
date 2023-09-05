import styles from './page.module.css';
import { HGrid } from 'components/DsClient';

const Page = async ({ params }: { params: { saksId: string } }) => {
  return (
    <HGrid columns={'1fr 3fr 1fr'} className={styles.kolonner}>
      <div className={`${styles.kolonne} ${styles.venstrekolonne}`}>SakId: {params.saksId}</div>
      <div className={styles.kolonne} />
      <div className={`${styles.kolonne} ${styles.høyrekolonne}`} />
    </HGrid>
  );
};

export default Page;
