'use client';
import { StarterKit } from '@tiptap/starter-kit';
import { Content, EditorContent, useEditor } from '@tiptap/react';

import styles from 'components/breveditor/Breveditor.module.css';
import { Toolbar } from 'components/breveditor/toolbar/Toolbar';
import { JSONContent } from '@tiptap/core';
import { Dispatch } from 'react';

interface Props {
  initialValue?: Content;
  setContent: Dispatch<JSONContent>;
}

const extensions = [StarterKit];

export const Breveditor = ({ initialValue, setContent }: Props) => {
  const editor = useEditor({
    extensions,
    content: initialValue,
    onUpdate({ editor }) {
      console.log('tiptapjson', editor.getJSON());
      setContent(editor.getJSON());
    },
  });

  return (
    <div className={styles.container}>
      <div className={styles.editorPane}>
        <Toolbar editor={editor} />
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};
