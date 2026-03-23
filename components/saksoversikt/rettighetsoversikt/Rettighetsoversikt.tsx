import { BodyShort, Heading, HStack, VStack } from '@navikt/ds-react';
import { RettighetDto, SaksInfo } from 'lib/types/types';
import { formaterPeriode } from 'lib/utils/date';
import { Rettighet } from 'components/saksoversikt/rettighetsoversikt/Rettighet';
import styles from './Rettighetsoversikt.module.css';
import { isError } from 'lib/utils/api';
import { clientHentRettighetsdata } from 'lib/clientApi';
import useSWR from 'swr';

interface Props {
  sak: SaksInfo;
}

export const Rettighetsoversikt = (props: Props) => {
  const { saksnummer } = props.sak;
  const url = `/api/sak/${saksnummer}/rettighet`;
  const { data } = useSWR(url, () => clientHentRettighetsdata(saksnummer));

  if (isError(data)) {
    return;
  }

  const rettighetListe = data?.data;
  const vedtakStartdato = rettighetListe?.map((rettighet) => rettighet.startDato).sort()[0];
  const vedtakSluttdato = rettighetListe
    ?.map((rettighet) => rettighet.periodeKvoter.at(-1)?.periode.tom)
    .sort()
    .at(-1);

  if (rettighetListe != null && rettighetListe.length > 0) {
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
  }
};
