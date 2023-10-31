'use client';

import { BaseEditor, createEditor } from 'slate';
import { Editable, ReactEditor, RenderElementProps, RenderLeafProps, Slate, withReact } from 'slate-react';
import { useCallback, useMemo } from 'react';
import { Mark } from 'components/breveditor/mark/Mark';
import { Leaf } from 'components/breveditor/leaf/Leaf';

import styles from 'components/breveditor/BrevEditor.module.css';
import { Element } from 'components/breveditor/element/Element';
import { BlockButton } from './block/BlockButton';

export type CustomElementType = 'paragraph' | 'heading-one' | 'heading-two' | 'heading-three' | 'heading-four';

type CustomElement = {
  type: CustomElementType;
  children: CustomText[];
};
export type CustomText = { text: string; bold?: boolean; italic?: boolean; underline?: boolean };

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}

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

export const BrevEditor = () => {
  const editor = useMemo(() => withReact(createEditor()), []);
  const renderLeaf = useCallback((props: RenderLeafProps) => <Leaf {...props} />, []);
  const renderElement = useCallback((props: RenderElementProps) => <Element {...props} />, []);

  return (
    <Slate editor={editor} initialValue={initialValue} onChange={(e) => console.log(e)}>
      <div>
        <Mark title={'Bold'} type={'bold'} />
        <Mark title={'Italic'} type={'italic'} />
        <Mark title={'Underline'} type={'underline'} />
      </div>
      <div>
        <BlockButton title={'H1'} type={'heading-one'} />
      </div>
      <Editable className={styles.editor} renderElement={renderElement} renderLeaf={renderLeaf} />
    </Slate>
  );
};
