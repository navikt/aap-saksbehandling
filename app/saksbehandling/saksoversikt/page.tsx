import { AlleSakerListe } from 'components/saksliste/AlleSakerListe';
import styles from './page.module.css';
import { isDev, isLocal, isProd } from 'lib/utils/environment';
import { OpprettSakLocal } from 'components/opprettsak/OpprettSakLocal';
import OpprettSakTest from 'components/opprettsak/OpprettSakTest';
import { Suspense } from 'react';

const Page = async () => {
  return (
    <main className={styles.main}>
      {isLocal() && <OpprettSakLocal />}
      {isDev() && <OpprettSakTest />}
      {!isProd() && (
        <Suspense>
          <AlleSakerListe />
        </Suspense>
      )}
    </main>
  );
};

export default Page;
