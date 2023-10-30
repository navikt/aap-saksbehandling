'use client';

import { BaseEditor, createEditor } from 'slate';
import { Editable, ReactEditor, RenderElementProps, Slate, withReact } from 'slate-react';
import { useState } from 'react';
import { Mark } from 'components/breveditor/mark/Mark';
import { Leaf } from 'components/breveditor/leaf/Leaf';

import styles from 'components/breveditor/BrevEditor.module.css';

type CustomElement = { type: 'paragraph'; children: CustomText[] };
type CustomText = { text: string; bold?: boolean; italic?: boolean; underline?: boolean };

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
];

export const BrevEditor = () => {
  const [editor] = useState(() => withReact(createEditor()));

  return (
    <Slate editor={editor} initialValue={initialValue} onChange={(e) => console.log(e)}>
      <div>
        <Mark title={'Bold'} type={'bold'} />
        <Mark title={'Italic'} type={'italic'} />
        <Mark title={'Underline'} type={'underline'} />
      </div>
      <Editable className={styles.editor} renderElement={renderElement} renderLeaf={(props) => <Leaf {...props} />} />
    </Slate>
  );
};

function renderElement(props: RenderElementProps) {
  switch (props.element.type) {
    case 'paragraph':
      return <p>{props.children}</p>;
  }
}
