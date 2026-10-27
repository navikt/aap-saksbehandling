'use client';

import { ArrowRightLeftIcon, PlusIcon } from '@navikt/aksel-icons';
import { Box, Button, HGrid, HStack, VStack } from '@navikt/ds-react';
import { Mottaker } from 'lib/types/types';
import { useState } from 'react';

import { clientOppdaterMottakere } from 'lib/clientApi';
import { MottakerInfoCard } from 'components/brevbygger/mottaker/MottakerInfoCard';
import { RedigerMottakerDialog } from 'components/brevbygger/mottaker/RedigerMottakerDialog';
import { isSuccess } from 'lib/utils/api';
import { Alert } from 'components/alert/Alert';
import { LeggTilFullmektigKnapp, MottakerType, VelgMottakereProps } from 'components/brevbygger/mottaker/VelgMottakere';
import { erGyldigFullmektig } from 'lib/utils/brevmottakere';

/**
 * Duplikat av VelgMottakere som brukes i [Brevbygger.tsx] med styling tilpasset gammel løsning.
 * Kan skrotes når vi er helt over på ny brevbygger.
 **/
export function VelgMottakere_SkriveBrev({
  bestillingsreferanse,
  readOnly,
  bruker,
  initellMottaker,
  initiellKopimottaker,
  fullmektig,
}: VelgMottakereProps) {
  const [hovedmottaker, setHovedmottaker] = useState<Mottaker>(initellMottaker);
  const [kopimottaker, setKopimottaker] = useState<Mottaker | undefined>(initiellKopimottaker);

  const [redigerDialogIsOpen, setRedigerDialogIsOpen] = useState(false);
  const [redigerMottakerType, setRedigerMottakerType] = useState<MottakerType>(MottakerType.HOVEDMOTTAKER);

  const [oppdaterMottakereFeilmelding, setOppdaterMottakereFeilmelding] = useState<string>();

  const byttHovedOgKopimottaker = () => {
    if (!kopimottaker) {
      return;
    }
    oppdaterMottakere(kopimottaker, hovedmottaker);
  };

  const leggTilFullmektig = (type: MottakerType) => {
    if (!fullmektig) {
      return;
    }
    if (type === MottakerType.HOVEDMOTTAKER) {
      if (kopimottaker) {
        setOppdaterMottakereFeilmelding(
          'Kan ikke legge til fullmektig som hovedmottaker når det allerede finnes en kopimottaker'
        );
        return;
      } else {
        oppdaterMottakere(fullmektig, hovedmottaker);
      }
    } else if (type === MottakerType.KOPIMOTTAKER) {
      oppdaterMottakere(hovedmottaker, fullmektig);
    }
  };

  const leggTilKopimottaker = () => {
    setRedigerMottakerType(MottakerType.KOPIMOTTAKER);
    setRedigerDialogIsOpen(true);
  };

  const fjernKopimottaker = () => {
    oppdaterMottakere(hovedmottaker, undefined);
  };

  const lagreRedigertMottaker = (type: MottakerType, redigertMottaker: Mottaker) => {
    if (type === MottakerType.HOVEDMOTTAKER) {
      oppdaterMottakere(redigertMottaker, kopimottaker);
    } else if (type === MottakerType.KOPIMOTTAKER) {
      oppdaterMottakere(hovedmottaker, redigertMottaker);
    }
  };

  const oppdaterMottakere = (hovedmottaker: Mottaker, kopimottaker?: Mottaker) => {
    setOppdaterMottakereFeilmelding(undefined);
    clientOppdaterMottakere(bestillingsreferanse, hovedmottaker, kopimottaker).then((res) => {
      if (isSuccess(res)) {
        setHovedmottaker(hovedmottaker);
        setKopimottaker(kopimottaker);
      } else {
        setOppdaterMottakereFeilmelding('Feil ved oppdatering av mottakere');
      }
    });
  };

  const fullmektigKanTilbys = erGyldigFullmektig(fullmektig, hovedmottaker, kopimottaker);
  const visKopiKolonne = !!kopimottaker || !readOnly;

  return (
    <>
      <Box>
        <VStack gap="space-12">
          <HGrid columns={visKopiKolonne ? '1fr 1fr' : '1fr'} gap="space-12">
            <MottakerInfoCard
              tittel="Hovedmottaker"
              brevbestillingReferanse={bestillingsreferanse}
              bruker={bruker}
              mottaker={hovedmottaker}
              redigerMottaker={() => {
                setRedigerMottakerType(MottakerType.HOVEDMOTTAKER);
                setRedigerDialogIsOpen(true);
              }}
              readOnly={readOnly}
            />

            {kopimottaker ? (
              <MottakerInfoCard
                tittel="Kopimottaker"
                brevbestillingReferanse={bestillingsreferanse}
                bruker={bruker}
                mottaker={kopimottaker}
                redigerMottaker={() => {
                  setRedigerMottakerType(MottakerType.KOPIMOTTAKER);
                  setRedigerDialogIsOpen(true);
                }}
                readOnly={readOnly}
                fjernMottaker={fjernKopimottaker}
              />
            ) : (
              !readOnly && (
                <Box background="default" padding="space-16">
                  <VStack height="100%" justify="center">
                    <HStack justify="center">
                      <Button
                        type="button"
                        variant="tertiary"
                        icon={<PlusIcon aria-hidden />}
                        size="small"
                        onClick={leggTilKopimottaker}
                      >
                        Legg til kopimottaker
                      </Button>
                    </HStack>
                  </VStack>
                </Box>
              )
            )}
          </HGrid>

          {!readOnly && (
            <HStack gap="space-8" justify="center">
              {kopimottaker && (
                <div>
                  <Button
                    type="button"
                    variant="tertiary"
                    size="small"
                    icon={<ArrowRightLeftIcon aria-hidden />}
                    onClick={byttHovedOgKopimottaker}
                    title="Sett hovedmottaker som kopimottaker og kopimottaker som hovedmottaker"
                  >
                    Bytt
                  </Button>
                </div>
              )}

              {fullmektigKanTilbys && <LeggTilFullmektigKnapp action={leggTilFullmektig} />}
            </HStack>
          )}

          {oppdaterMottakereFeilmelding && (
            <Alert variant="error" size="small">
              Feil oppsto ved oppdatering av mottaker. Prøv igjen om litt.
            </Alert>
          )}
        </VStack>
      </Box>

      {redigerMottakerType && redigerDialogIsOpen && (
        <RedigerMottakerDialog
          target={redigerMottakerType}
          onLagre={(type, mottaker) => lagreRedigertMottaker(type, mottaker)}
          mottaker={redigerMottakerType === MottakerType.HOVEDMOTTAKER ? hovedmottaker : kopimottaker}
          setIsOpen={setRedigerDialogIsOpen}
        />
      )}
    </>
  );
}
