import { StarterKit } from '@tiptap/starter-kit';
import { BubbleMenu, EditorContent, useEditor } from '@tiptap/react';

import styles from 'components/breveditor/Breveditor.module.css';
import { JSONContent } from '@tiptap/core';
import { Dispatch } from 'react';
import { Boblemeny } from 'components/breveditor/toolbar/boblemeny/Boblemeny';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { TableRow } from '@tiptap/extension-table-row';
import { Table } from '@tiptap/extension-table';
import { Loader } from '@navikt/ds-react';
import { Underline } from '@tiptap/extension-underline';

interface Props {
  initialValue?: JSONContent;
  className?: string;
  setContent: Dispatch<JSONContent>;
  brukEditor: boolean;
}

const extensions = [
  StarterKit,
  Table.configure({ HTMLAttributes: { class: styles.table } }),
  TableCell,
  TableHeader,
  TableRow,
  Underline,
];

export const Breveditor = ({ initialValue, setContent, brukEditor }: Props) => {
  const editor = useEditor({
    extensions,
    content: initialValue,
    onUpdate({ editor }) {
      console.log('tiptapjson', editor.getJSON());
      setContent(editor.getJSON());
    },
    editable: brukEditor,
  });

  if (!editor) {
    return (
      <div className={styles.centerLoader}>
        <Loader size={'2xlarge'} title={'Laster breveditor...'} />
      </div>
    );
  }

  return (
    <div className={styles.editor}>
      {/*{brukEditor && <Toolbar editor={editor} />}*/}
      {editor && (
        <BubbleMenu editor={editor}>
          <Boblemeny editor={editor} />
        </BubbleMenu>
      )}
      <EditorContent
        editor={editor}
        className={brukEditor ? styles.editorContent : styles.disabledEditor}
        data-testid={'breveditor'}
      />
    </div>
  );
};
