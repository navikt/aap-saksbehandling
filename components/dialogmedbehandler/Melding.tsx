import { BodyShort, Box, Detail, HStack, Label, Link, VStack } from '@navikt/ds-react';
import {
  ArrowUndoIcon,
  CheckmarkHeavyIcon,
  ExclamationmarkTriangleIcon,
  PaperclipIcon,
  PlusIcon,
} from '@navikt/aksel-icons';
import { formatDatoMedMånedsnavn } from 'lib/utils/date';
import styles from './Melding.module.css';

interface Props {
  visningType: 'INNKOMMENDE' | 'UTGÅENDE';
  dokumentasjonType: 'L120' | 'L40' | 'L8' | 'MELDING_FRA_NAV' | 'PURRING' | 'RETUR_LEGEERKLÆRING';
  meldingFraNavn: string;
  opprettetTidspunkt: string;
  status: 'SENDT' | 'LEVERT' | 'FEILET';
  children: React.ReactNode;
}

export const Melding = ({
  visningType,
  dokumentasjonType,
  meldingFraNavn,
  opprettetTidspunkt,
  status,
  children,
}: Props) => {
  return (
    <VStack gap={'space-4'} align={visningType === 'INNKOMMENDE' ? 'start' : 'end'}>
      <Detail>
        <b>{meldingFraNavn}</b> {formatDatoMedMånedsnavn(opprettetTidspunkt)}
      </Detail>
      <Box
        className={
          visningType === 'INNKOMMENDE'
            ? styles.meldingboksInnkommende
            : `${styles.meldingboksUtgående} ${status === 'FEILET' && styles.meldingboksFeilet}`
        }
      >
        <VStack gap={'space-8'}>
          <VStack>
            <Label size={'small'}>{mapDokumentasjonTypeTilTekst(dokumentasjonType)}</Label>
            <BodyShort size={'small'}>{children}</BodyShort>
          </VStack>
          <Box className={styles.vedleggboks}>
            <Link inlineText={true} target="_blank" rel="noopener noreferrer">
              <HStack align={'center'} gap={'space-8'}>
                <PaperclipIcon title="Vedlagt fil" fontSize="2rem" className={styles.vedleggikon} />
                <BodyShort>{mapDokumentasjonTypeTilTekst(dokumentasjonType)}</BodyShort>
              </HStack>
            </Link>
          </Box>
          {visningType === 'INNKOMMENDE' && (
            <HStack gap={'space-20'}>
              <Link>
                <PlusIcon fontSize="1.5rem" aria-hidden />
                <BodyShort size={'small'}>Tilleggsopplysninger</BodyShort>
              </Link>
              <Link>
                <ArrowUndoIcon fontSize="1.5rem" aria-hidden />
                <BodyShort size={'small'}>Send i retur</BodyShort>
              </Link>
            </HStack>
          )}
        </VStack>
      </Box>
      {visningType === 'UTGÅENDE' && (
        <VStack align={'end'}>
          <HStack gap={'space-2'} align={'center'} className={status === 'FEILET' ? styles.feilmelding : ''}>
            {status === 'FEILET' ? (
              <ExclamationmarkTriangleIcon fontSize="1rem" aria-hidden />
            ) : (
              <CheckmarkHeavyIcon fontSize="1rem" aria-hidden />
            )}
            <Detail>{mapStatusTilTekst(status)}</Detail>
          </HStack>
        </VStack>
      )}
    </VStack>
  );
};

const mapDokumentasjonTypeTilTekst = (dokumentasjonType: Props['dokumentasjonType']) => {
  switch (dokumentasjonType) {
    case 'L120':
      return 'Legeerklæring L120';
    case 'L40':
      return 'Forespørsel om legeerklæring L40';
    case 'L8':
      return 'Legeerklæring L8';
    case 'MELDING_FRA_NAV':
      return 'Melding fra NAV';
    case 'PURRING':
      return 'Purring';
    case 'RETUR_LEGEERKLÆRING':
      return 'Retur legeerklæring';
    default:
      return dokumentasjonType;
  }
};

const mapStatusTilTekst = (status: Props['status']) => {
  switch (status) {
    case 'SENDT':
      return 'Sendt';
    case 'LEVERT':
      return 'Levert';
    case 'FEILET':
      return 'Feilet';
    default:
      return status;
  }
};
