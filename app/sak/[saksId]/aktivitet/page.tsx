import styles from 'app/sak/[saksId]/aktivitet/page.module.css';
import { AktivitetspliktMedDatafetching } from 'components/aktivitetsplikt/AktivitetspliktMedDatafetching';
import { SaksinfoBanner } from 'components/saksinfobanner/SaksinfoBanner';
import { hentSak, hentSakPersoninfo } from 'lib/services/saksbehandlingservice/saksbehandlingService';

export default async function Page(props: { params: Promise<{ saksId: string }> }) {
  const params = await props.params;
  const personInfo = await hentSakPersoninfo(params.saksId);
  const sak = await hentSak(params.saksId);

  return (
    <>
      <SaksinfoBanner personInformasjon={personInfo} sak={sak} />
      <div className={styles.aktivitetSkjema}>
        <AktivitetspliktMedDatafetching saksnummer={params.saksId} />
      </div>
    </>
  );
}
