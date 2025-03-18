import { BodyShort, Box, HGrid, HStack, Label } from '@navikt/ds-react';
import styles from './Behandlingsinfo.module.css';
import { DetaljertBehandling } from 'lib/types/types';
import { formaterDatoForFrontend } from 'lib/utils/date';
import { BrukerInformasjon } from '@navikt/aap-felles-utils';
import { Behandlingsstatus } from 'components/behandlingsstatus/Behandlingsstatus';

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

  const hentClassName = () => {
    if (oppgaveReservertAv && !erReservertAvInnloggetBruker) {
      return styles.reservert;
    } else if (påVent) {
      return styles.venter;
    } else {
      return styles.behandlingsinfo;
    }
  };

  return (
    <Box padding="4" borderWidth="1" borderRadius="large" borderColor="border-divider" className={hentClassName()}>
      <Box>
        <HStack gap={'2'} align={'baseline'}>
          <Label as="p" size="medium" spacing>
            {behandling.type}
          </Label>
          <Behandlingsstatus status={behandling.status} />
        </HStack>
      </Box>

      <HGrid columns={'1fr 1fr'} gap="1">
        <Label as="p" size={'small'}>
          Status:
        </Label>
        <BodyShort size={'small'}>{status()}</BodyShort>
        <Label as="p" size={'small'}>
          Opprettet:
        </Label>
        <BodyShort size={'small'}>{formaterDatoForFrontend(behandling.opprettet)}</BodyShort>
        <Label as="p" size={'small'}>
          Saksnummer:
        </Label>
        <BodyShort size={'small'}>{saksnummer}</BodyShort>
      </HGrid>
    </Box>
  );
};
