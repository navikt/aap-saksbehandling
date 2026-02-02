import { Heading, HStack, VStack } from '@navikt/ds-react';
import { RettighetDto } from 'lib/types/types';
import { formaterPeriode } from 'lib/utils/date';
import { Rettighet } from 'components/saksoversikt/rettighetsoversikt/Rettighet';
import styles from './Rettighetsoversikt.module.css';
import { v4 as uuidv4 } from 'uuid';
import { isError } from 'lib/utils/api';
import useSWR from 'swr';
import { clientHentRettighetsdata } from 'lib/clientApi';

interface Props {
  saksnummer: string;
}

export const Rettighetsoversikt = (props: Props) => {
  const { saksnummer } = props;
  const url = `/api/sak/${saksnummer}/rettighet`;
  const { data } = useSWR(url, () => clientHentRettighetsdata(saksnummer));

  if (isError(data)) {
    return;
  }

  const rettighetListe = data?.data as RettighetDto[];

  if (rettighetListe != null && rettighetListe.length > 0) {
    return (
      <VStack gap="6">
        <div className={styles.gjeldendeVedtak}>
          <Heading size="medium">Gjeldende vedtak</Heading>
          <p className={styles.vedtaksperiode}>
            {formaterPeriode(rettighetListe?.at(0)?.startDato, rettighetListe?.at(-1)?.maksDato)}
          </p>
        </div>
        <HStack>
          {rettighetListe?.map((rettighetdata: RettighetDto) => (
            <Rettighet key={uuidv4()} rettighetsdata={rettighetdata} />
          ))}
        </HStack>
      </VStack>
    );
  }
};
