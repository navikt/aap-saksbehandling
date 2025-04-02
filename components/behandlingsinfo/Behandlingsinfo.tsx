import { BodyShort, Box, HGrid, HStack, Label, VStack } from '@navikt/ds-react';
import { DetaljertBehandling } from 'lib/types/types';
import { formaterDatoForFrontend } from 'lib/utils/date';
import { Behandlingsstatus } from 'components/behandlingsstatus/Behandlingsstatus';
import { OppgaveStatus, OppgaveStatusType } from 'components/oppgavestatus/OppgaveStatus';

import styles from './Behandlingsinfo.module.css';
import { BrukerInformasjon } from 'lib/services/azure/azureUserService';

interface Props {
  behandling: DetaljertBehandling;
  saksnummer: string;
  brukerInformasjon: BrukerInformasjon;
  oppgaveReservertAv?: string | null;
  påVent?: boolean;
}

export const Behandlingsinfo = ({ behandling, saksnummer, oppgaveReservertAv, påVent, brukerInformasjon }: Props) => {
  const erReservertAvInnloggetBruker = brukerInformasjon.NAVident === oppgaveReservertAv;
  const hentOppgaveStatus = (): OppgaveStatusType | undefined => {
    if (oppgaveReservertAv && !erReservertAvInnloggetBruker) {
      return { status: 'RESERVERT', label: `Reservert ${oppgaveReservertAv}` };
    } else if (påVent === true) {
      return { status: 'PÅ_VENT', label: 'På vent' };
    }
  };

  const oppgaveStatus = hentOppgaveStatus();

  return (
    <Box
      padding="4"
      borderWidth="1"
      borderRadius="large"
      borderColor="border-divider"
      className={styles.behandlingsinfo}
    >
      <VStack gap={'4'}>
        <HStack gap={'2'} align={'center'}>
          <Label as="p" size="medium">
            {behandling.type}
          </Label>
          <Behandlingsstatus status={behandling.status} />
          {oppgaveStatus && <OppgaveStatus oppgaveStatus={oppgaveStatus} />}
        </HStack>

        <HGrid columns={'1fr 1fr'} gap="1">
          <Label as="p" size={'small'}>
            Opprettet:
          </Label>
          <BodyShort size={'small'}>{formaterDatoForFrontend(behandling.opprettet)}</BodyShort>
          <Label as="p" size={'small'}>
            Saksnummer:
          </Label>
          <BodyShort size={'small'}>{saksnummer}</BodyShort>
        </HGrid>
      </VStack>
    </Box>
  );
};
