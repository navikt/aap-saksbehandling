import { useState } from 'react';
import { clientHentUtsendingsinfo } from 'lib/dokumentClientApi';
import { isSuccess } from 'lib/utils/api';
import { Alert } from 'components/alert/Alert';
import { BodyShort, Button, Dialog, Heading, Label, Loader, VStack } from '@navikt/ds-react';
import { InformationSquareIcon } from '@navikt/aksel-icons';
import { formaterDatoMedTidspunktForFrontend } from 'lib/utils/date';
import { Utsendingsinfo } from 'lib/types/journalpost';

export const UtsendingsinfoDialog = ({ journalpostId }: { journalpostId: string }) => {
  const [visDialog, setVisDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();
  const [utsendingsinfo, setUtsendingsinfo] = useState<Utsendingsinfo>();

  const hent = async () => {
    setIsLoading(true);

    await clientHentUtsendingsinfo(journalpostId)
      .then((res) => {
        if (isSuccess(res)) setUtsendingsinfo(res.data.utsendingsinfo);
        else setError(res.apiException.message);
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <>
      <Button
        variant="tertiary"
        icon={<InformationSquareIcon />}
        size="small"
        title="Vis utsendingsinfo"
        onClick={() => {
          setVisDialog(true);
          hent();
        }}
      />

      <Dialog open={visDialog} onOpenChange={setVisDialog} aria-label="Utsendingsinfo">
        <Dialog.Popup>
          <Dialog.Header>
            <Heading size="small">Utsendingsinfo</Heading>
          </Dialog.Header>
          <Dialog.Body>
            {isLoading && <Loader size="small" />}
            {error && <Alert variant="error">{error || 'Ukjent feil oppsto'}</Alert>}
            {!isLoading && !error && <UtsendingsinfoVisning utsendingsinfo={utsendingsinfo} />}
          </Dialog.Body>
        </Dialog.Popup>
      </Dialog>
    </>
  );
};

const UtsendingsinfoVisning = ({ utsendingsinfo }: { utsendingsinfo?: Utsendingsinfo }) => {
  if (!utsendingsinfo) {
    return <BodyShort>Ingen utsendingsinfo tilgjengelig</BodyShort>;
  }

  const { varselSendt, fysiskpostSendt, digitalpostSendt } = utsendingsinfo;

  return (
    utsendingsinfo && (
      <VStack gap="space-16">
        <div>
          <Label>Varsel: </Label>
          {varselSendt?.map((varsel, index) => (
            <BodyShort key={index}>
              {varsel.type || 'Ukjent type'}
              {varsel.varslingstidspunkt && ` (${formaterDatoMedTidspunktForFrontend(varsel.varslingstidspunkt)})`}
            </BodyShort>
          )) || 'Ingen varsel sendt'}
        </div>
        {fysiskpostSendt?.adressetekstKonvolutt && (
          <div>
            <Label>Adresse: </Label>
            <BodyShort style={{ whiteSpace: 'pre-line' }}>{fysiskpostSendt?.adressetekstKonvolutt}</BodyShort>
          </div>
        )}
        {digitalpostSendt?.adresse && (
          <div>
            <Label>Digital postkasse: </Label>
            <BodyShort>{digitalpostSendt?.adresse}</BodyShort>
          </div>
        )}
      </VStack>
    )
  );
};
