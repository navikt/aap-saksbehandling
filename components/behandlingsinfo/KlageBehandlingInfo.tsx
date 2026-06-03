import { BodyShort, Box, HGrid, Label, VStack } from '@navikt/ds-react';
import { KabalKlageResultat, Klageresultat } from 'lib/types/types';
import { formaterDatoForFrontend } from 'lib/utils/date';
import styles from 'components/behandlingsinfo/Behandlingsinfo.module.css';
import { formaterSvartype, formaterUtfall } from 'lib/utils/svarfraandreinstans';
import { FetchResponse, isError } from 'lib/utils/api';
import { KelvinAlert } from 'components/alert/KelvinAlert';

interface Props {
  kabalKlageResultat?: FetchResponse<KabalKlageResultat>;
  klageresultat?: Klageresultat;
}

export const KlageBehandlingInfo = ({ kabalKlageResultat }: Props) => {
  if (isError(kabalKlageResultat)) {
    return (
      <KelvinAlert variant="warning">
        Kunne ikke hente klagebehandlingsinformasjon fra Kabal: <br />
        {kabalKlageResultat.apiException.message}
      </KelvinAlert>
    );
  }

  const svarFraAndreinstans = kabalKlageResultat?.data?.svarFraAndreinstans;

  return (
    <VStack gap={'space-16'}>
      <Label>Svar fra Nav klageinstans</Label>
      {!svarFraAndreinstans?.length ? (
        <Box>
          <HGrid columns={'1fr 1fr'} gap="space-4">
            <BodyShort size={'small'}>Venter på svar</BodyShort>
          </HGrid>
        </Box>
      ) : (
        svarFraAndreinstans?.map((resultat, index) => {
          return (
            <Box key={index} className={styles.klagebehandling}>
              <HGrid columns={'1fr 1fr'} gap="space-4">
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
  );
};
