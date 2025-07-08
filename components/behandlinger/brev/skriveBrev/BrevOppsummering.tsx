'use client';

import { BrevGrunnlagBrev } from 'lib/types/types';
import styles from './brevoppsummering.module.scss';
import { Heading } from '@navikt/ds-react';
import { formaterDatoForFrontend } from 'lib/utils/date';

type BrevOppsummeringProps = {
  sendteBrev: BrevGrunnlagBrev[];
  avbrutteBrev: BrevGrunnlagBrev[];
};

export const BrevOppsummering = ({ sendteBrev, avbrutteBrev }: BrevOppsummeringProps) => (
  <section>
    {sendteBrev.length > 0 && (
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
    {avbrutteBrev.length > 0 && (
      <div className={styles.card}>
        <Heading size="small" level="2">
          Avbrutte brev
        </Heading>
      </div>
    )}
  </section>
);
