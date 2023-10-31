import { Editor, Element, Transforms } from 'slate';
import { useSlate } from 'slate-react';
import { CustomElementType } from '../BrevEditor';

const isBlockActive = (editor: Editor, type: string) => {
  const { selection } = editor;
  if (!selection) return false;

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: (n) => {
        return !Editor.isEditor(n) && Element.isElement(n) && n.type === type;
      },
    })
  );

  return !!match;
};
export const toggleBlock = (editor: Editor, type: CustomElementType) => {
  const isActive = isBlockActive(editor, type);

  let newProperties: Partial<Element> = {
    type: isActive ? 'paragraph' : type,
  };
  Transforms.setNodes<Element>(editor, newProperties);
};

interface Props {
  title: string;
  type: CustomElementType;
}

export const BlockButton = ({ title, type }: Props) => {
  const editor = useSlate();

  return (
    <button
      style={isBlockActive(editor, type) ? { backgroundColor: 'red' } : {}}
      onClick={(event) => {
        event.preventDefault();
        toggleBlock(editor, type);
      }}
    >
      {title}
    </button>
  );
};
