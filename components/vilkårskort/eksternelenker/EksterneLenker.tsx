'use client';

import { Link } from '@navikt/ds-react';
import { StegType } from 'lib/types/types';
import { ExternalLinkIcon } from '@navikt/aksel-icons';
import { lenkerPerSteg } from 'components/vilkårskort/eksternelenker/lenkerPerSteg';
import styles from './EksterneLenker.module.css';

export const EksterneLenker = ({ steg }: { steg: StegType }) => {
  const lenker = lenkerPerSteg[steg];
  if (!lenker) return null;

  return (
    <ul className={styles.liste}>
      {lenker.map((lenke, index) => (
        <li key={index}>
          <Link inlineText={true} href={lenke.url} target="_blank" rel="noopener noreferrer">
            {lenke.lenkeTekst} <ExternalLinkIcon />
          </Link>
        </li>
      ))}
    </ul>
  );
};
