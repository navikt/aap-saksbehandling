import styles from 'app/sak/[saksId]/aktivitet/page.module.css';
import { AktivitetsMeldingMedDatafetching } from 'components/aktivitetsmelding/AktivitetsMeldingMedDatafetching';

export default async function Page({ params }: { params: { saksId: string } }) {
  return (
    <div className={styles.aktivitetSkjema}>
      <AktivitetsMeldingMedDatafetching saksnummer={params.saksId} />
    </div>
  );
}
