import { Loader } from '@navikt/ds-react';

import styles from './ForhåndsvisBrev.module.css';

interface Props {
  dataUri?: string;
  isLoading: boolean;
}

export const ForhåndsvisBrev = ({ dataUri, isLoading = false }: Props) => {
  return (
    <div className={styles.pdfBox}>
      {isLoading && (
        <div className={styles.overlay}>
          <Loader size="2xlarge" title="Oppretter pdf" transparent />
        </div>
      )}
      {dataUri && (
        <object data={dataUri} type="application/pdf" className={styles.pdf} aria-label="Pdf av vedtaksbrev" />
      )}
    </div>
  );
};
