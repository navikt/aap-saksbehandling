'use server';

import styles from 'app/saksbehandling/sak/[saksId]/aktivitet/page.module.css';
import { Aktivitetsplikt } from 'components/aktivitetsplikt/Aktivitetsplikt';
import { hentAktivitetspliktHendelser, hentSak } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { isError } from 'lib/utils/api';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';

interface Props {
  saksnummer: string;
}

export const AktivitetspliktMedDatafetching = async ({ saksnummer }: Props) => {
  const aktivitetspliktHendelser = await hentAktivitetspliktHendelser(saksnummer);
  const sak = await hentSak(saksnummer);
  if (isError(aktivitetspliktHendelser)) {
    return <ApiException apiResponses={[aktivitetspliktHendelser]} />;
  }

  return (
    <div className={styles.aktivitetSkjema}>
      <Aktivitetsplikt aktivitetspliktHendelser={aktivitetspliktHendelser.data.hendelser} sak={sak} />
    </div>
  );
};
