import { ReactNode } from 'react';
import { Button } from '@navikt/ds-react';
import styles from './ToolbarButton.module.css';

interface ToolbarButtonProps {
  onClick: () => void;
  active?: boolean;
  children: ReactNode;
}

export const ToolbarButton = ({ onClick, active = false, children }: ToolbarButtonProps) => {
  const classNames = `${styles.toolbarbutton} ${active ? styles.active : ''}`;
  return (
    <Button type={'button'} variant={'tertiary-neutral'} onClick={() => onClick()} className={classNames}>
      {children}
    </Button>
  );
};
