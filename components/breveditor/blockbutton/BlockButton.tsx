import { Editor, Element, Transforms } from 'slate';
import { ReactEditor, useSlate } from 'slate-react';
import { CustomElementType } from '../BrevEditor';
import { EditorButton } from 'components/breveditor/editorbutton/EditorButton';

const isBlockActive = (editor: Editor, type: CustomElementType) => {
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

  const isList = ['ordered-list', 'bulleted-list'].includes(type);

  Transforms.unwrapNodes(editor, {
    match: (n) => !Editor.isEditor(n) && Element.isElement(n) && ['ordered-list', 'bulleted-list'].includes(n.type),
    split: true,
  });

  let newProperties: Partial<Element> = {};
  if (isActive) {
    newProperties.type = 'paragraph';
  } else if (isList) {
    newProperties.type = 'list-item';
  } else {
    newProperties.type = type;
  }

  if (!isActive && isList) {
    const block = { type, children: [] };
    Transforms.wrapNodes(editor, block);
  }

  Transforms.setNodes<Element>(editor, newProperties);
  ReactEditor.focus(editor);
};

interface Props {
  title: string;
  type: CustomElementType;
}

export const BlockButton = ({ title, type }: Props) => {
  const editor = useSlate();

  return (
    <EditorButton title={title} onClick={() => toggleBlock(editor, type)} isActive={isBlockActive(editor, type)} />
  );
};
