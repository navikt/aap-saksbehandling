import { RenderElementProps } from 'slate-react';

export const Element = (props: RenderElementProps) => {
  if (props.element.type === 'paragraph') {
    return <p>{props.children}</p>;
  }
};
