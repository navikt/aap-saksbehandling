import { BodyShort, HGrid, Label } from '@navikt/ds-react';
import styles from './Behandlingsinfo.module.css';
import { DetaljertBehandling } from 'lib/types/types';
import { storForbokstav } from 'lib/utils/string';
import { formaterDatoForFrontend } from 'lib/utils/date';
import { BrukerInformasjon } from '@navikt/aap-felles-utils';

interface Props {
  behandling: DetaljertBehandling;
  saksnummer: string;
  brukerInformasjon: BrukerInformasjon;
  oppgaveReservertAv?: string | null;
  påVent?: boolean;
}

export const Behandlingsinfo = ({ behandling, saksnummer, oppgaveReservertAv, påVent, brukerInformasjon }: Props) => {
  const status = () => {
    if (oppgaveReservertAv) {
      return `Reservert ${oppgaveReservertAv}`;
    } else if (påVent === true) {
      return 'På vent';
    }
    return 'Åpen';
  };

  const erReservertAvInnloggetBruker = brukerInformasjon.NAVident === oppgaveReservertAv;

  return (
    <div
      className={`${styles.container} ${oppgaveReservertAv && !erReservertAvInnloggetBruker ? styles.reservert : ''} ${påVent === true ? styles.venter : ''}`}
    >
      <div className={styles.behandlingstype}>
        <Label as="p" size="medium" spacing>
          {behandling.type}
        </Label>
      </div>
      <HGrid columns={'1fr 1fr'} gap={'1'}>
        <Label as="p" size="medium" spacing>
          Status:
        </Label>
        <BodyShort size="medium" spacing>
          {status()}
        </BodyShort>
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
          {saksnummer}
        </BodyShort>
      </HGrid>
    </div>
  );
};
