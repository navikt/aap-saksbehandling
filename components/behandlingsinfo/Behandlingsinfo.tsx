import { Label } from '@navikt/ds-react';
import styles from './Behandlingsinfo.module.css';

interface Props {
  behandlingstype: string;
}

export const Behandlingsinfo = ({ behandlingstype }: Props) => {
  return (
    <div className={styles.container}>
      <div className={styles.behandlingstype}>
        <Label as="p" size="medium" spacing>
          {behandlingstype}
        </Label>
      </div>
      HELLO PELLO
    </div>
  );
};
