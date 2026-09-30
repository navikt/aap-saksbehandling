import { PencilIcon, TrashIcon } from '@navikt/aksel-icons';
import { BodyShort, Box, Button, Heading, HGrid, HStack, Label, VStack } from '@navikt/ds-react';
import { IdentOgNavn, Mottaker } from 'lib/types/types';
import { FjernMottakerDialog } from 'components/brevbygger/mottaker/FjernMottakerDialog';
import { useState } from 'react';
import { Distribusjonssjekk } from 'components/brevbygger/mottaker/Distribusjonssjekk';
import { Alert } from 'components/alert/Alert';

export const MottakerInfoCard = ({
  tittel,
  brevbestillingReferanse,
  bruker,
  mottaker,
  readOnly,
  redigerMottaker,
  fjernMottaker,
}: {
  tittel: string;
  brevbestillingReferanse: string;
  bruker: IdentOgNavn;
  mottaker?: Mottaker;
  readOnly: boolean;
  redigerMottaker: () => void;
  fjernMottaker?: () => void;
}) => {
  const [openFjernMottakerModal, setOpenFjernMottakerModal] = useState(false);

  if (!mottaker) {
    return null;
  }

  return (
    <Box background="default" padding={'space-16'}>
      <VStack gap="space-8" justify="space-between" height={'100%'}>
        <VStack gap="space-8">
          <Heading size={'small'} level="3">
            {tittel} {bruker.ident === mottaker.ident && '(bruker)'}
          </Heading>

          {mottaker.ident === bruker.ident && !mottaker.navnOgAdresse?.adresse
            ? brukerInfo(bruker)
            : mottakerInfo(mottaker)}
        </VStack>

        <VStack gap="space-8">
          {mottaker.ident && !mottaker.navnOgAdresse?.adresse ? (
            <Distribusjonssjekk readOnly={readOnly} referanse={brevbestillingReferanse} mottakerId={mottaker.ident} />
          ) : mottaker.navnOgAdresse?.adresse ? (
            <Alert variant="info" size="small">
              Sendes til oppgitt adresse
            </Alert>
          ) : (
            /* Burde ikke være teknisk mulig å ha denne tilstanden */
            <Alert variant="warning" size="small">
              Kan ikke sende til mottaker uten ident eller adresse
            </Alert>
          )}

          {!readOnly && (
            <HStack justify="end">
              {fjernMottaker && (
                <Button
                  type="button"
                  variant="tertiary"
                  data-color="danger"
                  size="small"
                  icon={<TrashIcon aria-hidden />}
                  onClick={() => setOpenFjernMottakerModal(true)}
                >
                  Fjern
                </Button>
              )}

              <Button
                type="button"
                variant="tertiary"
                size="small"
                icon={<PencilIcon aria-hidden />}
                onClick={redigerMottaker}
              >
                Endre
              </Button>
            </HStack>
          )}
        </VStack>
      </VStack>

      {fjernMottaker && (
        <FjernMottakerDialog
          open={openFjernMottakerModal}
          setOpen={setOpenFjernMottakerModal}
          fjernMottaker={() => {
            fjernMottaker();
            setOpenFjernMottakerModal(false);
          }}
        />
      )}
    </Box>
  );
};

const mottakerInfo = (mottaker: Mottaker) => {
  const adresse = mottaker.navnOgAdresse?.adresse;

  return (
    <HGrid columns={'1fr 4fr'} gap="space-8">
      {mottaker.navnOgAdresse ? (
        <>
          {mottaker.ident && (
            <>
              <Label size="small">Ident</Label>
              <BodyShort size="small">{mottaker.ident}</BodyShort>
            </>
          )}

          <Label size="small">Navn</Label>
          <BodyShort size="small">{mottaker.navnOgAdresse?.navn || 'Mangler navn'}</BodyShort>

          <Label size="small">Adresse</Label>
          <div>
            <BodyShort size="small">{adresse?.adresselinje1}</BodyShort>
            <BodyShort size="small">{adresse?.adresselinje2}</BodyShort>
            <BodyShort size="small">{adresse?.adresselinje3}</BodyShort>
            <BodyShort size="small">
              {adresse?.postnummer} {adresse?.poststed}
            </BodyShort>
          </div>

          {adresse?.landkode !== 'NO' && (
            <>
              <Label size="small">Landkode</Label>
              <BodyShort size="small">{adresse?.landkode}</BodyShort>
            </>
          )}
        </>
      ) : mottaker.ident ? (
        <>
          <Label size="small">Ident</Label>
          <BodyShort size="small">{mottaker.ident}</BodyShort>
        </>
      ) : (
        <>
          <Label size="small">Navn</Label>
          <BodyShort size="small">Mangler navn</BodyShort>

          <Label size="small">Adresse</Label>
          <BodyShort size="small">Mangler adresse</BodyShort>
        </>
      )}
    </HGrid>
  );
};

const brukerInfo = (bruker: IdentOgNavn) => {
  return (
    <HGrid columns={'1fr 4fr'} gap="space-8">
      <Label size="small">Ident</Label>
      <BodyShort size="small">{bruker.ident}</BodyShort>

      <Label size="small">Navn</Label>
      <BodyShort size="small">{bruker.navn}</BodyShort>
    </HGrid>
  );
};
