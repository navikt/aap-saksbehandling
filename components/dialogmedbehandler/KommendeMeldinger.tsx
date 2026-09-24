import { BodyShort, Box, Button, Detail, HStack, Label, VStack } from '@navikt/ds-react';
import { XMarkOctagonIcon } from '@navikt/aksel-icons';
import styles from './KommendeMeldinger.module.css';
import { formatDatoMedMånedsnavn } from 'lib/utils/date';
import { KommendeMeldingDto } from '../../lib/types/types';
import { clientAvbrytPåminnelsePåLegeerklæring, clientGjenopptaPåminnelsePåLegeerklæring } from '../../lib/clientApi';
import { useState } from 'react';
import { Alert } from '../alert/Alert';
import { isError } from '../../lib/utils/api';

export const KommendeMeldinger = ({
  kommendeMeldinger,
  behandlingsreferanse,
  refetchDialogmeldinger,
}: {
  kommendeMeldinger: KommendeMeldingDto[];
  behandlingsreferanse: string;
  refetchDialogmeldinger: () => Promise<unknown>;
}) => {
  const [loading, setLoading] = useState<string | null>(null);
  const [feilmelding, setFeilmelding] = useState<string | null>(null);

  const avbrytPåminnelse = async (bestillingId: string) => {
    setLoading(bestillingId);
    try {
      const res = await clientAvbrytPåminnelsePåLegeerklæring(bestillingId, behandlingsreferanse);
      if (isError(res)) {
        setFeilmelding(res.apiException.message);
        return;
      }
      setFeilmelding(null);
      await refetchDialogmeldinger();
    } finally {
      setLoading(null);
    }
  };

  const gjenopptaPåminnelse = async (bestillingId: string) => {
    setLoading(bestillingId);
    try {
      const res = await clientGjenopptaPåminnelsePåLegeerklæring(bestillingId, behandlingsreferanse);
      if (isError(res)) {
        setFeilmelding(res.apiException.message);
        return;
      }
      setFeilmelding(null);
      await refetchDialogmeldinger();
    } finally {
      setLoading(null);
    }
  };

  return (
    <VStack>
      <HStack gap={'space-12'} align={'center'}>
        <span className={styles.stipletLinje} />
        <Detail className={styles.stipletLinjeTekst}>Kommende</Detail>
        <span className={styles.stipletLinje} />
      </HStack>

      {kommendeMeldinger.map((kommendeMelding, index) => (
        <>
          {kommendeMelding.påminnelseErAvbrutt ? (
            <VStack key={index} gap={'space-4'} align={'end'} className={styles.meldingboksWrapper}>
              <Box className={styles.meldingboks}>
                <VStack gap={'space-8'}>
                  <VStack>
                    <Label size={'small'}>Påminnelse avbrutt</Label>
                  </VStack>
                  <Box>
                    <HStack align={'center'} gap={'space-4'}>
                      <Button
                        variant={'tertiary'}
                        loading={loading === kommendeMelding.bestillingId}
                        onClick={async () => {
                          await gjenopptaPåminnelse(kommendeMelding.bestillingId);
                        }}
                      >
                        <BodyShort size={'small'}>Gjenoppta påminnelse</BodyShort>
                      </Button>
                    </HStack>
                  </Box>
                </VStack>
              </Box>
            </VStack>
          ) : (
            <VStack key={index} gap={'space-4'} align={'end'} className={styles.meldingboksWrapper}>
              <Detail align={'end'}>
                Blir sendt automatisk {formatDatoMedMånedsnavn(kommendeMelding.påminnelseDato ?? '')}
              </Detail>
              <Box className={styles.meldingboks}>
                <VStack gap={'space-8'}>
                  <VStack>
                    <Detail>{`Til ${kommendeMelding.behandlerNavn}`}</Detail>
                    <Label size={'small'}>Automatisk påminnelse</Label>
                    <BodyShort
                      size={'small'}
                    >{`Sendes til behandler dersom svar ikke er mottatt innen ${formatDatoMedMånedsnavn(kommendeMelding.påminnelseDato ?? '')}.`}</BodyShort>
                  </VStack>
                  <Box>
                    <HStack align={'center'} gap={'space-4'}>
                      <Button
                        loading={loading === kommendeMelding.bestillingId}
                        variant={'tertiary'}
                        icon={<XMarkOctagonIcon fontSize="1.2rem" aria-hidden />}
                        onClick={async () => {
                          await avbrytPåminnelse(kommendeMelding.bestillingId);
                        }}
                      >
                        <BodyShort size={'small'}>Avbryt påminnelse</BodyShort>
                      </Button>
                    </HStack>
                  </Box>
                </VStack>
              </Box>
            </VStack>
          )}
          {feilmelding && <Alert variant={'error'}>{feilmelding}</Alert>}
        </>
      ))}
    </VStack>
  );
};
