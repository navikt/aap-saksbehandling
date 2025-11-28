import { BodyShort, Box, Button, Loader } from '@navikt/ds-react';
import { useEffect, useState } from 'react';

import styles from './ForhåndsvisBrev.module.css';

interface Props {
  referanse: string;
}

const hentDokument = async (
  brevbestillingReferanse: string,
  setDataUri: (uri: string | undefined) => void,
  setIsLoading: (status: boolean) => void
) => {
  let objectURL: string | undefined;
  const blob = await fetch(`/saksbehandling/api/brev/${brevbestillingReferanse}/forhandsvis/`, {
    method: 'GET',
  }).then((res) => res.blob());

  objectURL = URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }));
  setDataUri(objectURL);

  setIsLoading(false);
};

// TODO Dette skal etterhvert gå automatisk ved endringer, men i første versjon må man be om ny pdf
export const ForhåndsvisBrev = ({ referanse }: Props) => {
  const [dataUri, setDataUri] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    return () => {
      if (dataUri) {
        console.info('Cleaning house...');
        URL.revokeObjectURL(dataUri);
      }
    };
  });

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
      <Button type="button" onClick={() => hentDokument(referanse, setDataUri, setIsLoading)}>
        Oppdater forhåndsvisning
      </Button>
    </Box>
  );
};
