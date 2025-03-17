import styles from './page.module.css';
import { Produksjonsstyringsmeny } from 'components/produksjonsstyring/produksjonsstyringsmeny/Produksjonsstyringsmeny';
import { TotaloversiktBehandlinger } from 'components/produksjonsstyring/totaloversiktbehandlinger/TotaloversiktBehandlinger';
import { MinEnhet } from 'components/produksjonsstyring/minenhet/MinEnhet';

export default async function Home() {
  return (
    <div className={styles.page}>
      <Produksjonsstyringsmeny
        totaloversikt={<TotaloversiktBehandlinger />}
        minenhet={<MinEnhet />}
        produktivitet={<></>}
      />
    </div>
  );
}
