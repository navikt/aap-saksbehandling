import styles from 'app/saksbehandling/sak/[saksId]/aktivitet/page.module.css';
import { AktivitetspliktMedDatafetching } from 'components/aktivitetsplikt/AktivitetspliktMedDatafetching';
import { SaksinfoBanner } from 'components/saksinfobanner/SaksinfoBanner';
import { hentSak, hentSakPersoninfo } from 'lib/services/saksbehandlingservice/saksbehandlingService';

export default async function Page(props: { params: Promise<{ saksId: string }> }) {
  const params = await props.params;
  const [personInfo, sak] = await Promise.all([hentSakPersoninfo(params.saksId), hentSak(params.saksId)]);

  return (
    <>
      <SaksinfoBanner personInformasjon={personInfo} sak={sak} />
      <div className={styles.aktivitetSkjema}>
        <AktivitetspliktMedDatafetching saksnummer={params.saksId} />
      </div>
    </>
  );
}
