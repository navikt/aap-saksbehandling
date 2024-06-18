'use client';

import { useContext, useState } from 'react';
import { useRouter } from 'next/navigation';

import { Button } from '@navikt/ds-react';
import { byggQueryString } from 'components/oppgavebehandling/lib/query';
import { fetchProxy } from 'lib/clientApi';
import { Oppgave } from 'lib/types/oppgavebehandling';
import { KøContext } from 'components/oppgavebehandling/KøContext';

import styles from './BehandleNesteOppgave.module.css';

export const BehandleNesteOppgave = () => {
  const { valgtKøId, køliste } = useContext(KøContext);
  const [laster, settLaster] = useState(false);
  const router = useRouter();

  const hentNesteOppgave = async () => {
    settLaster(true);
    const umodifisertKø = køliste.find((k) => k.id === valgtKøId);
    const querystring = byggQueryString(umodifisertKø);
    const url = querystring
      ? `/api/oppgavebehandling/nesteoppgave/?${querystring}`
      : '/api/oppgavebehandling/nesteoppgave';

    const oppgave = await fetchProxy<Oppgave>(url, 'GET');
    if (oppgave && oppgave.saksnummer && oppgave.behandlingsreferanse) {
      router.push(`/sak/${oppgave.saksnummer}/${oppgave.behandlingsreferanse}`);
    } else {
      settLaster(false);
      console.error('Klarte ikke å hente neste oppgave');
    }
  };

  return (
    <>
      <Button
        variant={'primary'}
        type={'button'}
        onClick={() => hentNesteOppgave()}
        className={styles.behandleNesteKnapp}
        loading={laster}
      >
        Behandle neste oppgave
      </Button>
    </>
  );
};
