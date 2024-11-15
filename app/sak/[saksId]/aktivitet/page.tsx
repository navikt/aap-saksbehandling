import styles from 'app/sak/[saksId]/aktivitet/page.module.css';
import { AktivitetspliktMedDatafetching } from 'components/aktivitetsplikt/AktivitetspliktMedDatafetching';

export default async function Page(props: { params: Promise<{ saksId: string }> }) {
  const params = await props.params;
  return (
    <div className={styles.aktivitetSkjema}>
      <AktivitetspliktMedDatafetching saksnummer={params.saksId} />
    </div>
  );
}
