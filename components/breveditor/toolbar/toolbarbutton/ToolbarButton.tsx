import { ReactNode } from 'react';
import { Button } from '@navikt/ds-react';
import styles from './ToolbarButton.module.css';

interface ToolbarButtonProps {
  onClick: () => void;
  children: ReactNode;
  active?: boolean;
  disabled?: boolean;
}

export const ToolbarButton = ({ onClick, active = false, children, disabled = false }: ToolbarButtonProps) => {
  const classNames = `${styles.toolbarbutton} ${active ? styles.active : ''}`;
  return (
    <Button
      type={'button'}
      variant={'tertiary-neutral'}
      onClick={() => onClick()}
      className={classNames}
      disabled={disabled}
    >
      {children}
    </Button>
  );
};
