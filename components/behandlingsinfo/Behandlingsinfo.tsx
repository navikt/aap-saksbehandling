import { BodyShort, Label } from '@navikt/ds-react';
import styles from './Behandlingsinfo.module.css';
import { formaterDatoForFrontend } from 'lib/utils/date';

interface Props {
  behandlingstype: string;
  status: string;
  opprettet: Date;
}

export const Behandlingsinfo = ({ behandlingstype, status, opprettet }: Props) => {
  return (
    <div className={styles.container}>
      <div className={styles.behandlingstype}>
        <Label as="p" size="medium" spacing>
          {behandlingstype}
        </Label>
        <div>
          <Label as="p" size="medium" spacing>
            Behandlingsstatus:
          </Label>
          <BodyShort size="medium" spacing>
            {status}
          </BodyShort>
        </div>
        <div>
          <Label as="p" size="medium" spacing>
            Opprettet:
          </Label>
          <BodyShort size="medium" spacing>
            {opprettet && formaterDatoForFrontend(opprettet)}
          </BodyShort>
        </div>
      </div>
      HELLO PELLO
    </div>
  );
};
