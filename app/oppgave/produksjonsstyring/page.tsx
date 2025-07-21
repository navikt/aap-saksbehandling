import styles from './page.module.css';
import { Produksjonsstyringsmeny } from 'components/produksjonsstyring/produksjonsstyringsmeny/Produksjonsstyringsmeny';
import { hentEnheter } from 'lib/services/oppgaveservice/oppgaveservice';
import { isError } from 'lib/utils/api';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';

export default async function Home() {
  const enheter = await hentEnheter();
  if (isError(enheter)) {
    return <ApiException apiResponses={[enheter]} />;
  }

  return (
    <div className={styles.page}>
      <Produksjonsstyringsmeny enheter={enheter.data} />
    </div>
  );
}
