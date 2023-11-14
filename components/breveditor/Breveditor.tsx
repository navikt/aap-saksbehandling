'use client';
import { StarterKit } from '@tiptap/starter-kit';
import { Content, EditorContent, useEditor } from '@tiptap/react';

import styles from 'components/breveditor/Breveditor.module.css';
import { Toolbar } from 'components/breveditor/toolbar/Toolbar';

interface Props {
  initialValue?: Content;
}

const extensions = [StarterKit];

export const Breveditor = ({ initialValue }: Props) => {
  const editor = useEditor({ extensions, content: initialValue });

  return (
    <div className={styles.container}>
      <div className={styles.editorPane}>
        <Toolbar editor={editor} />
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};
