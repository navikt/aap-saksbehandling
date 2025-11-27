import { Alert, BodyShort, Box, HGrid, Label, VStack } from '@navikt/ds-react';
import { KabalKlageResultat, Klageresultat } from 'lib/types/types';
import { formaterDatoForFrontend } from 'lib/utils/date';
import styles from 'components/behandlingsinfo/Behandlingsinfo.module.css';
import { formaterSvartype, formaterUtfall } from 'lib/utils/svarfraandreinstans';
import { FetchResponse, isError } from 'lib/utils/api';

interface Props {
  kabalKlageResultat?: FetchResponse<KabalKlageResultat>;
  klageresultat?: Klageresultat;
}

export const KlageBehandlingInfo = ({ kabalKlageResultat, klageresultat }: Props) => {
  if (isError(kabalKlageResultat)) {
    return (
      <Alert variant="warning">
        Kunne ikke hente klagebehandlingsinformasjon fra Kabal: <br />
        {kabalKlageResultat.apiException.message}
      </Alert>
    );
  }

  const svarFraAndreinstans = kabalKlageResultat?.data?.svarFraAndreinstans;
  const skalVises = klageresultat && ['OPPRETTHOLDES', 'DELVIS_OMGJØRES'].includes(klageresultat.type);

  return (
    skalVises && (
      <Box
        padding="4"
        borderWidth="1"
        borderRadius="large"
        borderColor="border-divider"
        className={styles.behandlingsinfo}
      >
        <VStack gap={'4'}>
          <Label>Svar fra Nav klageinstans</Label>
          {!svarFraAndreinstans?.length ? (
            <Box>
              <HGrid columns={'1fr 1fr'} gap="1">
                <BodyShort size={'small'}>Venter på svar</BodyShort>
              </HGrid>
            </Box>
          ) : (
            svarFraAndreinstans?.map((resultat, index) => {
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
            })
          )}
        </VStack>
      </Box>
    )
  );
};
