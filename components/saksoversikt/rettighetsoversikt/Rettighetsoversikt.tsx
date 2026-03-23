import { BodyShort, Heading, HStack, VStack } from '@navikt/ds-react';
import { RettighetDto } from 'lib/types/types';
import { formaterPeriode } from 'lib/utils/date';
import { Rettighet } from 'components/saksoversikt/rettighetsoversikt/Rettighet';
import styles from './Rettighetsoversikt.module.css';

interface Props {
  rettighetListe: RettighetDto[];
}

export const Rettighetsoversikt = ({ rettighetListe }: Props) => {
  const vedtakStartdato = rettighetListe.map((rettighet) => rettighet.startDato).sort()[0];
  const vedtakSluttdato = rettighetListe
    .map((rettighet) => rettighet.periodeKvoter.at(-1)?.periode.tom)
    .sort()
    .at(-1);

  return (
    <VStack gap="6">
      <HStack paddingBlock={'0 2'} className={styles.vedtaksoverskrift} gap={'4'} align={'end'}>
        <Heading size="medium">Gjeldende vedtak</Heading>
        <BodyShort>{formaterPeriode(vedtakStartdato, vedtakSluttdato)}</BodyShort>
      </HStack>
      <HStack>
        {rettighetListe.map((rettighetdata: RettighetDto) => (
          <Rettighet key={`${rettighetdata.type}-${rettighetdata.startDato}`} rettighetsdata={rettighetdata} />
        ))}
      </HStack>
    </VStack>
  );
};
