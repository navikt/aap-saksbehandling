'use server';

import styles from 'app/saksbehandling/sak/[saksId]/aktivitet/page.module.css';
import { Aktivitetsplikt } from 'components/aktivitetsplikt/Aktivitetsplikt';
import { hentAktivitetspliktHendelser, hentSak } from 'lib/services/saksbehandlingservice/saksbehandlingService';

interface Props {
  saksnummer: string;
}

export const AktivitetspliktMedDatafetching = async ({ saksnummer }: Props) => {
  const aktivitetspliktHendelser = await hentAktivitetspliktHendelser(saksnummer);
  const sak = await hentSak(saksnummer);

  if (sak.type === 'ERROR') {
    return <div>Kunne ikke finne sak.</div>;
  }

  return (
    <div className={styles.aktivitetSkjema}>
      <Aktivitetsplikt aktivitetspliktHendelser={aktivitetspliktHendelser.hendelser} sak={sak.data} />
    </div>
  );
};
