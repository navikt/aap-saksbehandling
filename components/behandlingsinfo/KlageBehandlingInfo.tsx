import { BodyShort, Box, HGrid, Label, VStack } from '@navikt/ds-react';
import { KabalKlageResultat } from 'lib/types/types';
import { formaterDatoForFrontend } from 'lib/utils/date';
import styles from 'components/behandlingsinfo/Behandlingsinfo.module.css';
import { formaterSvartype, formaterUtfall } from 'lib/utils/svarfraandreinstans';

interface Props {
  kabalKlageResultat?: KabalKlageResultat;
}

export const KlageBehandlingInfo = ({ kabalKlageResultat }: Props) => {
  const harHendelserFraKabal =
    kabalKlageResultat?.svarFraAndreinstans && kabalKlageResultat?.svarFraAndreinstans.length > 0;
  return (
    harHendelserFraKabal && (
      <Box
        padding="4"
        borderWidth="1"
        borderRadius="large"
        borderColor="border-divider"
        className={styles.behandlingsinfo}
      >
        <VStack gap={'4'}>
          <Label>KA resultater</Label>
          {kabalKlageResultat?.svarFraAndreinstans?.map((resultat, index) => {
            return (
              <Box key={index} className={index !== 0 ? styles.klageBehandlingResultatMedSkillelinje : ''}>
                <HGrid columns={'1fr 1fr'} gap="1">
                  <Label as="p" size={'small'}>
                    Resultat:
                  </Label>
                  <BodyShort size={'small'}>{formaterSvartype(resultat.type)}</BodyShort>

                  {resultat.utfall && (
                    <>
                      <Label as="p" size={'small'}>
                        Utfall:
                      </Label>
                      <BodyShort size={'small'}>{formaterUtfall(resultat.utfall)}</BodyShort>
                    </>
                  )}
                  {resultat.opprettetTidspunkt && (
                    <>
                      <Label as="p" size={'small'}>
                        Opprettet:
                      </Label>
                      <BodyShort size={'small'}>{formaterDatoForFrontend(resultat.opprettetTidspunkt)}</BodyShort>
                    </>
                  )}
                  {resultat.avsluttetTidspunkt && (
                    <>
                      <Label as="p" size={'small'}>
                        Avsluttet:
                      </Label>
                      <BodyShort size={'small'}>{formaterDatoForFrontend(resultat.avsluttetTidspunkt)}</BodyShort>
                    </>
                  )}
                  {resultat.feilregistrertBegrunnelse && (
                    <>
                      <Label as="p" size={'small'}>
                        Begrunnelse:
                      </Label>
                      <BodyShort size={'small'}>{resultat.feilregistrertBegrunnelse}</BodyShort>
                    </>
                  )}
                </HGrid>
              </Box>
            );
          })}
        </VStack>
      </Box>
    )
  );
};
