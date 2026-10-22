'use client';

import { ArrowRightLeftIcon, PersonPlusIcon, PlusIcon } from '@navikt/aksel-icons';
import { BodyShort, Box, Button, HGrid, HStack, VStack } from '@navikt/ds-react';
import { IdentOgNavn, Mottaker } from 'lib/types/types';
import { useState } from 'react';

import { clientOppdaterMottakere } from 'lib/clientApi';
import { MottakerInfoCard } from 'components/brevbygger/mottaker/MottakerInfoCard';
import { RedigerMottakerDialog } from 'components/brevbygger/mottaker/RedigerMottakerDialog';
import { isSuccess } from 'lib/utils/api';
import { Alert } from 'components/alert/Alert';

export enum MottakerType {
  HOVEDMOTTAKER = 'HOVEDMOTTAKER',
  KOPIMOTTAKER = 'KOPIMOTTAKER',
}

interface Props {
  bestillingsreferanse: string;
  readOnly: boolean;
  bruker: IdentOgNavn;
  initellMottaker: Mottaker;
  initiellKopimottaker?: Mottaker;
  fullmektig?: Mottaker;
  brevbygger: boolean;
}

function erSamme(mottaker1?: Mottaker, mottaker2?: Mottaker): boolean {
  if (!mottaker1 || !mottaker2) {
    return false;
  }
  return mottaker1.ident === mottaker2.ident || mottaker1.navnOgAdresse?.navn === mottaker2.navnOgAdresse?.navn;
}

function erGyldigFullmektig(fullmektig?: Mottaker, hovedmottaker?: Mottaker, kopimottaker?: Mottaker): boolean {
  if (!fullmektig) return false;
  const fullmektigErHovedmottaker = erSamme(fullmektig, hovedmottaker);
  const fullmektigErKopimottaker = erSamme(fullmektig, kopimottaker);

  return !fullmektigErHovedmottaker && !fullmektigErKopimottaker;
}

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
}: Props) {
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

              {fullmektig && fullmektigKanTilbys && (
                <HStack gap="space-8">
                  <Alert variant="info" size="small">
                    <BodyShort size="small">Det finnes fullmektig i denne saken</BodyShort>
                    <Button
                      type="button"
                      variant="tertiary"
                      size="xsmall"
                      icon={<PersonPlusIcon aria-hidden />}
                      onClick={() => leggTilFullmektig(MottakerType.HOVEDMOTTAKER)}
                    >
                      Sett som hovedmottaker
                    </Button>
                    <Button
                      type="button"
                      variant="tertiary"
                      size="xsmall"
                      icon={<PersonPlusIcon aria-hidden />}
                      onClick={() => leggTilFullmektig(MottakerType.KOPIMOTTAKER)}
                    >
                      Sett som kopimottaker
                    </Button>
                  </Alert>
                </HStack>
              )}
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
