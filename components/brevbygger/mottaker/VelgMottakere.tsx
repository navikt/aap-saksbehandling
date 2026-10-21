'use client';

import { ArrowRightLeftIcon, PersonPlusIcon, PlusIcon } from '@navikt/aksel-icons';
import { BodyShort, Box, Button, Heading, HGrid, HStack, Tag, VStack } from '@navikt/ds-react';
import { IdentOgNavn, Mottaker } from 'lib/types/types';
import { useState } from 'react';

import { clientOppdaterMottakere } from 'lib/clientApi';
import { MottakerInfoCard } from 'components/brevbygger/mottaker/MottakerInfoCard';
import { RedigerMottakerDialog } from 'components/brevbygger/mottaker/RedigerMottakerDialog';
import { isSuccess } from 'lib/utils/api';
import { capitalize } from 'lodash';
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
}

function formaterNavn(navn?: string): string | undefined {
  if (!navn) return undefined;
  else
    return navn
      .split(' ')
      .map((del) => capitalize(del))
      .join(' ');
}

function mottakerErBrukerUtenAdresse(mottaker: Mottaker, bruker: IdentOgNavn): boolean {
  return mottaker.ident === bruker.ident && !mottaker.navnOgAdresse?.adresse;
}

function erGyldigFullmektig(fullmektig?: Mottaker, hovedmottaker?: Mottaker, kopimottaker?: Mottaker): boolean {
  if (!fullmektig) return false;
  const fullmektigErHovedmottaker =
    fullmektig.ident === hovedmottaker?.ident || fullmektig.navnOgAdresse?.navn === hovedmottaker?.navnOgAdresse?.navn;
  const fullmektigErKopimottaker =
    fullmektig.ident === kopimottaker?.ident || fullmektig.navnOgAdresse?.navn === kopimottaker?.navnOgAdresse?.navn;

  return !fullmektigErHovedmottaker && !fullmektigErKopimottaker;
}

export function VelgMottakere({
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
  const antallMottakere = [hovedmottaker, kopimottaker].filter(Boolean).length;

  return (
    <>
      <Box
        borderWidth="1"
        borderRadius="12"
        paddingInline="space-16"
        paddingBlock="space-8"
        borderColor="neutral-subtle"
        background="default"
      >
        <VStack gap="space-8" justify="space-evenly">
          <Heading level="2" size="small">
            {antallMottakere === 1 ? 'Mottaker' : `Mottakere (${antallMottakere})`}
          </Heading>

          {mottakerErBrukerUtenAdresse(hovedmottaker, bruker) ? (
            <BodyShort size="small">{formaterNavn(bruker.navn)}</BodyShort>
          ) : (
            <BodyShort size="small">{formaterNavn(hovedmottaker.navnOgAdresse?.navn)}</BodyShort>
          )}
          {kopimottaker && (
            <BodyShort size="small">
              {mottakerErBrukerUtenAdresse(kopimottaker, bruker)
                ? formaterNavn(bruker.navn)
                : formaterNavn(kopimottaker.navnOgAdresse?.navn)}{' '}
              <Tag variant="alt1" size="xsmall">
                Kopi
              </Tag>
            </BodyShort>
          )}

          {!readOnly && (
            <>
              {kopimottaker ? (
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
              ) : (
                <div>
                  <Button
                    type="button"
                    variant="tertiary"
                    icon={<PlusIcon aria-hidden />}
                    size="small"
                    onClick={leggTilKopimottaker}
                  >
                    Legg til kopimottaker
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
            </>
          )}
        </VStack>
      </Box>

      <VStack gap="space-16" marginInline="space-16 space-0">
        <HGrid columns={2} gap={'space-12'}>
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

          {kopimottaker && (
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
          )}
        </HGrid>

        {oppdaterMottakereFeilmelding && (
          <Alert variant="error" size="small">
            Feil oppsto ved oppdatering av mottaker. Prøv igjen om litt.
          </Alert>
        )}
      </VStack>

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
