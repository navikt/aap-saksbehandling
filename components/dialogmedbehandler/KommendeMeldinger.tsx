import { BodyShort, Box, Detail, HStack, Label, Link, VStack } from '@navikt/ds-react';
import { XMarkOctagonIcon } from '@navikt/aksel-icons';
import styles from './KommendeMeldinger.module.css';
import { formatDatoMedMånedsnavn } from 'lib/utils/date';

const kommendeMeldingerMock = [
  {
    dato: '2026-07-09',
    tittel: 'Automatisk påminnelse',
    tekst: 'Sendes til legen dersom svar ikke er mottatt innen 9. juli 2026',
  },
];

export const KommendeMeldinger = () => {
  return (
    <VStack>
      <HStack gap={'space-12'} align={'center'}>
        <span className={styles.stipletLinje} />
        <Detail className={styles.stipletLinjeTekst}>Kommende</Detail>
        <span className={styles.stipletLinje} />
      </HStack>

      {kommendeMeldingerMock.map((kommendeMelding, index) => (
        <VStack key={index} gap={'space-4'} align={'end'} className={styles.meldingboksWrapper}>
          <Detail align={'end'}>Blir sendt automatisk {formatDatoMedMånedsnavn(kommendeMelding.dato)}</Detail>
          <Box className={styles.meldingboks}>
            <VStack gap={'space-8'}>
              <VStack>
                <Label size={'small'}>{kommendeMelding.tittel}</Label>
                <BodyShort size={'small'}>{kommendeMelding.tekst}</BodyShort>
              </VStack>
              <Box>
                <HStack align={'center'} gap={'space-4'}>
                  <Link>
                    <XMarkOctagonIcon fontSize="1.2rem" aria-hidden />
                    <BodyShort size={'small'}>Avbryt påminnelse</BodyShort>
                  </Link>
                </HStack>
              </Box>
            </VStack>
          </Box>
        </VStack>
      ))}
    </VStack>
  );
};
