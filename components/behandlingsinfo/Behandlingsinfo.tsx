import { BodyShort, Box, HGrid, Label } from '@navikt/ds-react';
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
    <Box
      padding="4"
      borderWidth="1"
      borderRadius="large"
      borderColor="border-divider"
      className={`${oppgaveReservertAv && !erReservertAvInnloggetBruker ? styles.reservert : ''} ${påVent === true ? styles.venter : ''}`}
    >
      <Box borderWidth="0 0 1 0" borderColor="border-divider" marginBlock="0 4">
        <Label as="p" size="medium" spacing>
          {behandling.type}
        </Label>
      </Box>

      <HGrid columns={'1fr 1fr'} gap="4">
        <Label as="p">
          Status:
        </Label>
        <BodyShort>
          {status()}
        </BodyShort>
        <Label as="p">
          Behandlingsstatus:
        </Label>
        <BodyShort>
          {storForbokstav(behandling.status)}
        </BodyShort>
        <Label as="p">
          Opprettet:
        </Label>
        <BodyShort>
          {formaterDatoForFrontend(behandling.opprettet)}
        </BodyShort>
        <Label as="p">
          Saksnummer:
        </Label>
        <BodyShort>
          {saksnummer}
        </BodyShort>
      </HGrid>
    </Box>
  );
};
