import { KravGrunnlag, KravVurdering, KravVurderingLøsning } from 'lib/types/types';
import { BodyShort, Button, Table, Tag } from '@navikt/ds-react';
import { TableStyled } from 'components/tablestyled/TableStyled';
import {
  finnOverstyrMuligRettFra,
  finnOverstyrMuligRettFraFraLøsning,
  finnSøknadsdato,
  finnSøknadsdatoFraLøsning,
  formaterKravtype,
} from 'components/behandlinger/krav/kravutils';
import { formaterDatoForFrontend } from 'lib/utils/date';

type Props = {
  readOnly?: boolean;
  grunnlag?: KravGrunnlag;
  endredeVedtatte: Record<string, KravVurderingLøsning>;
  endredeNye: Record<string, KravVurderingLøsning>;
  onEndreKrav: (krav: KravVurdering, erVedtatt: boolean) => void;
};

export const KravTabell = ({ readOnly, grunnlag, endredeVedtatte, endredeNye, onEndreKrav }: Props) => {
  return !grunnlag || (grunnlag?.vedtatteVurderinger.length === 0 && grunnlag?.nyeVurderinger.length === 0) ? (
    <BodyShort>Det finnes ingen vedtatte vurderinger.</BodyShort>
  ) : (
    <TableStyled size="medium">
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell></Table.HeaderCell>
          <Table.HeaderCell>JournalpostId</Table.HeaderCell>
          <Table.HeaderCell>Type</Table.HeaderCell>
          <Table.HeaderCell>Søknadsdato</Table.HeaderCell>
          <Table.HeaderCell>Mulig rett fra</Table.HeaderCell>
          <Table.HeaderCell>Vurdert av</Table.HeaderCell>
          <Table.HeaderCell>Status</Table.HeaderCell>
          <Table.HeaderCell>Valg</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {grunnlag.nyeVurderinger.map((vurdering) => {
          const aktivLøsning = endredeNye[vurdering.referanse];
          return (
            <Table.ExpandableRow
              content={aktivLøsning?.begrunnelse ?? vurdering.begrunnelse}
              key={vurdering.referanse}
            >
              <Table.DataCell>{vurdering.journalpostId.identifikator}</Table.DataCell>
              <Table.DataCell>{formaterKravtype(vurdering.type)}</Table.DataCell>
              <Table.DataCell>{formaterSøknadsdatoRad(vurdering, aktivLøsning)}</Table.DataCell>
              <Table.DataCell>{formaterOverstyrMuligRettFraRad(vurdering, aktivLøsning)}</Table.DataCell>
              <Table.DataCell>{vurdering.vurdertAv.ident}</Table.DataCell>
              <Table.DataCell>
                {aktivLøsning ? (
                  <Tag variant="warning" size="small">Endret</Tag>
                ) : (
                  <Tag variant="alt1" size="small">Ny</Tag>
                )}
              </Table.DataCell>
              <Table.DataCell>
                <Button size="small" variant="secondary" disabled={readOnly} onClick={() => onEndreKrav(vurdering, false)}>
                  Endre
                </Button>
              </Table.DataCell>
            </Table.ExpandableRow>
          );
        })}
        {grunnlag.vedtatteVurderinger.map((vurdering) => {
          const aktivLøsning = endredeVedtatte[vurdering.referanse];
          return (
            <Table.ExpandableRow
              content={aktivLøsning?.begrunnelse ?? vurdering.begrunnelse}
              key={vurdering.referanse}
            >
              <Table.DataCell>{vurdering.journalpostId.identifikator}</Table.DataCell>
              <Table.DataCell>{formaterKravtype(vurdering.type)}</Table.DataCell>
              <Table.DataCell>{formaterSøknadsdatoRad(vurdering, aktivLøsning)}</Table.DataCell>
              <Table.DataCell>{formaterOverstyrMuligRettFraRad(vurdering, aktivLøsning)}</Table.DataCell>
              <Table.DataCell>{vurdering.vurdertAv.ident}</Table.DataCell>
              <Table.DataCell>
                {aktivLøsning ? (
                  <Tag variant="warning" size="small">Endret</Tag>
                ) : (
                  <Tag variant="success" size="small">Vedtatt</Tag>
                )}
              </Table.DataCell>
              <Table.DataCell>
                <Button size="small" variant="secondary" disabled={readOnly} onClick={() => onEndreKrav(vurdering, true)}>
                  Endre
                </Button>
              </Table.DataCell>
            </Table.ExpandableRow>
          );
        })}
      </Table.Body>
    </TableStyled>
  );
};

function formaterSøknadsdatoRad(vurdering: KravVurdering, løsning?: KravVurderingLøsning) {
  const dato = løsning ? finnSøknadsdatoFraLøsning(løsning)?.dato : finnSøknadsdato(vurdering)?.dato;
  return dato ? formaterDatoForFrontend(dato) : '-';
}

function formaterOverstyrMuligRettFraRad(vurdering: KravVurdering, løsning?: KravVurderingLøsning) {
  const dato = løsning
    ? finnOverstyrMuligRettFraFraLøsning(løsning)?.dato
    : finnOverstyrMuligRettFra(vurdering)?.dato;
  return dato ? formaterDatoForFrontend(dato) : '-';
}
