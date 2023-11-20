'use client';
import { StarterKit } from '@tiptap/starter-kit';
import { BubbleMenu, Content, EditorContent, useEditor } from '@tiptap/react';

import styles from 'components/breveditor/Breveditor.module.css';
import { Toolbar } from 'components/breveditor/toolbar/Toolbar';
import { JSONContent } from '@tiptap/core';
import { Dispatch } from 'react';
import { Boblemeny } from 'components/breveditor/toolbar/boblemeny/Boblemeny';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { TableRow } from '@tiptap/extension-table-row';
import { Table } from '@tiptap/extension-table';

interface Props {
  initialValue?: Content;
  className?: string;
  setContent: Dispatch<JSONContent>;
}

const extensions = [
  StarterKit,
  Table.configure({ HTMLAttributes: { class: styles.table } }),
  TableCell,
  TableHeader,
  TableRow,
];

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
    <div className={styles.editor}>
      <Toolbar editor={editor} />
      {editor && (
        <BubbleMenu editor={editor}>
          <Boblemeny editor={editor} />
        </BubbleMenu>
      )}
      <EditorContent editor={editor} className={styles.editorContent} />
    </div>
  );
};
