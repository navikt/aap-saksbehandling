'use client';

import { BrevGrunnlagBrev } from 'lib/types/types';
import styles from './brevoppsummering.module.css';
import { BodyShort, Button, Heading, HStack, VStack } from '@navikt/ds-react';
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
  const skalViseAutomatiskBrevSendt = useFeatureFlag('HoppOverBeslutterVedAvslagSykdom') && automatiskBrevSendtDato;

  return (
    <section>
      {skalViseAutomatiskBrevSendt && (
        <div className={styles.card}>
          <Heading size="small" level="2">
            Vedtak sendt til bruker
          </Heading>
          <VStack gap={'space-8'}>
            <BodyShort>{`Vedtaksbrev om avslag på § 11-5 ble sendt til bruker ${formaterDatoForFrontend(automatiskBrevSendtDato)}.`}</BodyShort>
            <BodyShort>Last inn siden på nytt for å se brevet under saksdokumentene.</BodyShort>
          </VStack>
          <HStack>
            <Button
              variant={'secondary'}
              type={'button'}
              onClick={() => {
                router.push('/oppgave');
              }}
              size={'small'}
            >
              Gå til oppgavelisten
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
