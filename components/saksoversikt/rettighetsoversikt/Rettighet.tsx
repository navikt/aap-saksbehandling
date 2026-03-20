import { BodyShort, Heading, HStack, VStack } from '@navikt/ds-react';
import { RettighetDto } from 'lib/types/types';
import { formaterDatoForFrontend, formaterPeriode } from 'lib/utils/date';

interface Props {
  rettighetsdata: RettighetDto;
}

enum Rettighetstype {
  BISTANDSBEHOV,
  SYKEPENGEERSTATNING,
  STUDENT,
  ARBEIDSSØKER,
  VURDERES_FOR_UFØRETRYGD,
}

export const Rettighet = ({ rettighetsdata }: Props) => {
  const erRettighetKvotebasert = [Rettighetstype.BISTANDSBEHOV, Rettighetstype.SYKEPENGEERSTATNING].includes(
    Rettighetstype[rettighetsdata.type]
  );

  return (
    <VStack marginBlock={'0 6'}>
      <Heading size="small">{hentRettighetstypeVisning(rettighetsdata)}</Heading>
      {erRettighetKvotebasert && (
        <VStack minWidth={'17rem'} marginBlock={'4 0'}>
          <HStack justify={'space-between'}>
            <BodyShort>Kvote</BodyShort>
            <BodyShort>{rettighetsdata.kvote}</BodyShort>
          </HStack>
          <HStack justify={'space-between'}>
            <BodyShort>Brukt til nå</BodyShort>
            <BodyShort>{rettighetsdata.bruktKvote}</BodyShort>
          </HStack>
          <HStack justify={'space-between'}>
            <BodyShort>Gjenstående</BodyShort>
            <BodyShort>{rettighetsdata.gjenværendeKvote}</BodyShort>
          </HStack>
          <HStack justify={'space-between'} marginBlock={'3 0'}>
            <BodyShort>Maksdato:</BodyShort>
            <BodyShort weight="semibold">
              {rettighetsdata.maksDato != null ? formaterDatoForFrontend(rettighetsdata.maksDato) : ''}
            </BodyShort>
          </HStack>
        </VStack>
      )}
      {!erRettighetKvotebasert && (
        <HStack justify={'space-between'}>
          <BodyShort>Rettighet</BodyShort>
          <BodyShort>{formaterPeriode(rettighetsdata.startDato, rettighetsdata.maksDato)}</BodyShort>
        </HStack>
      )}
    </VStack>
  );
};

function hentRettighetstypeVisning(rettighet: RettighetDto): string {
  switch (Rettighetstype[rettighet.type]) {
    case Rettighetstype.BISTANDSBEHOV:
      return '§11-6 Ordinær';
    case Rettighetstype.SYKEPENGEERSTATNING:
      return '§11-13 Sykepengeerstatning';
    case Rettighetstype.STUDENT:
      return '§11-14 Student';
    case Rettighetstype.ARBEIDSSØKER:
      return '§11-17 Arbeidsssøker';
    case Rettighetstype.VURDERES_FOR_UFØRETRYGD:
      return '§11-18 Vurderes for uføretrygd';
  }
}
