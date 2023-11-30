'use client';

import { Breveditor } from 'components/breveditor/Breveditor';
import { Dispatch } from 'react';
import { JSONContent } from '@tiptap/core';

interface Props {
  initialValue: JSONContent;
  brukEditor: boolean;
  setBrevData: Dispatch<JSONContent>;
}

export const BrevEditorMedSanity = ({ initialValue, brukEditor, setBrevData }: Props) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'row', gap: '1rem', padding: '2rem' }}>
      <Breveditor brukEditor={brukEditor} setContent={setBrevData} initialValue={initialValue} />
    </div>
  );
};
