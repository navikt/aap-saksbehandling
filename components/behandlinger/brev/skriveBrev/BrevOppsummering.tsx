'use client';

import { BrevGrunnlagBrev } from 'lib/types/types';
import styles from './brevoppsummering.module.css';
import { Button, Heading, HStack } from '@navikt/ds-react';
import { formaterDatoForFrontend } from 'lib/utils/date';
import { useRouter } from 'next/navigation';
import { useFeatureFlag } from '../../../../context/UnleashContext';

type BrevOppsummeringProps = {
  sendteBrev: BrevGrunnlagBrev[];
  avbrutteBrev: BrevGrunnlagBrev[];
  automatiskBrevSendtDato?: string | undefined;
};

export const BrevOppsummering = ({ sendteBrev, avbrutteBrev, automatiskBrevSendtDato }: BrevOppsummeringProps) => {
  const router = useRouter();
  const skalViseAutomatiskBrevSendt = useFeatureFlag('HoppOverBeslutterVedAvslagSykdom') && automatiskBrevSendtDato

  return (
    <section>
      {skalViseAutomatiskBrevSendt && (
        <div className={styles.card}>
          <Heading size="small" level="2">
            Vedtaksbrevet ble sendt automatisk
          </Heading>
          {`Behandlingen er nå avsluttet. Brevet ble sendt ${formaterDatoForFrontend(automatiskBrevSendtDato)}`}
          <HStack>
            <Button
              variant={'primary'}
              type={'button'}
              onClick={() => {
                router.push('/oppgave');
              }}
            >
              Tilbake til oppgavelisten
            </Button>
          </HStack>
        </div>
      )}
      {!skalViseAutomatiskBrevSendt && sendteBrev.length > 0 && (
        <div className={styles.card}>
          <Heading size="small" level="2">
            Sendte brev
          </Heading>
          <ul className={styles.brevList}>
            {sendteBrev.map((brev) => (
              <li key={brev.brevbestillingReferanse}>
                {brev.brev?.journalpostTittel} – sendt {formaterDatoForFrontend(brev.oppdatert)}
              </li>
            ))}
          </ul>
        </div>
      )}
      {!skalViseAutomatiskBrevSendt && avbrutteBrev.length > 0 && (
        <div className={styles.card}>
          <Heading size="small" level="2">
            Avbrutte brev
          </Heading>
        </div>
      )}
    </section>
  );
};
