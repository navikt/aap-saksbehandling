import { Detail } from '@navikt/ds-react';
import styles from './NyEndretTag.module.css';

interface Props {
  type: 'Ny' | 'Endret';
  /** Smal tag-kolonne når ingen rader i tabellen er endret, siden «Ny» er kortere enn «Endret». */
  kunNyTagger: boolean;
}

export const NyEndretTag = ({ type, kunNyTagger }: Props) => (
  <span className={kunNyTagger ? `${styles.tagKolonne} ${styles.tagKolonneKunNy}` : styles.tagKolonne}>
    <Detail weight="semibold" className={styles.tekst}>
      {type}
    </Detail>
  </span>
);
