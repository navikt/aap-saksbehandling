import { Button } from '@navikt/ds-react';
import styles from './EditorButton.module.css';

interface Props {
  title: string;
  onClick: () => void;
  isActive: boolean;
}

export const EditorButton = ({ title, isActive, onClick }: Props) => {
  const buttonStyle = isActive ? styles.active : styles.inactive;

  return (
    <Button className={`${buttonStyle} ${styles.button}`} onClick={onClick}>
      {title}
    </Button>
  );
};
