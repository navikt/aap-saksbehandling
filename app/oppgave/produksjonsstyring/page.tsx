import { hentKøer } from 'lib/services/oppgaveservice/oppgaveservice';
import styles from './page.module.css';
import { Produksjonsstyringsmeny } from 'components/produksjonsstyring/produksjonsstyringsmeny/Produksjonsstyringsmeny';
import { TotaloversiktBehandlinger } from 'components/produksjonsstyring/totaloversiktbehandlinger/TotaloversiktBehandlinger';
import { MinEnhet } from 'components/produksjonsstyring/minenhet/MinEnhet';
import { KøOversikt } from 'components/oppgave/køoversikt/KøOversikt';

export default async function Home() {
  const køer = await hentKøer();
  return (
    <div className={styles.page}>
      <Produksjonsstyringsmeny
        totaloversikt={<TotaloversiktBehandlinger />}
        minenhet={<MinEnhet />}
        produktivitet={<></>}
        oppgaveOversikt={<KøOversikt køer={køer} />}
      />
    </div>
  );
}
