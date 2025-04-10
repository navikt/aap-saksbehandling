import { AlleSakerListe } from 'components/saksliste/AlleSakerListe';
import styles from './page.module.css';
import { isLocal, isProd } from 'lib/utils/environment';
import { OpprettSak } from 'components/opprettsak/OpprettSak';

const Page = async () => {
  return (
    <main className={styles.main}>
      {isLocal() && <OpprettSak />}
      {!isProd() && <AlleSakerListe />}
    </main>
  );
};

export default Page;
