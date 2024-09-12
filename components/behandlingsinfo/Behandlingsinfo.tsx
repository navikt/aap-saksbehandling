import { BodyShort, HGrid, Label } from '@navikt/ds-react';
import styles from './Behandlingsinfo.module.css';
import { DetaljertBehandling } from 'lib/types/types';
import { storForbokstav } from 'lib/utils/string';
import { formaterDatoForFrontend } from 'lib/utils/date';

interface Props {
  behandling: DetaljertBehandling;
  saksId: string;
}

export const Behandlingsinfo = ({ behandling, saksId }: Props) => {
  return (
    <div className={styles.container}>
      <div className={styles.behandlingstype}>
        <Label as="p" size="medium" spacing>
          {behandling.type}
        </Label>
      </div>
      <HGrid columns={'1fr 1fr'} gap={'1'}>
        <Label as="p" size="medium" spacing>
          Behandlingsstatus:
        </Label>
        <BodyShort size="medium" spacing>
          {storForbokstav(behandling.status)}
        </BodyShort>
        <Label as="p" size="medium" spacing>
          Opprettet:
        </Label>
        <BodyShort size="medium" spacing>
          {formaterDatoForFrontend(behandling.opprettet)}
        </BodyShort>
        <Label as="p" size="medium" spacing>
          Saksnummer:
        </Label>
        <BodyShort size="medium" spacing>
          {saksId}
        </BodyShort>
      </HGrid>
    </div>
  );
};
