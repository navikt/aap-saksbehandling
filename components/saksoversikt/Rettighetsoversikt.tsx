import { isError } from 'lib/utils/api';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { clientHentRettighetsdata } from 'lib/clientApi';
import { Button, Heading, HStack, Table, VStack } from '@navikt/ds-react';
import { formaterDatoMedTidspunktForFrontend } from 'lib/utils/date';
import { Behandlingstype, formaterBehandlingType, formatterÅrsakTilOpprettelseTilTekst } from 'lib/utils/behandling';
import { capitalize } from 'lodash';
import { formaterVurderingsbehov } from 'lib/utils/vurderingsbehov';
import { BehandlingButtons } from 'components/saksoversikt/BehandlingButtons';
import { SakDevTools } from 'components/saksoversikt/SakDevTools';
import { RettighetDto } from 'lib/types/types';

interface Props {
  saksnummer: string;
}

export const Rettighetsoversikt = async ({ saksnummer }: Props) => {
  const rettighetsdata = await clientHentRettighetsdata(saksnummer);

  if (isError(rettighetsdata)) {
    return <ApiException apiResponses={[rettighetsdata]} />;
  }

  const data = rettighetsdata.data as RettighetDto[];

  return (
    <VStack gap="8">
      <HStack justify="space-between">
        <Heading size="large">Sak {sak.saksnummer}</Heading>

        <HStack gap="4">
          <Button
            variant="secondary"
            size="small"
            onClick={() => router.push(`/saksbehandling/sak/${sak.saksnummer}/klage`)}
          >
            Opprett klage
          </Button>
          {kanRegistrerebrudd && (
            <Button
              variant="secondary"
              size="small"
              onClick={() => router.push(`/saksbehandling/sak/${sak.saksnummer}/aktivitet`)}
            >
              Vurder aktivitetsplikt
            </Button>
          )}

          {kanRevurdere && (
            <Button
              variant="secondary"
              size="small"
              onClick={() => router.push(`/saksbehandling/sak/${sak.saksnummer}/revurdering`)}
            >
              Opprett revurdering
            </Button>
          )}

          {kanRevurdere && (
            <Button
              variant="secondary"
              size="small"
              onClick={() => router.push(`/saksbehandling/sak/${sak.saksnummer}/oppfolging`)}
            >
              Opprett oppfølgingsoppgave
            </Button>
          )}
        </HStack>
      </HStack>

      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Opprettet</Table.HeaderCell>
            <Table.HeaderCell>Type</Table.HeaderCell>
            <Table.HeaderCell>Årsak</Table.HeaderCell>
            <Table.HeaderCell>Status</Table.HeaderCell>
            <Table.HeaderCell>Vurderingsbehov</Table.HeaderCell>
            <Table.HeaderCell align="right">Handlinger</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {sak?.behandlinger?.map((behandling) => (
            <Table.Row key={behandling.referanse}>
              <Table.DataCell>{formaterDatoMedTidspunktForFrontend(behandling.opprettet)}</Table.DataCell>
              <Table.DataCell>{formaterBehandlingType(behandling.type as Behandlingstype)}</Table.DataCell>
              <Table.DataCell>{formatterÅrsakTilOpprettelseTilTekst(behandling.årsakTilOpprettelse)}</Table.DataCell>
              <Table.DataCell>{capitalize(behandling.status)}</Table.DataCell>
              <Table.DataCell>
                {behandling.vurderingsbehov.map((behov) => formaterVurderingsbehov(behov)).join(', ')}
              </Table.DataCell>

              <Table.DataCell>
                <BehandlingButtons key={behandling.referanse} sak={sak} behandling={behandling}></BehandlingButtons>
              </Table.DataCell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>

      {lokalDevToolsForBehandlingOgSak && (
        <SakDevTools
          saksnummer={sak.saksnummer}
          behandlinger={sak.behandlinger.map((e) => ({ referanse: e.referanse, type: e.type }))}
        />
      )}
    </VStack>
  );
};
