import { MarkButton } from 'components/breveditor/markbutton/MarkButton';
import { BlockButton } from 'components/breveditor/blockbutton/BlockButton';

import styles from './Toolbar.module.css';

export const Toolbar = () => {
  return (
    <div className={styles.toolbar}>
      <MarkButton title={'Bold'} type={'bold'} />
      <MarkButton title={'Italic'} type={'italic'} />
      <MarkButton title={'Underline'} type={'underline'} />
      <BlockButton title={'H1'} type={'heading-one'} />
      <BlockButton title={'H2'} type={'heading-two'} />
      <BlockButton title={'H3'} type={'heading-three'} />
      <BlockButton title={'H4'} type={'heading-four'} />
    </div>
  );
};
