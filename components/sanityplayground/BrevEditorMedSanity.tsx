'use client';

import { Breveditor } from 'components/breveditor/Breveditor';
import { Dispatch } from 'react';
import { JSONContent } from '@tiptap/core';

interface Props {
  id: string;
  initialValue: JSONContent;
  brukEditor: boolean;
  setBrevData: Dispatch<JSONContent>;
}

export const BrevEditorMedSanity = ({ initialValue, brukEditor, setBrevData, id }: Props) => {
  function setBrevDataMedId(data: JSONContent) {
    setBrevData(data, id);
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'row', gap: '1rem', padding: '2rem' }}>
      <Breveditor brukEditor={brukEditor} setContent={setBrevDataMedId} initialValue={initialValue} />
    </div>
  );
};
