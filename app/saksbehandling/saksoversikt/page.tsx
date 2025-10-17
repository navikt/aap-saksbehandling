import { AlleSakerListe } from 'components/saksliste/AlleSakerListe';
import styles from './page.module.css';
import { isDev, isLocal, isProd } from 'lib/utils/environment';
import { OpprettSakLocal } from 'components/opprettsak/OpprettSakLocal';
import OpprettSakTest from 'components/opprettsak/OpprettSakTest';
import { Suspense } from 'react';

const lokalOpprettelseAvDummySak = isLocal();
const testOpprettelseAvDummySak = isDev();
const visningAvAlleBehandlingerLokaltOgDev = !isProd();
const Page = async () => {
  return (
    <main className={styles.main}>
      {lokalOpprettelseAvDummySak && <OpprettSakLocal />}
      {testOpprettelseAvDummySak && <OpprettSakTest />}
      {visningAvAlleBehandlingerLokaltOgDev && (
        <Suspense>
          <AlleSakerListe />
        </Suspense>
      )}
    </main>
  );
};

export default Page;
