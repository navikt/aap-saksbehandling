import { Alert, Detail, Heading, HStack, Table, VStack } from '@navikt/ds-react';
import { Spinner } from 'components/felles/Spinner';
import { SaksInfo } from 'lib/types/types';
import { TableStyled } from 'components/tablestyled/TableStyled';
import { clientHentAktivitetspliktMedTrekk } from 'lib/clientApi';
import useSWR from 'swr';
import { isError } from 'lib/utils/api';
import { formaterBrudd, formaterGrunn } from 'components/behandlinger/aktivitetsplikt/11-9/Vurder11_9/utils';
import { formaterTilNok } from 'lib/utils/string';
import { formaterDatoForFrontend, sorterEtterNyesteDato } from 'lib/utils/date';

export const AktivitetspliktTrekk = ({ sak }: { sak: SaksInfo }) => {
  const {
    data: aktivitetspliktMedTrekk,
    isLoading,
    error,
  } = useSWR(`api/aktivitetsplikt/trekk//${sak.saksnummer}`, () => clientHentAktivitetspliktMedTrekk(sak.saksnummer), {
    revalidateOnFocus: false,
  });

  if (isLoading) {
    return <Spinner label="Henter trekk" />;
  } else if (error || isError(aktivitetspliktMedTrekk)) {
    return <Alert variant="error">Kunne ikke hente aktivitetsplikt § 11-9 med trekk</Alert>;
  }

  const vurderingerMedTrekk = aktivitetspliktMedTrekk?.data?.vurderingerMedTrekk || [];

  return vurderingerMedTrekk.length === 0 ? (
    <div>Ingen brudd på aktivitetsplikt 11-9 er registrert</div>
  ) : (
    <VStack gap="4">
      <Heading size="large">Aktivitetsplikt 11-9 med trekk</Heading>

      <HStack>
        <TableStyled size="small">
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell textSize={'small'}>Dato for brudd</Table.HeaderCell>
              <Table.HeaderCell textSize={'small'}>Brudd</Table.HeaderCell>
              <Table.HeaderCell textSize={'small'}>Grunn</Table.HeaderCell>
              <Table.HeaderCell textSize={'small'}>Dagsats</Table.HeaderCell>
              <Table.HeaderCell textSize={'small'}>Trekk i utbetaling</Table.HeaderCell>
              <Table.HeaderCell textSize={'small'}>Vurdering</Table.HeaderCell>
              <Table.HeaderCell />
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {vurderingerMedTrekk
              ?.sort((a, b) => sorterEtterNyesteDato(a.dato, b.dato))
              .map((vurdering, index) => (
                <Table.Row key={index}>
                  <Table.DataCell textSize={'small'}>{formaterDatoForFrontend(vurdering.dato)}</Table.DataCell>
                  <Table.DataCell textSize={'small'}>{formaterBrudd(vurdering.brudd)}</Table.DataCell>
                  <Table.DataCell textSize={'small'}>{formaterGrunn(vurdering.grunn)}</Table.DataCell>
                  <Table.DataCell textSize={'small'}>{formaterTilNok(vurdering.registrertTrekk?.beløp)}</Table.DataCell>
                  <Table.DataCell textSize={'small'}>
                    {vurdering.registrertTrekk?.posteringer?.map((postering, index) => {
                      return (
                        <div key={index}>
                          {formaterDatoForFrontend(postering.dato)} - {formaterTilNok(postering.beløp)}
                        </div>
                      );
                    }) || 'Ikke utført trekk'}
                  </Table.DataCell>
                  <Table.DataCell>
                    {vurdering.vurdertAv && (
                      <span>
                        <Detail>{`Vurdert av ${vurdering.vurdertAv.ansattnavn ? vurdering.vurdertAv.ansattnavn : vurdering.vurdertAv.ident}`}</Detail>
                        <Detail>{`${formaterDatoForFrontend(vurdering.vurdertAv.dato)}`}</Detail>
                      </span>
                    )}
                  </Table.DataCell>
                </Table.Row>
              ))}
          </Table.Body>
        </TableStyled>
      </HStack>
    </VStack>
  );
};
