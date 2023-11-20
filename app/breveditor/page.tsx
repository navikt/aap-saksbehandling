'use client';

import { Breveditor } from 'components/breveditor/Breveditor';
import { Button } from '@navikt/ds-react';
import { PdfVisning } from 'components/pdfvisning/PdfVisning';
import { useState } from 'react';
import { JSONContent } from '@tiptap/core';

const Page = () => {
  const [brevData, setBrevData] = useState<JSONContent>({});
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div>
      <Button variant={'primary'} onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? 'Skjul pdf' : 'Vis pdf'}
      </Button>
      <div style={isOpen ? { display: 'flex', flexDirection: 'row' } : undefined}>
        <Breveditor setContent={(data) => setBrevData(data)} />
        {isOpen && <PdfVisning content={brevData.content} />}
      </div>
    </div>
  );
};
export default Page;
