import { ReactEditor, useSlate } from 'slate-react';
import { Editor } from 'slate';
import { CustomLeafType } from 'components/breveditor/BrevEditor';
import { EditorButton } from 'components/breveditor/editorbutton/EditorButton';

interface Props {
  title: string;
  type: CustomLeafType;
}

export const MarkButton = ({ type, title }: Props) => {
  const editor = useSlate();

  const marks = Editor.marks(editor);
  const isMarkActive = marks !== null && marks[type] === true;

  const toggleMark = () => {
    if (isMarkActive) {
      Editor.removeMark(editor, type);
    } else {
      Editor.addMark(editor, type, true);
    }

    ReactEditor.focus(editor);
  };

  return <EditorButton title={title} onClick={toggleMark} isActive={isMarkActive} />;
};
