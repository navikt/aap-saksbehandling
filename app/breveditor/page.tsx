'use client';

import { Breveditor } from 'components/breveditor/Breveditor';
import { HStack } from '@navikt/ds-react';
import { PdfVisning } from 'components/pdfvisning/PdfVisning';
import { usePdfGenerator } from 'components/pdfvisning/usePdfGenerator';

const Page = () => {
  const { pdf, setBrevData } = usePdfGenerator('fritekst');

  return (
    <HStack>
      <Breveditor setContent={setBrevData} />
      {pdf && <PdfVisning pdfFilInnhold={pdf} />}
    </HStack>
  );
};
export default Page;
