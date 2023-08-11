'use client';

import { Loader } from '@navikt/ds-react';
import styles from './SakPage.module.css';

const Page = () => {
  const søker = true; //useSøker();

  if (!søker) {
    return <Loader />;
  }

  return <Sak />;
};

const Sak = () => {
  // const { søker } = useRequiredSøker();

  return (
    <div className={styles.sak__container}>
      <div className={styles.grid__box}>
        <main>
          <p>sakspage</p>
        </main>
      </div>
    </div>
  );
};

export default Page;
