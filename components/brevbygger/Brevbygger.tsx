'use client';

import { PdfVisning } from 'components/pdfvisning/PdfVisning';
import { useState } from 'react';
import { BrevEditorMedSanity } from '../sanityplayground/BrevEditorMedSanity';
import { deserialize } from 'lib/utils/sanity';
import { DelAvBrev, PortableTextMedRef } from 'app/sanity/page';
import { JSONContent } from '@tiptap/core';

interface Props {
  brevMedInnhold: DelAvBrev[];
  portableTextMedRef: PortableTextMedRef[];
}
type BrevData = {
  _id: string;
  content: JSONContent;
};
function byggBrev(brevMedInnhold: DelAvBrev[], portableTextMedRef: PortableTextMedRef[]) {
  return brevMedInnhold.map((innhold) => ({
    _id: innhold.id,
    content: deserialize(portableTextMedRef.find((content) => content.ref === innhold.id)?.innhold),
  }));
}
export const Brevbygger = ({ brevMedInnhold, portableTextMedRef }: Props) => {
  const [brevData, setBrevData] = useState<BrevData[]>(byggBrev(brevMedInnhold, portableTextMedRef));
  function updateBrevdata(content: JSONContent, id: string) {
    setBrevData(
      brevData.map((brev) => {
        if (brev._id === id) {
          return {
            ...brev,
            content,
          };
        }
        return brev;
      })
    );
  }

  return (
    <>
      <div>
        {brevMedInnhold.map((innhold, index) => {
          return (
            <BrevEditorMedSanity
              initialValue={deserialize(portableTextMedRef.find((content) => content.ref === innhold.id)?.innhold)}
              brukEditor={innhold.brukEditor}
              key={index}
              setBrevData={(content) => {
                updateBrevdata(content, innhold.id);
              }}
            />
          );
        })}
      </div>
      <PdfVisning content={brevData.flatMap((brev) => brev.content?.content)} />
    </>
  );
};
