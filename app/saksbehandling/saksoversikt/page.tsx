import { AlleSakerListe } from 'components/saksliste/AlleSakerListe';
import styles from './page.module.css';
import { isDev, isLocal, isProd } from 'lib/utils/environment';
import { OpprettSakLocal } from 'components/opprettsak/OpprettSakLocal';
import OpprettSakTest from 'components/opprettsak/OpprettSakTest';

const Page = async () => {
  return (
    <main className={styles.main}>
      {isLocal() && <OpprettSakLocal />}
      {isDev() && <OpprettSakTest />}
      {!isProd() && <AlleSakerListe />}
    </main>
  );
};

export default Page;
