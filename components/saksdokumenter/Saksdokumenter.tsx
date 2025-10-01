import { BodyShort, Button, HStack, Link, Pagination, Table, VStack } from '@navikt/ds-react';
import { formaterDatoForFrontend } from 'lib/utils/date';
import useSWR from 'swr';
import { useSaksnummer } from 'hooks/saksbehandling/BehandlingHook';
import { useConfigForm } from 'components/form/FormHook';
import { FormField } from 'components/form/FormField';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { TableStyled } from 'components/tablestyled/TableStyled';
import { clientHentAlleDokumenterPåSak } from 'lib/dokumentClientApi';
import { isError } from 'lib/utils/api';
import { useState } from 'react';
import { ArrowDownRightIcon, ExternalLinkIcon } from '@navikt/aksel-icons';
import { Journalposttype } from 'lib/types/journalpost';
import { ArrowOrange } from 'components/icons/ArrowOrange';
import { ArrowGreen } from 'components/icons/ArrowGreen';

interface FormFields {
  dokumentnavn: string;
}

export const Saksdokumenter = () => {
  const saksnummer = useSaksnummer();
  const { data: journalposterPåSak } = useSWR(`api/dokumenter/sak/${saksnummer}`, () =>
    clientHentAlleDokumenterPåSak(saksnummer)
  );
  const [pageState, setPageState] = useState(1);
  const dokumenterPerPage = 7;

  const { form, formFields } = useConfigForm<FormFields>({
    dokumentnavn: {
      type: 'text',
      label: 'Søk i dokumenttitler',
    },
  });

  if (isError(journalposterPåSak)) {
    return <ApiException apiResponses={[journalposterPåSak]} />;
  }

  const dokumenterFiltrertPåSøk =
    (!form.watch('dokumentnavn')
      ? journalposterPåSak?.data
      : journalposterPåSak?.data?.filter((journalpost) =>
          journalpost.dokumenter?.some((dok) =>
            dok.tittel?.toLowerCase().includes(form.watch('dokumentnavn').toLowerCase())
          )
        )) || [];

  const skalVisePaginering = dokumenterFiltrertPåSøk.length > dokumenterPerPage;

  const antallSider =
    dokumenterFiltrertPåSøk.length > dokumenterPerPage
      ? Math.ceil(dokumenterFiltrertPåSøk.length / dokumenterPerPage)
      : 1;

  const journalposter = skalVisePaginering
    ? dokumenterFiltrertPåSøk.slice((pageState - 1) * dokumenterPerPage, pageState * dokumenterPerPage)
    : dokumenterFiltrertPåSøk;

  return (
    <VStack gap={'4'}>
      <HStack gap="2" align="end" wrap={false} justify="space-between">
        <FormField form={form} formField={formFields.dokumentnavn} />

        <Button
          as={Link}
          variant="tertiary"
          size="small"
          icon={<ExternalLinkIcon />}
          target="_blank"
          href={`/saksbehandling/sak/${saksnummer}/?t=DOKUMENTER`}
        >
          Gå til dokumentoversikten
        </Button>
      </HStack>

      <TableStyled size={'small'}>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell textSize={'small'}>Type</Table.HeaderCell>
            <Table.HeaderCell textSize={'small'}>Tittel</Table.HeaderCell>
            <Table.HeaderCell textSize={'small'}>Brevkode</Table.HeaderCell>
            <Table.HeaderCell textSize={'small'}>Journalført</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {journalposter.map((journalpost) =>
            journalpost.dokumenter?.map((dok, index) => (
              <Table.Row key={dok.dokumentInfoId}>
                {/* Iht. dokumentasjonen til Saf/Dokarkiv skal det første dokumentet alltid være hoveddokumentet */}
                {index === 0 ? (
                  <HoveddokumentRow
                    journalpostId={journalpost.journalpostId}
                    dokumentInfoId={dok.dokumentInfoId}
                    tittel={dok.tittel}
                    brevkode={dok.brevkode}
                    journalposttype={journalpost.journalposttype}
                    datoOpprettet={journalpost.datoOpprettet}
                  />
                ) : (
                  <VedleggRow
                    journalpostId={journalpost.journalpostId}
                    dokumentInfoId={dok.dokumentInfoId}
                    tittel={dok.tittel}
                  />
                )}
              </Table.Row>
            ))
          )}
        </Table.Body>
      </TableStyled>

      {skalVisePaginering && (
        <VStack align={'center'}>
          <Pagination
            page={pageState}
            onPageChange={setPageState}
            count={antallSider}
            boundaryCount={1}
            siblingCount={1}
            size={'small'}
            srHeading={{
              tag: 'h2',
              text: 'Tabellpaginering',
            }}
          />
        </VStack>
      )}
    </VStack>
  );
};

const HoveddokumentRow = ({
  journalpostId,
  dokumentInfoId,
  tittel,
  brevkode,
  journalposttype,
  datoOpprettet,
}: {
  journalpostId: string;
  dokumentInfoId: string;
  tittel: string;
  brevkode?: string;
  journalposttype: Journalposttype;
  datoOpprettet?: string;
}) => (
  <>
    <Table.DataCell>
      <div style={{ minWidth: '3rem' }}>
        {journalposttype === Journalposttype.U && <ArrowOrange title={'Utgående dokument'} />}
        {journalposttype === Journalposttype.I && <ArrowGreen title={'Inngående dokument'} />}
      </div>
    </Table.DataCell>
    <Table.DataCell>
      <HStack gap="1" wrap={false}>
        <Link href={`/saksbehandling/api/dokumenter/${journalpostId}/${dokumentInfoId}`} target="_blank">
          <BodyShort size={'small'}>{tittel}</BodyShort>
        </Link>
      </HStack>
    </Table.DataCell>
    <Table.DataCell>
      <BodyShort size={'small'}>{brevkode}</BodyShort>
    </Table.DataCell>
    <Table.DataCell>
      <BodyShort size={'small'}>{datoOpprettet && formaterDatoForFrontend(datoOpprettet)}</BodyShort>
    </Table.DataCell>
  </>
);

const VedleggRow = ({
  journalpostId,
  dokumentInfoId,
  tittel,
}: {
  journalpostId: string;
  dokumentInfoId: string;
  tittel: string;
}) => (
  <>
    <Table.DataCell />

    <Table.DataCell colSpan={100}>
      <HStack gap="1" wrap={false}>
        <BodyShort textColor="subtle">
          <ArrowDownRightIcon />
        </BodyShort>

        <Link href={`/saksbehandling/api/dokumenter/${journalpostId}/${dokumentInfoId}`} target="_blank">
          <BodyShort size={'small'}>{tittel}</BodyShort>
        </Link>
      </HStack>
    </Table.DataCell>
  </>
);
