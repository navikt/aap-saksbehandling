import { BodyShort, Box, HGrid, HStack, Label, VStack } from '@navikt/ds-react';
import { DetaljertBehandling } from 'lib/types/types';
import { formaterDatoForFrontend } from 'lib/utils/date';
import { Behandlingsstatus } from 'components/behandlingsstatus/Behandlingsstatus';

import styles from './Behandlingsinfo.module.css';

interface Props {
  behandling: DetaljertBehandling;
  saksnummer: string;
}

export const Behandlingsinfo = ({ behandling, saksnummer }: Props) => {
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
                    <Label as="p" size={'small'}>
                        Virkningstidspunkt:
                    </Label>
                    <BodyShort size={'small'}>{behandling.virkningstidspunkt == null ? formaterDatoForFrontend(behandling.opprettet) : formaterDatoForFrontend(behandling.virkningstidspunkt)}</BodyShort>
                </HGrid>
            </VStack>
        </Box>
    );
};
