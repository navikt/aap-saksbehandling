import { Editor } from '@tiptap/react';
import { Button } from '@navikt/ds-react';

import styles from './Boblemeny.module.css';

interface BubbleMenuProps {
  editor: Editor | null;
}

export const Boblemeny = ({ editor }: BubbleMenuProps) => {
  if (!editor) {
    return;
  }
  return (
    <div className={styles.boblemeny}>
      <Button
        type={'button'}
        variant={'tertiary-neutral'}
        onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
        className={editor.isActive('heading', { level: 3 }) ? `${styles.active}` : ''}
      >
        H3
      </Button>
      <Button
        type={'button'}
        variant={'tertiary-neutral'}
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={editor.isActive('bold') ? `${styles.active}` : ''}
      >
        <b>B</b>
      </Button>
      <Button
        type={'button'}
        variant={'tertiary-neutral'}
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={editor.isActive('italic') ? `${styles.active}` : ''}
      >
        <i>I</i>
      </Button>
      <Button
        type={'button'}
        variant={'tertiary-neutral'}
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={editor.isActive('strike') ? `${styles.active}` : ''}
      >
        <s>S</s>
      </Button>
    </div>
  );
};
