import { BodyShort, Box, Loader } from '@navikt/ds-react';

import styles from './ForhåndsvisBrev.module.css';

interface Props {
  dataUri?: string;
  isLoading: boolean;
}

export const ForhåndsvisBrev = ({ dataUri, isLoading = false }: Props) => {
  return (
    <Box padding={'2'} background={'bg-subtle'} shadow="medium">
      {isLoading && (
        <div>
          <Loader size="xlarge" title="Laster forhåndsvisning av brev..." />
          <BodyShort spacing>Laster forhåndsvising av brev</BodyShort>
        </div>
      )}
      {dataUri && (
        <div className={styles.pdf}>
          <object data={`${dataUri}`} type="application/pdf">
            <p>Forhåndsvisning av brev</p>
          </object>
        </div>
      )}
    </Box>
  );
};
