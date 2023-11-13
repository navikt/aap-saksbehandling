'use client';
import { StarterKit } from '@tiptap/starter-kit';
import { EditorContent, useEditor } from '@tiptap/react';

import styles from './Tiptap.module.css';

const extensions = [StarterKit];

export const Tiptap = () => {
  const editor = useEditor({
    extensions,
  });

  const ohHiMark = (mark: string, attributes?: object) => {
    return editor?.isActive(mark, attributes) ? `${styles.isActive}` : '';
  };

  const Menu = () => (
    <div className={styles.menu}>
      <button
        type={'button'}
        onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`${styles.menubutton} ${ohHiMark('heading', { level: 1 })}`}
      >
        H1
      </button>
      <button
        type={'button'}
        onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`${styles.menubutton} ${ohHiMark('heading', { level: 2 })}`}
      >
        H2
      </button>
      <button
        type={'button'}
        onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
        className={`${styles.menubutton} ${ohHiMark('heading', { level: 3 })}`}
      >
        H3
      </button>
      <button
        type={'button'}
        onClick={() => editor?.chain().focus().toggleHeading({ level: 4 }).run()}
        className={`${styles.menubutton} ${ohHiMark('heading', { level: 4 })}`}
      >
        H4
      </button>
      <button
        type={'button'}
        onClick={() => editor?.chain().focus().toggleBold().run()}
        className={`${styles.menubutton} ${ohHiMark('bold')}`}
      >
        B
      </button>
      <button
        type={'button'}
        onClick={() => editor?.chain().focus().toggleItalic().run()}
        className={`${styles.menubutton} ${ohHiMark('italic')}`}
      >
        I
      </button>
      <button
        type={'button'}
        onClick={() => editor?.chain().focus().toggleBulletList().run()}
        className={`${styles.menubutton} ${ohHiMark('bulletList')}`}
      >
        ≡
      </button>
      <button
        type={'button'}
        onClick={() => editor?.chain().focus().toggleOrderedList().run()}
        className={`${styles.menubutton} ${ohHiMark('orderedList')}`}
      >
        123
      </button>
    </div>
  );

  return (
    <div className={styles.container}>
      <div className={styles.editorPane}>
        <Menu />
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};
