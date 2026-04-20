import { Box, Loader } from '@navikt/ds-react';

import styles from './ForhåndsvisBrev.module.css';

interface Props {
  dataUri?: string;
  isLoading: boolean;
}

export const ForhåndsvisBrev = ({ dataUri, isLoading = false }: Props) => {
  return (
    <Box padding={'space-8'} background={'neutral-soft'} shadow="dialog" minHeight={'100%'} className={styles.pdfBox}>
      {isLoading && (
        <div className={styles.overlay}>
          <Loader size="2xlarge" title="Laster forhåndsvisning av brev..." transparent />
        </div>
      )}
      {dataUri && (
        <object data={`${dataUri}`} type="application/pdf" className={styles.pdf}>
          <p>Forhåndsvisning av brev</p>
        </object>
      )}
    </Box>
  );
};
