'use client';

import { Breveditor } from 'components/breveditor/Breveditor';
import { Content } from '@tiptap/react';
import { PdfVisning } from 'components/pdfvisning/PdfVisning';
import { useState } from 'react';
import { JSONContent } from '@tiptap/core';

interface Props {
  initialValue: Content;
}

export const BrevEditorMedSanity = ({ initialValue }: Props) => {
  const [brevData, setBrevData] = useState<JSONContent>({});

  return (
    <div style={{ display: 'flex', flexDirection: 'row', gap: '1rem', padding: '2rem' }}>
      <Breveditor setContent={setBrevData} initialValue={initialValue} />
      <PdfVisning content={brevData.content} />
    </div>
  );
};
