import { SaksInfo } from 'lib/types/types';
import { TrekkTabell } from './TrekkTabell';
import { ExpansionCard, VStack } from '@navikt/ds-react';
import { formaterDatoForFrontend } from 'lib/utils/date';

export interface Postering {
  dato: string;
  beløp: number;
}

export interface Trekk {
  dato: string;
  beløp: number;
  posteringer: Postering[];
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const TrekkOversikt = ({ sak }: { sak: SaksInfo }) => {
  // TODO: Erstatt med api-kall
  const trekkForSak: Trekk[] = [
    {
      dato: '2025-02-01',
      beløp: 1800,
      posteringer: [
        { dato: '2025-02-13', beløp: 1000 },
        { dato: '2025-02-14', beløp: 800 },
      ],
    },
    {
      dato: '2025-01-01',
      beløp: 1800,
      posteringer: [
        { dato: '2025-01-13', beløp: 1000 },
        { dato: '2025-01-14', beløp: 800 },
      ],
    },
  ];

  return (
    <VStack gap={'4'}>
      {trekkForSak.map((trekk, index) => (
        <ExpansionCard
          size="small"
          key={trekk.dato}
          aria-label={`Trekk ${trekk.dato}`}
          defaultOpen={index === 0}
          style={{ maxWidth: '100ch' }}
        >
          <ExpansionCard.Header>
            <ExpansionCard.Title size={'small'}>Trekk {formaterDatoForFrontend(trekk.dato)}</ExpansionCard.Title>
          </ExpansionCard.Header>
          <ExpansionCard.Content>
            <TrekkTabell trekk={trekk} />
          </ExpansionCard.Content>
        </ExpansionCard>
      ))}
    </VStack>
  );
};
