import { BodyShort, Box, HGrid, HStack, Label, VStack } from '@navikt/ds-react';
import { DetaljertBehandling, Klageresultat, SaksInfo } from 'lib/types/types';
import { formaterDatoForFrontend } from 'lib/utils/date';
import { Behandlingsstatus } from 'components/behandlingsstatus/Behandlingsstatus';

import styles from './Behandlingsinfo.module.css';
import { formaterKlageresultat } from 'lib/utils/klageresultat';

interface Props {
  behandling: DetaljertBehandling;
  sak: SaksInfo;
  klageresultat?: Klageresultat;
}

export const Behandlingsinfo = ({ behandling, sak, klageresultat }: Props) => {
  const vedtaksdato = behandling.vedtaksdato;
  const erFørstegangsbehandlingEllerRevurdering =
    behandling.type === 'Førstegangsbehandling' || behandling.type === 'Revurdering';
  const erKlagebehandling = behandling.type === 'Klage';

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
          <BodyShort size={'small'}>{sak.saksnummer}</BodyShort>
          {erFørstegangsbehandlingEllerRevurdering && (
            <>
              <Label as="p" size={'small'}>
                Virkningstidspunkt{behandling.virkningstidspunkt == null && ' (foreløpig)'}:
              </Label>
              <BodyShort size={'small'}>
                {behandling.virkningstidspunkt == null
                  ? formaterDatoForFrontend(sak.periode.fom)
                  : formaterDatoForFrontend(behandling.virkningstidspunkt)}
              </BodyShort>
            </>
          )}
          {erKlagebehandling && (
            <>
              <Label as="p" size={'small'}>
                Resultat:
              </Label>
              <BodyShort size={'small'}>{formaterKlageresultat(klageresultat)}</BodyShort>
            </>
          )}
          {vedtaksdato && (
            <>
              <Label as="p" size={'small'}>
                Vedtaksdato:
              </Label>
              <BodyShort size={'small'}>{formaterDatoForFrontend(vedtaksdato)}</BodyShort>
            </>
          )}
        </HGrid>
      </VStack>
    </Box>
  );
};
