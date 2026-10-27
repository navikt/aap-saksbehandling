import { useState } from 'react';
import { HentUtsendingsinfoResponse } from 'lib/types/journalpost';
import { clientHentUtsendingsinfo } from 'lib/dokumentClientApi';
import { isSuccess } from 'lib/utils/api';
import { Alert } from 'components/alert/Alert';
import { BodyShort, Button, Dialog, Heading, Label, Loader, VStack } from '@navikt/ds-react';
import { InformationSquareIcon } from '@navikt/aksel-icons';
import { formaterDatoMedTidspunktForFrontend } from 'lib/utils/date';

export const Utsendingsinfo = ({ journalpostId }: { journalpostId: string }) => {
  const [visDialog, setVisDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();
  const [utsendingsinfo, setUtsendingsinfo] = useState<HentUtsendingsinfoResponse>();

  const hent = async () => {
    setIsLoading(true);

    await clientHentUtsendingsinfo(journalpostId)
      .then((res) => {
        if (isSuccess(res)) setUtsendingsinfo(res.data);
        else setError(res.apiException.message);
      })
      .finally(() => setIsLoading(false));
  };

  if (error) {
    return <Alert variant="error">{error || 'Ukjent feil oppsto'}</Alert>;
  }

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
            {utsendingsinfo && (
              <VStack gap="space-16">
                <div>
                  <Label>Varsel: </Label>
                  <BodyShort>
                    {utsendingsinfo.utsendingsinfo?.varselSendt?.type || 'Ingen'}
                    {utsendingsinfo.utsendingsinfo?.varselSendt?.varslingstidspunkt &&
                      ` (${formaterDatoMedTidspunktForFrontend(utsendingsinfo.utsendingsinfo?.varselSendt?.varslingstidspunkt)})`}
                  </BodyShort>
                </div>
                {utsendingsinfo.utsendingsinfo?.fysiskpostSendt?.adressetekstKonvolutt && (
                  <div>
                    <Label>Adresse: </Label>
                    <BodyShort style={{ whiteSpace: 'pre-line' }}>
                      {utsendingsinfo.utsendingsinfo?.fysiskpostSendt?.adressetekstKonvolutt}
                    </BodyShort>
                  </div>
                )}
                {utsendingsinfo.utsendingsinfo?.digitalpostSendt?.adresse && (
                  <div>
                    <Label>Digital postkasse: </Label>
                    <BodyShort>{utsendingsinfo.utsendingsinfo?.digitalpostSendt?.adresse}</BodyShort>
                  </div>
                )}
              </VStack>
            )}
          </Dialog.Body>
        </Dialog.Popup>
      </Dialog>
    </>
  );
};
