import styles from 'app/sak/[saksId]/aktivitet/page.module.css';
import { AktivitetspliktMedDatafetching } from 'components/aktivitetsplikt/AktivitetspliktMedDatafetching';

export default async function Page({ params }: { params: { saksId: string } }) {
  return (
    <div className={styles.aktivitetSkjema}>
      <AktivitetspliktMedDatafetching saksnummer={params.saksId} />
    </div>
  );
}
