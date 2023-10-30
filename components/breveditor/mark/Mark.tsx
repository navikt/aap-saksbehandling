import { useSlate } from 'slate-react';
import { Editor } from 'slate';

interface Props {
  title: string;
  type: string;
}
export const Mark = ({ type, title }: Props) => {
  const editor = useSlate();

  const isMarkActive = () => {
    const marks = Editor.marks(editor);
    // @ts-ignore
    return marks ? marks[type] === true : false;
  };

  const toggleMark = () => {
    const isActive = isMarkActive();
    console.log('Hei og hå', isActive);

    if (isActive) {
      Editor.removeMark(editor, type);
    } else {
      Editor.addMark(editor, type, true);
    }
  };

  console.log(Editor.marks(editor));

  return (
    <button style={isMarkActive() ? { backgroundColor: 'red' } : {}} onClick={() => toggleMark()}>
      {title}
    </button>
  );
};
