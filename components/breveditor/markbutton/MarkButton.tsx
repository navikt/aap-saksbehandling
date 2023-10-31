import { useSlate } from 'slate-react';
import { Editor } from 'slate';
import { CustomLeafType } from 'components/breveditor/BrevEditor';

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

  return (
    <button style={isMarkActive ? { backgroundColor: 'red' } : {}} onClick={() => toggleMark()}>
      {title}
    </button>
  );
};
