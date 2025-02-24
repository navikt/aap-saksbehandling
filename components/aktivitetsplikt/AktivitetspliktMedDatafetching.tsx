'use server';

import styles from 'app/sak/[saksId]/aktivitet/page.module.css';
import { Aktivitetsplikt } from 'components/aktivitetsplikt/Aktivitetsplikt';
import { hentAktivitetspliktHendelser, hentSak } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { FetchProxyError } from 'components/fetchproxyerror/FetchProxyError';

interface Props {
  saksnummer: string;
}

export const AktivitetspliktMedDatafetching = async ({ saksnummer }: Props) => {
  const aktivitetspliktHendelser = await hentAktivitetspliktHendelser(saksnummer);
  const sak = await hentSak(saksnummer);

  if (aktivitetspliktHendelser.type === 'ERROR') {
    return <FetchProxyError error={aktivitetspliktHendelser} />;
  }

  return (
    <div className={styles.aktivitetSkjema}>
      <Aktivitetsplikt aktivitetspliktHendelser={aktivitetspliktHendelser.responseJson.hendelser} sak={sak} />
    </div>
  );
};
