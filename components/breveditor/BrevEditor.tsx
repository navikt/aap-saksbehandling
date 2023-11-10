'use client';

import { BaseEditor, createEditor, Descendant } from 'slate';
import { Editable, ReactEditor, RenderElementProps, RenderLeafProps, Slate, withReact } from 'slate-react';
import { useCallback, useMemo, useState } from 'react';
import { Leaf } from 'components/breveditor/leaf/Leaf';

import styles from 'components/breveditor/BrevEditor.module.css';
import { Element } from 'components/breveditor/element/Element';
import { withHtml } from 'components/breveditor/inputparser/InputParser';
import { Toolbar } from 'components/breveditor/toolbar/Toolbar';

export type CustomElementType =
  | 'paragraph'
  | 'heading-one'
  | 'heading-two'
  | 'heading-three'
  | 'heading-four'
  | 'bulleted-list'
  | 'ordered-list'
  | 'list-item';
export type CustomLeafType = keyof Omit<CustomText, 'text'>;
export type CustomText = { text: string; bold?: boolean; italic?: boolean; underline?: boolean };

type CustomElement = {
  type: CustomElementType;
  children: CustomText[];
};

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}
type Props = {
  onBrevSubmit: (data: Descendant[]) => void;
};

const initialValue: CustomElement[] = [
  {
    type: 'paragraph',
    children: [{ text: 'A line of text in a paragraph.' }],
  },
  {
    type: 'heading-one',
    children: [{ text: 'Hello pello' }],
  },
];

export const BrevEditor = ({ onBrevSubmit }: Props) => {
  const editor = useMemo(() => withHtml(withReact(createEditor())), []);
  const renderLeaf = useCallback((props: RenderLeafProps) => <Leaf {...props} />, []);
  const renderElement = useCallback((props: RenderElementProps) => <Element {...props} />, []);
  const [text, setText] = useState<Descendant[]>([]);
  console.log(text);
  return (
    <div>
      <Slate
        editor={editor}
        initialValue={initialValue}
        onChange={(e) => {
          setText(e);
        }}
      >
        <Toolbar />
        <Editable className={styles.editor} renderElement={renderElement} renderLeaf={renderLeaf} />
      </Slate>
      <button
        onClick={() => {
          onBrevSubmit(text);
        }}
      >
        Hent brev
      </button>
    </div>
  );
};
