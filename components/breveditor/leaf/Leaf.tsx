import { RenderLeafProps } from 'slate-react';

import styles from 'components/breveditor/leaf/Leaf.module.css';

export const Leaf = (props: RenderLeafProps) => {
  const boldStyle = props.leaf.bold ? styles.bold : '';
  const italicStyle = props.leaf.italic ? styles.italic : '';

  return (
    <span {...props.attributes} className={`${boldStyle} ${italicStyle}`}>
      {props.children}
    </span>
  );
};
