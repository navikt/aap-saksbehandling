import { ValgteEnheterProvider } from 'components/oppgave/valgteenheterprovider/ValgteEnheterProvider';
import styles from './layout.module.css';
import { ProduksjonsstyringsHeader } from 'components/produksjonsstyring/produksjonsstyringsheader/ProduksjonsstyringsHeader';
import { hentEnheter } from 'lib/services/oppgaveservice/oppgaveservice';

export const metadata = {
  title: 'Kelvin - Produksjonsstyring',
  description: 'Saksbehandlingssystem for AAP',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const enheter = await hentEnheter();

  return (
    <div className={styles.body}>
      <ValgteEnheterProvider>
        <ProduksjonsstyringsHeader enheter={enheter} />
        {children}
      </ValgteEnheterProvider>
    </div>
  );
}
