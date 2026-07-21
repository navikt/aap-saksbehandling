'use client';

import { Link } from '@navikt/ds-react/Link';
import { StegType } from 'lib/types/types';
import { ExternalLinkIcon } from '@navikt/aksel-icons';
import { lenkerPerSteg } from 'components/vilkårskort/eksternelenkerivilkårskort/lenkerPerSteg';
import styles from 'components/vilkårskort/eksternelenkerivilkårskort/EksterneLenkerIVilkårskort.module.css';

export const EksterneLenkerIVilkårskort = ({ steg }: { steg: StegType }) => {
  const lenker = lenkerPerSteg[steg];
  if (!lenker) return null;

  return (
    <ul className={styles.lenkeliste}>
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
