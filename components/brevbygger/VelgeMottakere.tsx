'use client';

import { ArrowsUpDownIcon, PencilIcon, PersonIcon, PersonPlusIcon, PlusIcon, TrashIcon } from '@navikt/aksel-icons';
import {
  BodyLong,
  BodyShort,
  Button,
  Dialog,
  ExpansionCard,
  HGrid,
  HStack,
  InfoCard,
  Label,
  VStack,
} from '@navikt/ds-react';
import { Mottaker } from 'lib/types/types';
import { useEffect, useState } from 'react';

import { RedigerMottakerModal } from 'components/brevbygger/RedigerMottakerModal';
import { clientOppdaterMottakere } from 'lib/clientApi';

type RedigerTarget = 'HOVEDMOTTAKER' | 'KOPIMOTTAKER';

interface Props {
  bestillingsreferanse: string;
  setMottakere: (mottakere: Mottaker[]) => void;
  readOnly: boolean;
  mottaker: Mottaker;
  kopimottaker?: Mottaker;
  fullmektig?: Mottaker;
}

function mottakerNavn(mottaker: Mottaker): string {
  return mottaker.navnOgAdresse?.navn ?? mottaker.ident ?? 'Ukjent mottaker';
}

export function VelgeMottakere({
  bestillingsreferanse,
  setMottakere,
  readOnly,
  mottaker,
  kopimottaker,
  fullmektig,
}: Props) {
  const [hovedmottaker, setHovedmottaker] = useState<Mottaker>(mottaker);
  const [kopi, setKopi] = useState<Mottaker | undefined>(kopimottaker);
  const [redigerTarget, setRedigerTarget] = useState<RedigerTarget | undefined>(undefined);
  const [open, setOpen] = useState(false);

  console.log('hovedmottaker', hovedmottaker);

  useEffect(() => {
    setMottakere(kopi ? [hovedmottaker, kopi] : [hovedmottaker]);
  }, [hovedmottaker, kopi, setMottakere]);

  const byttHovedOgKopimottaker = () => {
    if (!kopi) {
      return;
    }
    setHovedmottaker(kopi);
    setKopi(hovedmottaker);
  };

  const settFullmektigSomHovedmottaker = () => {
    if (!fullmektig) {
      return;
    }
    // Forrige hovedmottaker (bruker) settes automatisk på kopi, slik at brukeren fortsatt får brevet.
    setKopi(hovedmottaker);
    setHovedmottaker(fullmektig);
  };

  const leggTilFullmektigSomKopimottaker = () => {
    if (!fullmektig) {
      return;
    }
    setKopi(fullmektig);
  };

  const fjernKopimottaker = () => {
    setKopi(undefined);
    setOpen(false);
  };

  const lagreRedigertMottaker = (redigertMottaker: Mottaker) => {
    if (redigerTarget === 'HOVEDMOTTAKER') {
      setHovedmottaker(redigertMottaker);
      clientOppdaterMottakere(bestillingsreferanse, redigertMottaker, kopi);
    } else if (redigerTarget === 'KOPIMOTTAKER') {
      setKopi(redigertMottaker);
      clientOppdaterMottakere(bestillingsreferanse, hovedmottaker, redigertMottaker);
    }
  };

  const fullmektigErHovedmottaker = fullmektig === hovedmottaker;
  const fullmektigErKopimottaker = fullmektig === kopi;
  const fullmektigKanTilbys = !!fullmektig && !fullmektigErHovedmottaker && !fullmektigErKopimottaker;
  const antallMottakere = [hovedmottaker, kopi].filter(Boolean).length;

  return (
    <>
      <ExpansionCard aria-label="Mottakere" size={'small'} defaultOpen={true}>
        <ExpansionCard.Header>
          <ExpansionCard.Title size={'small'}>Mottakere ({antallMottakere})</ExpansionCard.Title>
        </ExpansionCard.Header>
        <ExpansionCard.Content>
          <VStack gap="space-16">
            <HGrid columns={2} gap={'space-12 space-24'}>
              <MottakerInfoCard
                tittel="Hovedmottaker"
                mottaker={hovedmottaker}
                readOnly={readOnly}
                redigerMottaker={() => setRedigerTarget('HOVEDMOTTAKER')}
              />

              {kopi ? (
                <MottakerInfoCard
                  tittel="Kopimottaker"
                  mottaker={kopi}
                  readOnly={readOnly}
                  redigerMottaker={() => setRedigerTarget('KOPIMOTTAKER')}
                  fjernMottaker={() => setOpen(true)}
                />
              ) : (
                !readOnly && (
                  <div>
                    <Button
                      type="button"
                      variant="secondary"
                      icon={<PlusIcon aria-hidden />}
                      size="small"
                      onClick={() => setRedigerTarget('KOPIMOTTAKER')}
                    >
                      Legg til kopimottaker
                    </Button>
                  </div>
                )
              )}

              {!readOnly && (
                <HStack gap="space-8">
                  {kopi && (
                    <Button
                      type="button"
                      variant="tertiary"
                      size="small"
                      icon={<ArrowsUpDownIcon aria-hidden />}
                      onClick={byttHovedOgKopimottaker}
                    >
                      Bytt med kopimottaker
                    </Button>
                  )}
                </HStack>
              )}
            </HGrid>

            {!readOnly && fullmektig && fullmektigKanTilbys && (
              <HStack gap="space-8">
                <Button
                  type="button"
                  variant="tertiary"
                  size="small"
                  icon={<PersonPlusIcon aria-hidden />}
                  onClick={leggTilFullmektigSomKopimottaker}
                >
                  Legg til {mottakerNavn(fullmektig)} som kopimottaker
                </Button>
                <Button type="button" variant="tertiary" size="small" onClick={settFullmektigSomHovedmottaker}>
                  Sett {mottakerNavn(fullmektig)} som hovedmottaker
                </Button>
              </HStack>
            )}
          </VStack>
        </ExpansionCard.Content>
      </ExpansionCard>

      <RedigerMottakerModal
        open={redigerTarget !== undefined}
        tittel={redigerTarget === 'HOVEDMOTTAKER' ? 'Rediger hovedmottaker' : 'Rediger kopimottaker'}
        mottaker={redigerTarget === 'HOVEDMOTTAKER' ? hovedmottaker : kopi}
        onClose={() => setRedigerTarget(undefined)}
        onLagre={lagreRedigertMottaker}
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <Dialog.Popup id="dialog-fjern-kopimottaker">
          <Dialog.Header>
            <Dialog.Title>Fjern kopimottaker</Dialog.Title>
          </Dialog.Header>
          <Dialog.Body>
            <BodyLong>Er du sikker på at du vil fjerne kopimottakeren?</BodyLong>
          </Dialog.Body>
          <Dialog.Footer>
            <Dialog.CloseTrigger>
              <Button variant="secondary">Nei, avbryt</Button>
            </Dialog.CloseTrigger>
            <Button variant="danger" onClick={fjernKopimottaker}>
              Ja, fjern
            </Button>
          </Dialog.Footer>
        </Dialog.Popup>
      </Dialog>
    </>
  );
}

