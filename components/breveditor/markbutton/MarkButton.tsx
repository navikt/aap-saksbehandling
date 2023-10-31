import { useSlate } from 'slate-react';
import { Editor } from 'slate';
import { CustomLeafType } from 'components/breveditor/BrevEditor';
import { Button } from '@navikt/ds-react';

import styles from './MarkButton.module.css';

interface Props {
  title: string;
  type: CustomLeafType;
}

export const MarkButton = ({ type, title }: Props) => {
  const editor = useSlate();

  const marks = Editor.marks(editor);
  const isMarkActive = marks && marks[type] === true;

  const toggleMark = () => {
    if (isMarkActive) {
      Editor.removeMark(editor, type);
    } else {
      Editor.addMark(editor, type, true);
    }
  };

  const buttonStyle = isMarkActive ? styles.active : styles.inactive;

  return (
    <Button className={`${buttonStyle} ${styles.button}`} onClick={toggleMark}>
      {title}
    </Button>
  );
};
