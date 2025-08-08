import { AlleSakerListe } from 'components/saksliste/AlleSakerListe';
import styles from './page.module.css';
import { isLocal, isProd } from 'lib/utils/environment';
import { OpprettSakLocal } from 'components/opprettsak/OpprettSakLocal';

const Page = async () => {
  return (
    <main className={styles.main}>
      {isLocal() && <OpprettSakLocal />}
      {!isProd() && <AlleSakerListe />}
    </main>
  );
};

export default Page;
