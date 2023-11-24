import { Editor } from '@tiptap/react';

import { Button } from '@navikt/ds-react';

import styles from './Toolbar.module.css';
import { BulletListIcon, NumberListIcon, TableIcon } from '@navikt/aksel-icons';

interface Props {
  editor: Editor | null;
}

export const Toolbar = ({ editor }: Props) => {
  if (!editor) {
    return;
  }
  const activeStyle = (mark: string, attributes?: object) => {
    return editor?.isActive(mark, attributes) ? `${styles.active}` : '';
  };

  return (
    <div className={styles.toolbar}>
      <Button
        type={'button'}
        variant={'tertiary-neutral'}
        onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`${styles.toolbarbutton} ${activeStyle('heading', { level: 1 })}`}
      >
        H1
      </Button>
      <Button
        type={'button'}
        variant={'tertiary-neutral'}
        onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`${styles.toolbarbutton} ${activeStyle('heading', { level: 2 })}`}
      >
        H2
      </Button>
      <Button
        type={'button'}
        variant={'tertiary-neutral'}
        onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
        className={`${styles.toolbarbutton} ${activeStyle('heading', { level: 3 })}`}
      >
        H3
      </Button>
      <Button
        type={'button'}
        variant={'tertiary-neutral'}
        onClick={() => editor?.chain().focus().toggleHeading({ level: 4 }).run()}
        className={`${styles.toolbarbutton} ${activeStyle('heading', { level: 4 })}`}
      >
        H4
      </Button>
      <Button
        type={'button'}
        variant={'tertiary-neutral'}
        onClick={() => editor?.chain().focus().toggleBold().run()}
        className={`${styles.toolbarbutton} ${activeStyle('bold')}`}
      >
        B
      </Button>
      <Button
        type={'button'}
        variant={'tertiary-neutral'}
        onClick={() => editor?.chain().focus().toggleItalic().run()}
        className={`${styles.toolbarbutton} ${activeStyle('italic')}`}
      >
        I
      </Button>
      <Button
        type={'button'}
        variant={'tertiary-neutral'}
        onClick={() => editor?.chain().focus().toggleBulletList().run()}
        className={`${styles.toolbarbutton} ${activeStyle('bulletList')}`}
      >
        <BulletListIcon className={styles.icon} title={'Punktliste'} />
      </Button>
      <Button
        type={'button'}
        variant={'tertiary-neutral'}
        onClick={() => editor?.chain().focus().toggleOrderedList().run()}
        className={`${styles.toolbarbutton} ${activeStyle('orderedList')}`}
      >
        <NumberListIcon className={styles.icon} title={'Nummerert liste'} />
      </Button>
      <Button
        type={'button'}
        variant={'tertiary-neutral'}
        className={styles.toolbarbutton}
        onClick={() => editor?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
      >
        <TableIcon className={styles.icon} title={'Sett inn tabell'} />
      </Button>
      <Button
        type={'button'}
        variant={'tertiary-neutral'}
        className={styles.toolbarbutton}
        onClick={() => editor?.chain().focus().deleteTable().run()}
      >
        NO TBL
      </Button>
    </div>
  );
};
