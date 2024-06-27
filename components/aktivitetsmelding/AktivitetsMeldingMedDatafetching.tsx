'use server';

import { hentAktivitetsMeldinger } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import styles from 'app/sak/[saksId]/aktivitet/page.module.css';
import { AktivitetsMelding } from 'components/aktivitetsmelding/AktivitetsMelding';

export const AktivitetsMeldingMedDatafetching = async ({ saksnummer }: { saksnummer: string }) => {
  const aktivitetsMeldinger = await hentAktivitetsMeldinger(saksnummer);
  return (
    <div className={styles.aktivitetSkjema}>
      <AktivitetsMelding saksnummer={saksnummer} aktivitetsMeldinger={aktivitetsMeldinger} />
    </div>
  );
};
