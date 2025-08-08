import { AlleSakerListe } from 'components/saksliste/AlleSakerListe';
import styles from '../page.module.css';
import { isProd } from 'lib/utils/environment';
import OpprettSakTest from 'components/opprettsak/OpprettSakTest';

const Page = async () => {
  return (
    <main className={styles.main}>
      {!isProd() && <OpprettSakTest />}
      {!isProd() && <AlleSakerListe />}
    </main>
  );
};

export default Page;
