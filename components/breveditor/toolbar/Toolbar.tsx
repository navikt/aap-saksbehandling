import { Editor } from '@tiptap/react';

import styles from './Toolbar.module.css';

interface Props {
  editor: Editor | null;
}

export const Toolbar = ({ editor }: Props) => {
  const stylingForMark = (mark: string, attributes?: object) => {
    return editor?.isActive(mark, attributes) ? `${styles.isActive}` : '';
  };

  return (
    <div className={styles.toolbar}>
      <button
        type={'button'}
        onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`${styles.toolbarbutton} ${stylingForMark('heading', { level: 1 })}`}
      >
        H1
      </button>
      <button
        type={'button'}
        onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`${styles.toolbarbutton} ${stylingForMark('heading', { level: 2 })}`}
      >
        H2
      </button>
      <button
        type={'button'}
        onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
        className={`${styles.toolbarbutton} ${stylingForMark('heading', { level: 3 })}`}
      >
        H3
      </button>
      <button
        type={'button'}
        onClick={() => editor?.chain().focus().toggleHeading({ level: 4 }).run()}
        className={`${styles.toolbarbutton} ${stylingForMark('heading', { level: 4 })}`}
      >
        H4
      </button>
      <button
        type={'button'}
        onClick={() => editor?.chain().focus().toggleBold().run()}
        className={`${styles.toolbarbutton} ${stylingForMark('bold')}`}
      >
        B
      </button>
      <button
        type={'button'}
        onClick={() => editor?.chain().focus().toggleItalic().run()}
        className={`${styles.toolbarbutton} ${stylingForMark('italic')}`}
      >
        I
      </button>
      <button
        type={'button'}
        onClick={() => editor?.chain().focus().toggleBulletList().run()}
        className={`${styles.toolbarbutton} ${stylingForMark('bulletList')}`}
      >
        ≡
      </button>
      <button
        type={'button'}
        onClick={() => editor?.chain().focus().toggleOrderedList().run()}
        className={`${styles.toolbarbutton} ${stylingForMark('orderedList')}`}
      >
        123
      </button>
    </div>
  );
};
