'use server';

import { hentAktivitetsMeldinger } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import styles from 'app/sak/[saksId]/aktivitet/page.module.css';
import { Aktivitetsplikt } from 'components/aktivitetsplikt/Aktivitetsplikt';

export const AktivitetspliktMedDatafetching = async ({ saksnummer }: { saksnummer: string }) => {
  const aktivitetsMeldinger = await hentAktivitetsMeldinger(saksnummer);
  return (
    <div className={styles.aktivitetSkjema}>
      <Aktivitetsplikt saksnummer={saksnummer} aktivitetsMeldinger={aktivitetsMeldinger} />
    </div>
  );
};
