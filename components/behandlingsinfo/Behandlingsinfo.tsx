import { BodyShort, HGrid, Label } from '@navikt/ds-react';
import styles from './Behandlingsinfo.module.css';
import { DetaljertBehandling } from 'lib/types/types';

interface Props {
  behandling: DetaljertBehandling;
}

export const Behandlingsinfo = ({ behandling }: Props) => {
  return (
    <div className={styles.container}>
      <div className={styles.behandlingstype}>
        <Label as="p" size="medium" spacing>
          {behandling.type}
        </Label>
      </div>
      <HGrid columns={'1fr 1fr'}>
        <Label as="p" size="medium" spacing>
          Behandlingsstatus:
        </Label>
        <BodyShort size="medium" spacing>
          {behandling.status}
        </BodyShort>
        <Label as="p" size="medium" spacing>
          Opprettet:
        </Label>
        <BodyShort size="medium" spacing>
          {behandling.opprettet}
        </BodyShort>
      </HGrid>
    </div>
  );
};
