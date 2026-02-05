import { Heading, HStack, VStack } from '@navikt/ds-react';
import { RettighetDto, SaksInfo } from 'lib/types/types';
import { formaterPeriode } from 'lib/utils/date';
import { Rettighet } from 'components/saksoversikt/rettighetsoversikt/Rettighet';
import styles from './Rettighetsoversikt.module.css';
import { isError } from 'lib/utils/api';
import useSWR from 'swr';
import { clientHentRettighetsdata } from 'lib/clientApi';

interface Props {
  sak: SaksInfo;
}

export const Rettighetsoversikt = (props: Props) => {
  const { saksnummer, periode } = props.sak;
  const url = `/api/sak/${saksnummer}/rettighet`;
  const { data } = useSWR(url, () => clientHentRettighetsdata(saksnummer));

  if (isError(data)) {
    return;
  }

  const rettighetListe = data?.data;

  if (rettighetListe != null && rettighetListe.length > 0) {
    return (
      <VStack gap="6">
        <div className={styles.gjeldendeVedtak}>
          <Heading size="medium">Gjeldende vedtak</Heading>
          <p className={styles.vedtaksperiode}>{formaterPeriode(periode.fom, periode.tom)}</p>
        </div>
        <HStack>
          {rettighetListe.map((rettighetdata: RettighetDto, index: number) => (
            <Rettighet key={index} rettighetsdata={rettighetdata} />
          ))}
        </HStack>
      </VStack>
    );
  }
};
