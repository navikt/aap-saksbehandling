'use client';

import { usePdfGenerator } from 'components/pdfvisning/usePdfGenerator';
import { Breveditor } from 'components/breveditor/Breveditor';
import { Content } from '@tiptap/react';
import { PdfVisning } from 'components/pdfvisning/PdfVisning';

interface Props {
  initialValue: Content;
}

export const BrevEditorMedSanity = ({ initialValue }: Props) => {
  const { pdf, setBrevData } = usePdfGenerator('fritekst');

  return (
    <div style={{ display: 'flex', flexDirection: 'row', gap: '1rem', padding: '2rem' }}>
      <Breveditor setContent={setBrevData} initialValue={initialValue} />
      {pdf && <PdfVisning pdfFilInnhold={pdf} />}
    </div>
  );
};