const MottakerInfoCard = ({
  tittel,
  mottaker,
  readOnly,
  redigerMottaker,
  fjernMottaker,
}: {
  tittel: string;
  mottaker?: Mottaker;
  readOnly: boolean;
  redigerMottaker: () => void;
  fjernMottaker?: () => void;
}) => {
  if (!mottaker) {
    return null;
  }

  const adresse = mottaker.navnOgAdresse?.adresse;

  return (
    <InfoCard data-color="neutral" size="small">
      <InfoCard.Header icon={<PersonIcon aria-hidden />}>
        <InfoCard.Title>{tittel}</InfoCard.Title>
      </InfoCard.Header>
      <InfoCard.Content>
        <VStack gap="space-8">
          {mottaker.navnOgAdresse && (
            <HGrid columns={'1fr 4fr'} gap="space-8">
              <Label size="small">Ident</Label>
              <BodyShort size="small">{mottaker.ident}</BodyShort>

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
            </HGrid>
          )}

          {!readOnly && (
            <HStack justify="end">
              {!readOnly && fjernMottaker && (
                <Button
                  type="button"
                  variant="tertiary"
                  data-color="danger"
                  size="small"
                  icon={<TrashIcon aria-hidden />}
                  onClick={fjernMottaker}
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
                Rediger
              </Button>
            </HStack>
          )}
        </VStack>
      </InfoCard.Content>
    </InfoCard>
  );
};
