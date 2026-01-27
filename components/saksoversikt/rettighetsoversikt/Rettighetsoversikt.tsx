import { isError } from 'lib/utils/api';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { clientHentRettighetsdata } from 'lib/clientApi';
import { Heading, HStack, VStack } from '@navikt/ds-react';
import { RettighetDto } from 'lib/types/types';
import { hentSak } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { formaterPeriode } from 'lib/utils/date';
import { Rettighet } from 'components/saksoversikt/rettighetsoversikt/Rettighet';
import styles from './Rettighetsoversikt.module.css';
import { v4 as uuidv4 } from 'uuid';

export const Rettighetsoversikt = (saksnummer: string) => {
  //const rettighetsdata = await clientHentRettighetsdata(saksnummer);
  const rettighetsdata = {
    data: [
      {
        kvote: 123,
        avslagDato: '2026-01-02',
        avslagÅrsak: 'STANS',
        bruktKvote: 20,
        gjenværendeKvote: 10,
        maksDato: '2027-02-05',
        startDato: '2025-04-12',
        type: 'ARBEIDSSØKER',
      },
      {
        kvote: 123,
        avslagDato: '2026-01-02',
        avslagÅrsak: 'STANS',
        bruktKvote: 20,
        gjenværendeKvote: 10,
        maksDato: '2027-02-05',
        startDato: '2025-04-12',
        type: 'SYKEPENGEERSTATNING',
      },
      {
        kvote: 123,
        avslagDato: '2026-01-02',
        avslagÅrsak: 'STANS',
        bruktKvote: 20,
        gjenværendeKvote: 10,
        maksDato: '2027-02-05',
        startDato: '2025-04-12',
        type: 'SYKEPENGEERSTATNING',
      },
      {
        kvote: 123,
        avslagDato: '2026-01-02',
        avslagÅrsak: 'STANS',
        bruktKvote: 20,
        gjenværendeKvote: 10,
        maksDato: '2027-02-05',
        startDato: '2025-04-12',
        type: 'SYKEPENGEERSTATNING',
      },
      {
        kvote: 123,
        avslagDato: '2026-01-02',
        avslagÅrsak: 'STANS',
        bruktKvote: 20,
        gjenværendeKvote: 10,
        maksDato: '2027-02-05',
        startDato: '2025-04-12',
        type: 'SYKEPENGEERSTATNING',
      },
      {
        kvote: 123,
        avslagDato: '2026-01-02',
        avslagÅrsak: 'STANS',
        bruktKvote: 20,
        gjenværendeKvote: 10,
        maksDato: '2027-02-05',
        startDato: '2025-04-12',
        type: 'STUDENT',
      },
    ] as RettighetDto[],
  };

  //if (isError(rettighetsdata)) {
  //  return <ApiException apiResponses={[rettighetsdata]} />;
  //}

  const data = rettighetsdata.data as RettighetDto[];

  return (
    <VStack gap="6">
      <div className={styles.gjeldendeVedtak}>
        <Heading size="medium">Gjeldende vedtak</Heading>
        <p className={styles.vedtaksperiode}>{formaterPeriode('2025-02-01', '2026-02-01')}</p>
      </div>
      <HStack>
        {data.map((rettighetdata) => (
          <Rettighet key={uuidv4()} rettighetsdata={rettighetdata} />
        ))}
      </HStack>
    </VStack>
  );
};
