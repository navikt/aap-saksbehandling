import { BodyShort, Button, HStack, Link, Pagination, Table, Tooltip, VStack } from '@navikt/ds-react';
import { formaterDatoForFrontend, formaterDatoMedTidspunktForFrontend } from 'lib/utils/date';
import useSWR from 'swr';
import { useSaksnummer } from 'hooks/saksbehandling/BehandlingHook';
import { useConfigForm } from 'components/form/FormHook';
import { FormField } from 'components/form/FormField';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { TableStyled } from 'components/tablestyled/TableStyled';
import { clientHentAlleDokumenterPåSak } from 'lib/dokumentClientApi';
import { isError } from 'lib/utils/api';
import { useState } from 'react';
import { ArrowDownRightIcon, ExternalLinkIcon, InboxDownIcon, InboxUpIcon } from '@navikt/aksel-icons';
import { Journalposttype } from 'lib/types/journalpost';
import { storForbokstav } from 'lib/utils/string';

interface FormFields {
  dokumentnavn: string;
  visMeldekort: boolean;
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
    visMeldekort: {
      type: 'switch',
      label: 'Vis meldekort',
      // hideLabel: true,
      defaultValue: false,
    },
  });

  if (isError(journalposterPåSak)) {
    return <ApiException apiResponses={[journalposterPåSak]} />;
  }

  const dokumentnavn = form.watch('dokumentnavn');
  const visMeldekort = form.watch('visMeldekort');

  const dokumenterFiltrertPåSøk =
    journalposterPåSak?.data?.filter((journalpost) =>
      journalpost.dokumenter?.some((dok) => {
        const inklMeldekort = visMeldekort || !dok.brevkode?.includes('00-10.02');

        return dokumentnavn
          ? dok.tittel?.toLowerCase().includes(dokumentnavn.toLowerCase()) && inklMeldekort
          : inklMeldekort;
      })
    ) || [];

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
      <div>
        <Button
          as={Link}
          variant="tertiary"
          size="small"
          icon={<ExternalLinkIcon />}
          target="_blank"
          href={`/saksbehandling/sak/${saksnummer}/?t=DOKUMENTER`}
        >
          Se andre relevante dokumenter
        </Button>
      </div>

      <HStack gap="4" align="end" wrap={false}>
        <FormField form={form} formField={formFields.dokumentnavn} />
        <FormField form={form} formField={formFields.visMeldekort} />
      </HStack>

      <TableStyled size={'small'}>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell />
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
      {journalposttype === Journalposttype.U && (
        <Tooltip content="Utgående dokument">
          <InboxUpIcon style={{ color: 'var(--a-orange-600)' }} />
        </Tooltip>
      )}
      {journalposttype === Journalposttype.I && (
        <Tooltip content="Inngående dokument">
          <InboxDownIcon style={{ color: 'var(--a-green-500)' }} />
        </Tooltip>
      )}
    </Table.DataCell>
    <Table.DataCell>
      <HStack gap="1" wrap={false}>
        <Link href={`/saksbehandling/api/dokumenter/${journalpostId}/${dokumentInfoId}`} target="_blank">
          <BodyShort size={'small'}>{tittel}</BodyShort>
        </Link>
      </HStack>
    </Table.DataCell>
    <Table.DataCell>
      <BodyShort size={'small'}>{brevkode ? storForbokstav(brevkode) : '-'}</BodyShort>
    </Table.DataCell>
    <Table.DataCell>
      {datoOpprettet && (
        <Tooltip content={formaterDatoMedTidspunktForFrontend(datoOpprettet)}>
          <BodyShort size={'small'}>{formaterDatoForFrontend(datoOpprettet)}</BodyShort>
        </Tooltip>
      )}
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
