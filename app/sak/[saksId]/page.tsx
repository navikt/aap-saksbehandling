import styles from './page.module.css';

const Page = async ({ params }: { params: { saksId: string } }) => {
  return (
    <div className={styles.kolonner}>
      <div className={`${styles.kolonne} ${styles.venstrekolonne}`}>SakId: {params.saksId}</div>
      <div className={styles.kolonne} />
      <div className={`${styles.kolonne} ${styles.høyrekolonne}`} />
    </div>
  );
};

export default Page;
